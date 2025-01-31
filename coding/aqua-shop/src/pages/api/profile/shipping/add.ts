import { NextApiResponse } from 'next';
import { verifyToken, AuthenticatedRequest } from '../../authMiddleware';
import { addShippingAddress } from '../../database';

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    verifyToken(req, res, async () => {
      try {
        if (!req.user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const { street, city, state, country, zip_code } = req.body;
        if (!street || !city || !state || !country || !zip_code) {
          return res.status(400).json({ error: 'All address fields are required' });
        }

        await addShippingAddress(req.user.id, street, city, state, country, zip_code);
        res.status(201).json({ message: 'Shipping address added successfully' });
      } catch (error) {
        console.error('Error adding shipping address:', error);
        res.status(500).json({ error: 'Failed to add shipping address' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
