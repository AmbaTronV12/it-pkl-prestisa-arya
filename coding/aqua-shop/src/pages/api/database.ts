import { NextApiRequest, NextApiResponse } from 'next';
import mysql from 'mysql2/promise';

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

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    if(req.method === 'GET'){
        try{
            const connection = await mysql.createConnection(dbConfig); //nyambungin ke database
            const [rows] = await connection.execute('SELECT product_id, product_name, product_price, product_desc, product_image FROM product'); //ambil data dari tabel
            await connection.end();
            res.status(200).json(rows);
        } catch (error) {
            console.error('Database query error:', error);
            res.status(500).json({ message: 'Internal server error'});
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
