import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

// Define the expected structure of the JWT payload
interface DecodedToken {
  id: number;
  email: string;
}

// Extend NextApiRequest to include 'user'
export interface AuthenticatedRequest extends NextApiRequest {
  user?: DecodedToken;
}

// Middleware function to verify JWT
export function verifyToken(req: AuthenticatedRequest, res: NextApiResponse, next: Function) {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader); // Log the header value

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken; // Explicitly cast the decoded token
    req.user = decoded; // Attach user data to the request
    console.log("Decoded Token:", decoded); // Log decoded token for debugging
    return next(); // Ensure the next function is called
  } catch (error) {
    console.error("JWT Verification Error:", error); // Log error for debugging
    return res.status(403).json({ error: "Forbidden: Invalid or expired token" });
  }
}
