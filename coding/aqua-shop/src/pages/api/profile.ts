import { NextApiResponse } from 'next';
import { verifyToken, AuthenticatedRequest } from './authMiddleware'; // Import custom type
import { getUserById } from './database';

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Verify JWT first
    verifyToken(req, res, async () => {
      try {
        if (!req.user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = req.user.id; // Get user ID from decoded token
        const user = await getUserById(userId); // Fetch user details from DB

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        const profilePhotoUrl = user.profile_photo 
          ? `${process.env.NEXT_PUBLIC_BASE_URL}${user.profile_photo}`
          : "";

        // Return user data with updated profile_photo URL
        res.status(200).json({ 
          ...user, 
          profile_photo: profilePhotoUrl 
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
