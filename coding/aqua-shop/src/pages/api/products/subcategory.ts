import type { NextApiRequest, NextApiResponse } from 'next';
import { getProductByCategory } from '../database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { subcategory } = req.query;

  if (!subcategory || typeof subcategory !== 'string') {
    return res.status(400).json({ error: 'Subcategory is required' });
  }

  try {
    const products = await getProductByCategory(undefined, subcategory);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error in fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
