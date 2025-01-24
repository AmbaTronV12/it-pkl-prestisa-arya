import mysql, { RowDataPacket } from 'mysql2/promise';
import bcrypt from 'bcrypt';
import { hash } from 'crypto';
//settingan buat connect
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Adjust as needed
    queueLimit: 0,
};

interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  password: string; // Ensure password is included here
}

interface Product {
  product_id: number;
  product_name: string;
  product_price: number;
  product_desc: string;
  product_image: {
    primary: string;
    hover: string;
    gallery: string[];
  };
  category: string;
  subcategory: string;
}

// Define the row structure
interface ProductRow extends RowDataPacket {
  product_id: number;
  product_name: string;
  product_price: number;
  product_desc: string;
  product_image: string; // JSON string stored in the database
  category: string;
  subcategory: string;
}

// Function to fetch all products
export async function getProducts(): Promise<Product[]> {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query<ProductRow[]>(
      `SELECT product_id, product_name, product_price, product_desc, product_image, category, subcategory FROM product`
    );
    await connection.end();

    // Transform rows into Product objects
    return rows.map((row) => ({
      product_id: row.product_id,
      product_name: row.product_name,
      product_price: row.product_price,
      product_desc: row.product_desc,
      product_image: JSON.parse(row.product_image), // Parse JSON string
      category: row.category,
      subcategory: row.subcategory,
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

// Function to fetch all products by category
export async function getProductByCategory(category?: string, subcategory?: string): Promise<Product[]> {
  try {
    const connection = await mysql.createConnection(dbConfig);

    let query = `SELECT product_id, product_name, product_price, product_desc, 
                        JSON_EXTRACT(product_image, '$') AS product_image, 
                        category, subcategory 
                 FROM product`;
    const params: any[] = [];

    if (category || subcategory) {
      query += ' WHERE';
    }

    if (category) {
      query += ' category = ?';
      params.push(category);
    }

    if (subcategory) {
      query += category ? ' AND subcategory = ?' : ' subcategory = ?';
      params.push(subcategory);
    }

    const [rows] = await connection.query<ProductRow[]>(query, params);
    await connection.end();

    // Parse JSON images for each row
    return rows.map((row) => ({
      ...row,
      product_image: JSON.parse(row.product_image as string),
    }));
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw new Error('Failed to fetch products by category');
  }
}

// Function to fetch a single product by ID
export async function getProductById(productId: number): Promise<Product | null> {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query<ProductRow[]>(
      `SELECT * FROM product WHERE product_id = ?`,
      [productId]
    );
    await connection.end();

    if (rows.length === 0) {
      return null; // No product found
    }

    const row = rows[0];
    return {
      product_id: row.product_id,
      product_name: row.product_name,
      product_price: row.product_price,
      product_desc: row.product_desc,
      product_image: JSON.parse(row.product_image as string), // Parse the JSON string into an object
      category: row.category,
      subcategory: row.subcategory,
    };
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw new Error('Failed to fetch product');
  }
}


// --- Authentication Functions ---

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Compare a password with a hash
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  console.log('Password:', password);
  console.log('Hash:', hash);

  if (!password || !hash) {
    throw new Error('Both password and hash must be provided.');
  }

  return bcrypt.compare(password, hash);
}


// Create a new user
export async function createUser(username: string, email: string, passwordHash: string): Promise<void> {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const query = `
      INSERT INTO users (username, email, password_hash)
      VALUES (?, ?, ?)
    `;
    await connection.query(query, [username, email, passwordHash]);
    await connection.end();
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user');
  }
}

// Get user by email
export async function getUserByEmail(email: string) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const query =  `SELECT user_id, email, password_hash FROM users WHERE email = ?`;
    const [rows] = await connection.query<UserRow[]>(query, [email]);
    await connection.end();

    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw new Error('Failed to fetch user');
  }
}

// export default async function handler(req:NextApiRequest, res:NextApiResponse) {
//     if(req.method === 'GET'){
//         try{
//             const connection = await mysql.createConnection(dbConfig); //nyambungin ke database
//             const [rows] = await connection.execute('`SELECT product_id, product_name, product_price, JSON_EXTRACT(product_image, '$') AS product_image FROM product'); //ambil data dari tabel
//             await connection.end();
//             res.status(200).json(rows);
//         } catch (error) {
//             console.error('Database query error:', error);
//             res.status(500).json({ message: 'Internal server error'});
//         }
//     } else {
//         res.setHeader('Allow', ['GET']);
//         res.status(405).end(`Method ${req.method} Not Allowed`);
//     }
// }
