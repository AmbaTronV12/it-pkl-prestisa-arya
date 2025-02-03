import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken, AuthenticatedRequest } from '../../authMiddleware';
import { updateUserProfilePhoto } from '../../database';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Required for file uploads, but blocks JSON body parsing
  },
};

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    verifyToken(req, res, async () => {
      try {
        // **Manually handle JSON body parsing**
        if (req.headers['content-type'] === 'application/json') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { imageUrl } = JSON.parse(body); // Parse JSON body manually
              if (!imageUrl) {
                return res.status(400).json({ error: 'No image URL provided' });
              }

              // Save the online image URL directly in the database
              await updateUserProfilePhoto(req.user?.id, imageUrl);
              return res.status(200).json({ message: 'Profile photo updated successfully', profilePhotoUrl: imageUrl });
            } catch (error) {
              return res.status(400).json({ error: 'Invalid JSON format' });
            }
          });
          return;
        }

        // **Otherwise, handle file uploads using Formidable**
        const form = new formidable.IncomingForm({
          multiples: false,
          uploadDir: path.join(process.cwd(), '/public/uploads'),
          keepExtensions: true,
        });

        form.parse(req, async (err, fields, files) => {
          if (err) {
            return res.status(500).json({ error: 'Error processing file' });
          }

          const file = files.profile_photo?.[0]; // Get the uploaded file

          if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
          }

          const newFilePath = `/uploads/${file.newFilename}`;
          await updateUserProfilePhoto(req.user?.id, newFilePath);

          res.status(200).json({ message: 'Profile photo updated successfully', profilePhotoUrl: newFilePath });
        });
      } catch (error) {
        console.error('Error uploading profile photo:', error);
        res.status(500).json({ error: 'Failed to upload profile photo' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
