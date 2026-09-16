import pool from '../../../../utils/db';

export default async function handler(req, res) {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS prebuilt_pcs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        tag VARCHAR(100),
        description TEXT,
        price INT,
        cpu VARCHAR(255),
        gpu VARCHAR(255),
        ram VARCHAR(255),
        storage VARCHAR(255),
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await pool.query(createTableQuery);

    // Check if table is empty
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM prebuilt_pcs');
    if (rows[0].count === 0) {
      // Seed initial data
      const initialData = [
        {
          name: 'Gamer X-Treme 9',
          tag: 'Best Seller',
          description: 'The ultimate 4K gaming powerhouse. Designed to crush modern AAA titles.',
          price: 245000,
          cpu: 'Intel Core i9-13900K',
          gpu: 'RTX 4090 24GB',
          ram: '64GB DDR5 6000MHz',
          storage: '2TB NVMe Gen4 SSD',
          image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=60'
        },
        {
          name: 'Creator Pro Workstation',
          tag: 'Premium',
          description: 'Tackle complex 3D rendering and 8K video editing effortlessly.',
          price: 310000,
          cpu: 'AMD Ryzen Threadripper PRO',
          gpu: 'RTX 6000 Ada Generation',
          ram: '128GB DDR5 ECC',
          storage: '4TB NVMe Gen4 SSD',
          image: 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=800&auto=format&fit=crop&q=60'
        },
        {
          name: 'Esports Elite Build',
          tag: 'Value',
          description: 'High FPS competitive gaming machine designed for pros.',
          price: 125000,
          cpu: 'Intel Core i5-13600K',
          gpu: 'RTX 4070 12GB',
          ram: '32GB DDR5 5600MHz',
          storage: '1TB NVMe Gen4 SSD',
          image: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800&auto=format&fit=crop&q=60'
        }
      ];

      for (const pc of initialData) {
        await pool.query(
          'INSERT INTO prebuilt_pcs (name, tag, description, price, cpu, gpu, ram, storage, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [pc.name, pc.tag, pc.description, pc.price, pc.cpu, pc.gpu, pc.ram, pc.storage, pc.image]
        );
      }
    }

    res.status(200).json({ message: "Table created and seeded successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error setting up table", error: error.message });
  }
}
