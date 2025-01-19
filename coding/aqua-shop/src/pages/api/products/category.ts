import { NextApiRequest, NextApiResponse } from 'next';
import { getProductByCategory } from '../database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { category, subcategory } = req.query;

  if (!category || typeof category !== 'string') {
    res.status(400).json({ error: 'Category is required and must be a string' });
    return;
  }

  try {
    const products = await getProductByCategory(category, subcategory as string | undefined);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error in /api/products/category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}