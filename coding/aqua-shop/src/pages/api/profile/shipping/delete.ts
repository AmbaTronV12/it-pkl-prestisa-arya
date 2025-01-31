import { NextApiResponse } from 'next';
import { verifyToken, AuthenticatedRequest } from '../../authMiddleware';
import { deleteShippingAddress } from '../../database';

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    verifyToken(req, res, async () => {
      try {
        if (!req.user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const { addressId } = req.body;
        if (!addressId) {
          return res.status(400).json({ error: 'Address ID is required' });
        }

        await deleteShippingAddress(addressId);
        res.status(200).json({ message: 'Shipping address deleted successfully' });
      } catch (error) {
        console.error('Error deleting shipping address:', error);
        res.status(500).json({ error: 'Failed to delete shipping address' });
      }
    });
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
