import pool from '@/utils/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get total sales
    const [salesResult] = await pool.query("SELECT SUM(total_amount) as totalSales FROM orders WHERE order_status != 'Cancelled'");
    const totalSales = salesResult[0]?.totalSales || 0;

    // Get total orders
    const [ordersResult] = await pool.query("SELECT COUNT(*) as totalOrders FROM orders");
    const totalOrders = ordersResult[0]?.totalOrders || 0;

    // Get active customers (unique emails)
    const [customersResult] = await pool.query("SELECT COUNT(DISTINCT user_email) as activeCustomers FROM orders");
    const activeCustomers = customersResult[0]?.activeCustomers || 0;

    // Get pending orders
    const [pendingResult] = await pool.query("SELECT COUNT(*) as pendingOrders FROM orders WHERE order_status IN ('Received', 'Processing')");
    const pendingOrders = pendingResult[0]?.pendingOrders || 0;

    // Get completed orders
    const [completedResult] = await pool.query("SELECT COUNT(*) as completedOrders FROM orders WHERE order_status = 'Delivered'");
    const completedOrders = completedResult[0]?.completedOrders || 0;

    res.status(200).json({
      totalSales,
      totalOrders,
      activeCustomers,
      pendingOrders,
      completedOrders
    });

  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    // Return some default data if table doesn't exist yet for seamless UI
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(200).json({
        totalSales: 0,
        totalOrders: 0,
        activeCustomers: 0,
        pendingOrders: 0,
        completedOrders: 0
      });
    }
    res.status(500).json({ error: 'Server error while fetching metrics' });
  }
}
