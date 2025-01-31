import { NextApiResponse } from 'next';
import { verifyToken, AuthenticatedRequest } from '../../authMiddleware';
import { updateShippingAddress } from '../../database';

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    verifyToken(req, res, async () => {
      try {
        if (!req.user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const { addressId, updates } = req.body;
        if (!addressId || !updates) {
          return res.status(400).json({ error: 'Address ID and updates are required' });
        }

        await updateShippingAddress(addressId, updates);
        res.status(200).json({ message: 'Shipping address updated successfully' });
      } catch (error) {
        console.error('Error updating shipping address:', error);
        res.status(500).json({ error: 'Failed to update shipping address' });
      }
    });
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
