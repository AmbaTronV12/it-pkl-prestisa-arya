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
  birth_date: string | null;
  phone_number: string | null;
  shipping_address: string | null;
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


// --- User Profile Functions ---

// Fetch user by ID
export async function getUserById(userId: number) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const query = `SELECT username, email, birth_date, phone_number FROM users WHERE user_id  = ?`;
    const [rows] = await connection.query<UserRow[]>(query, [userId]);
    await connection.end();

    if (rows.length === 0) {
      console.error(`User not found for ID: ${userId}`);
      throw new Error('User not found');
    }

    return rows[0];
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new Error('Failed to fetch user');
  }
}

// Update user profile
export async function updateUser(
  userId: number,
  updates: Partial<{ 
    username: string; 
    email: string; 
    password_hash: string; // Add password hash
    birth_date: string; 
    phone_number: string; 
    shipping_address: string;
    profile_photo: string; 
  }>
) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      console.log("⚠️ No fields to update");
      return;
    }

    values.push(userId);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`;

    console.log("🔹 SQL Query:", query);
    console.log("🔹 Values:", values);

    const [result] = await connection.query(query, values);
    await connection.end();

    console.log("✅ Update Result:", result);

  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    throw new Error('Failed to update user profile');
  }
}

export async function getShippingAddresses(userId: number) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query(
      `SELECT address_id , street_name, city, state, country, zip_code FROM shipping_addresses WHERE user_id = ?`,
      [userId]
    );
    await connection.end();
    return rows;
  } catch (error) {
    console.error('Error fetching shipping addresses:', error);
    throw new Error('Failed to fetch shipping addresses');
  }
}

export async function addShippingAddress(userId: number, street: string, city: string, state: string, country: string, zip_code: string) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const query = `INSERT INTO shipping_addresses (user_id, street_name, city, state, country, zip_code) VALUES (?, ?, ?, ?, ?, ?)`;
    await connection.query(query, [userId, street, city, state, country, zip_code]);
    await connection.end();
  } catch (error) {
    console.error('Error adding shipping address:', error);
    throw new Error('Failed to add shipping address');
  }
}

export async function updateShippingAddress(addressId: number, updates: Partial<{ street: string; city: string; state: string; country: string; zip_code: string; }>) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) return;

    values.push(addressId);
    const query = `UPDATE shipping_addresses SET ${fields.join(', ')} WHERE address_id = ?`;
    await connection.query(query, values);
    await connection.end();
  } catch (error) {
    console.error('Error updating shipping address:', error);
    throw new Error('Failed to update shipping address');
  }
}


export async function deleteShippingAddress(addressId: number) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query(`DELETE FROM shipping_addresses WHERE address_id = ?`, [addressId]);
    await connection.end();
  } catch (error) {
    console.error('Error deleting shipping address:', error);
    throw new Error('Failed to delete shipping address');
  }
}

export async function updateUserProfilePhoto(userId: number, profilePhotoUrl: string) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query('UPDATE users SET profile_photo = ? WHERE user_id = ?', [profilePhotoUrl, userId]);
    await connection.end();
  } catch (error) {
    console.error('Error updating profile photo:', error);
    throw new Error('Failed to update profile photo');
  }
}

export async function addPaymentMethod(userId: number, paymentData: any) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const query = `
    INSERT INTO payment_methods (user_id, card_type, card_holder, card_number, expiration_date, cvv)
    VALUES (?, ?, ?, ?, ?, ?)
    `;

  await connection.execute(query, [
    userId,
    paymentData.card_type,
    paymentData.card_holder,  // Change this line from `cardholder_name` to `card_holder`
    paymentData.card_number,
    paymentData.expiration_date,
    paymentData.cvv,
  ]);

    await connection.end();
  } catch (error) {
    console.error('Error adding payment method:', error);
    throw new Error('Failed to add payment method');
  }
}

// Update Payment Method
export async function updatePaymentMethod(userId: number, updates: any) {
  try {
    const connection = await mysql.createConnection(dbConfig);

    const fields = Object.keys(updates).map((key) => `${key} = ?`).join(', ');
    const values = Object.values(updates);

    if (fields.length === 0) return;

    values.push(userId);
    const query = `UPDATE payment_methods SET ${fields} WHERE user_id = ?`;

    await connection.execute(query, values);
    await connection.end();
  } catch (error) {
    console.error('Error updating payment method:', error);
    throw new Error('Failed to update payment method');
  }
}

// --- Product Functions ---

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
