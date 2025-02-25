import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken, AuthenticatedRequest } from "../../authMiddleware";
import { updateUserProfilePhoto } from "../../database";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Disable body parser for file uploads
  },
};

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    verifyToken(req, res, async () => {
      try {
        console.log("📥 Receiving upload request...");

        const form = formidable({
          multiples: false,
          uploadDir: path.join(process.cwd(), 'public/uploads'), // Save to /public/uploads
          keepExtensions: true,
        });

        form.parse(req, async (err, fields, files) => {
          if (err) {
            console.error("🚨 Error parsing form:", err);
            return res.status(500).json({ error: "Error processing file" });
          }

          console.log("✅ Form parsed successfully!", files);

          const file = files.profile_photo?.[0];

          if (!file) {
            console.error("❌ No file received!");
            return res.status(400).json({ error: "No file uploaded" });
          }

          console.log("📂 File received:", file);

          const uploadDir = path.join(process.cwd(), "public/uploads");
          if (!fs.existsSync(uploadDir)) {
            console.log("📁 Creating uploads folder...");
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const newFilePath = path.join(uploadDir, file.newFilename);
          console.log("🔄 Moving file to:", newFilePath);

          fs.renameSync(file.filepath, newFilePath);
          const relativePath = `/uploads/${file.newFilename}`;
          await updateUserProfilePhoto(req.user?.id, relativePath);

          console.log("✅ Upload successful! New profile photo:", relativePath);
          res.status(200).json({ message: "Profile photo updated successfully", profilePhotoUrl: relativePath });
        });
      } catch (error) {
        console.error("🔥 Error uploading profile photo:", error);
        res.status(500).json({ error: "Failed to upload profile photo" });
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

