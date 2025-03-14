import { NextApiRequest, NextApiResponse } from 'next';
import { getUserByEmail, comparePassword } from '../database';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      // Check if user exists
      const user = await getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Compare passwords
      const isPasswordValid = await comparePassword(password, user.password_hash); // Use 'password_hash' here
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.user_id, email: user.email }, // Payload
        process.env.JWT_SECRET!,          // Secret key (store this in .env)
        { expiresIn: '1h' }               // Token expiry
      );

      res.status(200).json({ message: 'Login successful', user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        birth_date: user.birth_date,
        phone_number: user.phone_number,
        profile_photo: user.profile_photo, // Make sure this is included
      }, token });
    } catch (error) {
      console.error('Error in login endpoint:', error);
      res.status(500).json({ error: 'Failed to log in' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
