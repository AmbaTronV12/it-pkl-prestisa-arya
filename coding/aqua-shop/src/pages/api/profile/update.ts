import { NextApiResponse } from 'next';
import { verifyToken, AuthenticatedRequest } from '../authMiddleware';
import { updateUser } from '../database';
import bcrypt from 'bcrypt';

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    verifyToken(req, res, async () => {
      try {
        if (!req.user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = req.user.id;
        const { username, email, password, birth_date, phone_number, shipping_address } = req.body;

        let passwordHash = undefined;
        if (password) {
          const saltRounds = 10;
          passwordHash = await bcrypt.hash(password, saltRounds);
        }

        // Update user data
        await updateUser(userId, {
            username, 
            email, 
            birth_date, 
            phone_number, 
            shipping_address 
        });

        res.status(200).json({ message: 'Profile updated successfully' });
      } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
      }
    });
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
