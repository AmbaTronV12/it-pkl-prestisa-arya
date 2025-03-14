import { NextApiRequest, NextApiResponse } from "next";
import { getRelatedProducts } from "../database";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { subcategory, excludeId } = req.query;

  if (!subcategory) {
    return res.status(400).json({ error: "Subcategory is required" });
  }

  try {
    const products = await getRelatedProducts(subcategory as string, Number(excludeId));
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({ error: "Failed to fetch related products" });
  }
}
