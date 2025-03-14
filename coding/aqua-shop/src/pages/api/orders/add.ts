import { NextApiRequest, NextApiResponse } from 'next';
import { addOrderHistory } from '../database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { user_id, product_id, product_name, product_image, category, total_price, quantity } = req.body;

    // Validate required fields
    if (!user_id || !product_id || !product_name || !product_image || !category || !total_price || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Call the function with separate parameters
    await addOrderHistory(
      user_id,
      product_id,
      product_name,
      product_image,
      category,
      total_price,
      quantity
    );

    return res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error placing order:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
