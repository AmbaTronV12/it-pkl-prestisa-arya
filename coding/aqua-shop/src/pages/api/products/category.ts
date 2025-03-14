import { NextApiRequest, NextApiResponse } from 'next';
import { getProductByCategory } from '../database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { category } = req.query;

  if (!category || typeof category !== 'string') {
    res.status(400).json({ error: 'Category is required and must be a string' });
    return;
  }

  try {
    let products = await getProductByCategory(category);

    // Randomize product order
    products = products.sort(() => Math.random() - 0.5);

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}