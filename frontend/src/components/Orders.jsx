import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext"; // 確保你有提供 user.id

function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  

  useEffect(() => {
    if (!user?.id) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/orders", {
          params: { client_id: user.id },
          withCredentials: true
        });
        setOrders(res.data);
      } catch (err) {
        setErrorMsg("無法取得預約紀錄");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) return <p>載入中...</p>;
  if (errorMsg) return <p>{errorMsg}</p>;
  

  return (
    <div>
      
      {orders.length === 0 ? (
        <p>目前沒有預約紀錄</p>
      ) : (
        <ul>
          {orders.map((order) => {
            
            const date = new Date(order.booking_date);
            const formattedDate = date.toLocaleDateString("zh-TW", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            });

            let detail = {};
            if (typeof order.booking_detail === "string") {
            try {
                detail = JSON.parse(order.booking_detail);
            } catch (e) {
                console.error("解析 booking_detail 失敗", e);
            }
            } else {
            detail = order.booking_detail || {};
            }

            return (
              <li key={order.id} style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}>
                <p><strong>預約日期：</strong>{formattedDate}</p>
                <p><strong>時間：</strong>{order.booking_time.slice(0,5)}</p>
                <p><strong>服務內容：</strong>{detail.services?.join("、")}</p>
                <p><strong>加購項目：</strong>{detail.addons?.join("、") || "無"}</p>
                <p><strong>總價格：</strong>${order.total_price}</p>
                <p><strong>總時長：</strong>{order.total_duration} 分鐘</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Orders;
