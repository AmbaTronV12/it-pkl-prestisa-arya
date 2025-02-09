import { NextApiResponse } from 'next';
import { verifyToken, AuthenticatedRequest } from '../../authMiddleware';
import { getShippingAddresses } from '../../database';

export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    verifyToken(req, res, async () => {
      try {
        if (!req.user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const addresses = await getShippingAddresses(req.user.id);

        if (Array.isArray(addresses) && addresses.length > 0) {
          console.log("Fetched addresses from DB:", addresses);
          return res.status(200).json(addresses);
        }

        console.log("No addresses found for this user.");
        res.status(200).json([]);  // Return an empty array if no addresses found
      } catch (error) {
        console.error('Error fetching shipping addresses:', error);
        res.status(500).json({ error: 'Failed to fetch shipping addresses' });
      }
    });
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
