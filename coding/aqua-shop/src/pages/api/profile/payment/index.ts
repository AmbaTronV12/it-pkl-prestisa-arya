import { NextApiResponse } from 'next';
import { verifyToken, AuthenticatedRequest } from '../../authMiddleware';
import { getPaymentMethod } from '../../database';

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    verifyToken(req, res, async () => {
      try {
        if (!req.user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const paymentMethod = await getPaymentMethod(req.user.id);

        if (!paymentMethod || Object.keys(paymentMethod).length === 0) {
            return res.status(200).json(null);  // Return null if no payment method is found
          }          

        res.status(200).json(paymentMethod);
      } catch (error) {
        console.error('Error fetching payment method:', error);
        res.status(500).json({ error: 'Failed to fetch payment method' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
