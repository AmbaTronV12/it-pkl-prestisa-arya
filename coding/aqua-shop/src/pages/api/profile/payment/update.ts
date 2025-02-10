import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken, AuthenticatedRequest } from '../../authMiddleware';
import { updatePaymentMethod } from '../../database';

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    verifyToken(req, res, async () => {
      try {
        if (!req.user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = req.user.id;
        const { card_type, cardholder_name, card_number, expiration_date, cvv } = req.body;

        const updates = {
          ...(card_type && { card_type }),
          ...(cardholder_name && { cardholder_name }),
          ...(card_number && { card_number }),
          ...(expiration_date && { expiration_date }),
          ...(cvv && { cvv }),
        };

        if (Object.keys(updates).length === 0) {
          return res.status(400).json({ error: 'No fields provided for update' });
        }

        await updatePaymentMethod(userId, updates);

        res.status(200).json({ message: 'Payment method updated successfully' });
      } catch (error) {
        console.error('Error updating payment method:', error);
        res.status(500).json({ error: 'Failed to update payment method' });
      }
    });
  } else {
    res.setHeader('Allow', ['PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
