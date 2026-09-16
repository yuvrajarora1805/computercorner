import pool from '../../../../utils/db';

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [rows] = await pool.query('SELECT * FROM prebuilt_pcs ORDER BY created_at DESC');
      res.status(200).json({ message: "success", status: 200, data: rows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "error", error: error.message });
    }
  } else if (req.method === "POST") {
    try {
      const { name, tag, description, price, cpu, gpu, ram, storage, image } = req.body;
      
      const query = `
        INSERT INTO prebuilt_pcs (name, tag, description, price, cpu, gpu, ram, storage, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [name, tag, description, price, cpu, gpu, ram, storage, image];
      
      const [result] = await pool.query(query, values);
      
      res.status(201).json({ message: "success", status: 201, data: { id: result.insertId, ...req.body } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
