import pool from '@/utils/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const [rows] = await pool.query('SELECT * FROM products WHERE _id = ?', [id]);
      if (rows.length > 0) {
        res.status(200).json({ message: "success", status: 200, data: rows[0] });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "error", error: error.message });
    }
  } else if (req.method === "PUT") {
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user.role !== 'admin') {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    try {
      const { name, category, price, img, status, rating, description, keyFeature, individualRating } = req.body;
      const query = `
        UPDATE products 
        SET name = ?, category = ?, price = ?, img = ?, status = ?, rating = ?, description = ?, keyFeature = ?, individualRating = ?
        WHERE _id = ?
      `;
      const values = [name, category, price, img, status, rating, description, keyFeature, individualRating, id];
      
      const [result] = await pool.query(query, values);
      
      if (result.affectedRows > 0) {
        res.status(200).json({ message: "success", status: 200, data: { _id: id, ...req.body } });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "error", error: error.message });
    }
  } else if (req.method === "DELETE") {
    const session = await getServerSession(req, res, authOptions);
    if (!session || session.user.role !== 'admin') {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    try {
      const [result] = await pool.query('DELETE FROM products WHERE _id = ?', [id]);
      
      if (result.affectedRows > 0) {
        res.status(200).json({ message: "success", status: 200 });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
