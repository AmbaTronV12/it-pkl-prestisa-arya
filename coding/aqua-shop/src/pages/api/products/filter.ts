import { NextApiRequest, NextApiResponse } from 'next';
import { getProductByCategory, getProducts } from '../database';

// Define the Product interface
export interface Product {
  product_id: number;
  product_name: string;
  product_price: number;
  product_desc: string;  // ✅ Add this line
  product_image: {
    primary: string;
    hover: string;
    gallery: string[];
  };
  category: string;
  subcategory: string;
}

// API Handler for filtering products
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { search, category, subcategory } = req.query;

  try {
    let products: Product[] = await getProducts(); // ✅ Ensure products is always assigned
    if (category && subcategory) {
      products = await getProductByCategory(category as string, subcategory as string);
    } else if (category) {
      products = await getProductByCategory(category as string);
    } else if (subcategory) {
      products = await getProductByCategory(undefined, subcategory as string);
    } else {
      products = await getProducts();
    }

    // ✅ Apply search filtering only if search exists
    if (search) {
      const searchTerm = (search as string).toLowerCase();
      products = products.filter((product) =>
        product.product_name.toLowerCase().includes(searchTerm)
      );
    }

    if (products.length === 0) {
      return res.status(200).json({ message: 'No products found' });
    }
    

    // Randomize product order
    products = products.sort(() => Math.random() - 0.5);

    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Utility function to filter products by selected subcategories
export const getFilteredProducts = (products: Product[], selectedSubcategories: string[]): Product[] => {
  if (selectedSubcategories.length === 0) return products; // No filter applied

  return products.filter((product) => selectedSubcategories.includes(product.subcategory));
};
