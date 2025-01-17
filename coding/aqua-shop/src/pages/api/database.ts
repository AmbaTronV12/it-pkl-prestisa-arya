import mysql, { RowDataPacket } from 'mysql2/promise';
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

// Define the row structure by extending RowDataPacket
interface Product extends RowDataPacket {
    product_id: number;
    product_name: string;
    product_price: number;
    product_image: string; // JSON string stored in the database
}

// Function to fetch all products
export async function getProducts(): Promise<Product[]> {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query<Product[]>(
      `SELECT product_id, product_name, product_price, JSON_EXTRACT(product_image, '$') AS product_image  FROM product`
    );
    await connection.end();

    // Parse JSON images for each row
    return rows.map((row) => ({
      ...row,
      product_image: JSON.parse(row.product_image), // Parse the JSON string into an object
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

// Function to fetch a single product by ID
export async function getProductById(productId: number): Promise<Product | null> {
    try {
      const connection = await mysql.createConnection(dbConfig);
      const [rows] = await connection.query<Product[]>(
        `SELECT product_id, product_name, product_price, JSON_EXTRACT(product_image, '$') AS product_image FROM product WHERE product_id = ?`,
        [productId]
      );
      await connection.end();
  
      if (rows.length === 0) {
        return null; // No product found
      }
  
      const product = rows[0];
      return {
        ...product,
        product_image: JSON.parse(product.product_image), // Parse the JSON string into an object or array
      };
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw new Error('Failed to fetch product');
    }
  }


// export default async function handler(req:NextApiRequest, res:NextApiResponse) {
//     if(req.method === 'GET'){
//         try{
//             const connection = await mysql.createConnection(dbConfig); //nyambungin ke database
//             const [rows] = await connection.execute('SELECT product_id, product_name, product_price, product_desc, product_image FROM product'); //ambil data dari tabel
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
