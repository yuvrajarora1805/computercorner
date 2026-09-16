import pool from '@/utils/db';

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
    try {
      const { name, tag, description, price, cpu, gpu, ram, storage, image } = req.body;
      
      const query = `
        UPDATE prebuilt_pcs 
        SET name=?, tag=?, description=?, price=?, cpu=?, gpu=?, ram=?, storage=?, image=?
        WHERE id=?
      `;
      const values = [name, tag, description, price, cpu, gpu, ram, storage, image, id];
      
      await pool.query(query, values);
      
      res.status(200).json({ message: "success", status: 200 });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "error", error: error.message });
    }
  } else if (req.method === "DELETE") {
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
