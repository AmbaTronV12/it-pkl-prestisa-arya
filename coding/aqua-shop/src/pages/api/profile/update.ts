import { NextApiResponse } from 'next';
import { verifyToken, AuthenticatedRequest } from '../authMiddleware';
import { updateUser } from '../database';
import bcrypt from 'bcrypt';

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  console.log("🔹 Received request:", req.method); // Log request method

  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    console.log("🔹 Verifying token...");
    verifyToken(req, res, async () => {
      console.log("✅ Token verified!");

      if (!req.user) {
        console.log("❌ Unauthorized request - No user found.");
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userId = req.user.id;
      const { username, email, password, birth_date, phone_number } = req.body;
      console.log("🔹 Update request for user ID:", userId);

      let passwordHash: string | undefined;
      if (password) {
        console.log("🔹 Hashing new password...");
        const saltRounds = 10;
        passwordHash = await bcrypt.hash(password, saltRounds);
      }

      const updates: any = { username, email, birth_date, phone_number };
      if (passwordHash) {
        updates.password_hash = passwordHash;
      }

      console.log("🔹 Updating user with data:", updates);
      await updateUser(userId, updates);
      console.log("✅ Update successful!");

      res.status(200).json({ message: 'Profile updated successfully',
        user: updateUser,
       });
    });
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}
