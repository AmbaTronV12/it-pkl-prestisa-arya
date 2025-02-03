import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken, AuthenticatedRequest } from '../../authMiddleware';
import { addPaymentMethod } from '../../database';

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    verifyToken(req, res, async () => {
      try {
        if (!req.user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const userId = req.user.id;
        const { card_type, card_holder, card_number, expiration_date, cvv } = req.body;

        if (!card_type || !card_holder || !card_number || !expiration_date || !cvv) {
          return res.status(400).json({ error: 'All required fields must be provided' });
        }

        await addPaymentMethod(userId, { card_type, card_holder, card_number, expiration_date, cvv });

        res.status(201).json({ message: 'Payment method added successfully' });
      } catch (error) {
        console.error('Error adding payment method:', error);
        res.status(500).json({ error: 'Failed to add payment method' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
