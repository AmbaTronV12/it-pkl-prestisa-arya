import { NextApiRequest, NextApiResponse } from "next";
import { getOrderHistory } from "../database";
import { verifyToken, AuthenticatedRequest  } from "../authMiddleware";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Manually verify token before processing request
    verifyToken(req as AuthenticatedRequest, res, async () => {
      const user = (req as AuthenticatedRequest).user; // Extract user from request

      if (!user || !user.id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const orders = await getOrderHistory(user.id);
      return res.status(200).json({ orders });
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
