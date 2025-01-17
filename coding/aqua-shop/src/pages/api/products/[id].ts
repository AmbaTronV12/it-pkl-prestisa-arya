import { NextApiRequest, NextApiResponse } from 'next';
import { getProductById } from '../database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const product = await getProductById(Number(id)); // Ensure the ID is a number
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}