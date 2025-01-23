import { NextApiRequest, NextApiResponse } from 'next';
import { hashPassword, getUserByEmail, createUser } from '../database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      // Check if user already exists
      const existingUser = await getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }

      // Hash the password
      const passwordHash = await hashPassword(password);

      // Create the user
      await createUser(username, email, passwordHash);

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error in register endpoint:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
