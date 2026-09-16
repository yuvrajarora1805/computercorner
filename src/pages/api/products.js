import pool from '../../utils/db';

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const [rows] = await pool.query('SELECT * FROM products');
      res.status(200).json({ message: "success", status: 200, data: rows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "error", error: error.message });
    }
  } else if (req.method === "POST") {
    try {
      const { name, category, price, img, status, rating, description, keyFeature, individualRating } = req.body;
      const _id = Math.random().toString(36).substring(7); // Simple ID generation
      
      const query = `
        INSERT INTO products (_id, name, category, price, img, status, rating, description, keyFeature, individualRating)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        _id, 
        name, 
        category, 
        price, 
        img || '', 
        status || 'In Stock', 
        rating || '0', 
        description || '', 
        keyFeature || '', 
        individualRating || '0'
      ];
      
      await pool.query(query, values);
      
      res.status(201).json({ message: "success", status: 201, data: { _id, ...req.body } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "error", error: error.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
