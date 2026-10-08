import pool from '@/utils/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const [rows] = await pool.query('SELECT * FROM prebuilt_pcs WHERE id=?', [id]);
      if (rows.length === 0) return res.status(404).json({ message: "Not found" });
      res.status(200).json({ message: "success", status: 200, data: rows[0] });
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
      const { name, tag, description, price, cpu, gpu, ram, storage, image, additional_items } = req.body;
      
      const query = `
        UPDATE prebuilt_pcs 
        SET name=?, tag=?, description=?, price=?, cpu=?, gpu=?, ram=?, storage=?, image=?, additional_items=?
        WHERE id=?
      `;
      const values = [name, tag, description, price, cpu, gpu, ram, storage, image, additional_items || '[]', id];
      
      await pool.query(query, values);
      
      res.status(200).json({ message: "success", status: 200 });
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
      await pool.query('DELETE FROM prebuilt_pcs WHERE id=?', [id]);
      res.status(200).json({ message: "success", status: 200 });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
