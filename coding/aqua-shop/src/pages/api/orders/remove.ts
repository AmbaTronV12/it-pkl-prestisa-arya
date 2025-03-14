import { query } from "../database"; // Reuse our function
import dayjs from "dayjs";

export async function deleteOldOrders() {
  try {
    const twoWeeksAgo = dayjs().subtract(14, "days").format("YYYY-MM-DD HH:mm:ss");
    const sql = "DELETE FROM orders WHERE order_date <= ?";

    const result = await query(sql, [twoWeeksAgo]); // Just call it!

    console.log(`✅ Deleted ${(result as any).affectedRows} old orders older than ${twoWeeksAgo}`);
  } catch (error) {
    console.error("❌ Error deleting old orders:", error);
  }
}
