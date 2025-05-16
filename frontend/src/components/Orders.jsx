import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext"; 

function Orders() {
  const api = import.meta.env.VITE_API_BASE;
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCancel = async (id) => {
    if (!window.confirm("確定要取消這筆預約嗎？")) return;
  
    try {
      await axios.put(`${api}/orders/cancel/${id}`, {}, { withCredentials: true });
      setOrders((prev) => prev.filter((order) => order.id !== id)); // 更新畫面
    } catch (err) {
      console.error("取消失敗", err);
      alert("取消預約失敗");
    }
  };
  
  

  useEffect(() => {
    if (!user?.id) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${api}/orders`, {
          params: { client_id: user.id },
          withCredentials: true
        });
        setOrders(res.data);
        console.log(res.data);
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
            const detail = order.booking_detail

            return (
              <li key={order.id} className="mb-4 border-b border-gray-300 pb-4">
                <p><strong>預約日期：</strong>{formattedDate}</p>
                <p><strong>時間：</strong>{order.booking_time.slice(0,5)}</p>   
                <p><strong>服務內容：</strong>{detail.services?.join("、")}</p>
                <p><strong>加購項目：</strong>{detail.addons?.join("、") || "無"}</p>
                <p><strong>總價格：</strong>${order.total_price}</p>
                <p><strong>總時長：</strong>{order.total_duration} 分鐘</p>
                <p><strong>備註：</strong>{order.booking_note} </p>
                 {/* 新增取消按鈕（限制過去預約不能取消） */}
                  {new Date(order.booking_date) >= new Date() && !order.is_cancelled && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      className="mt-3 px-5 py-1 bg-red-400 text-white rounded hover:bg-red-500 cursor-pointer"
                    >
                      取消預約
                    </button>
                  )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Orders;

// 👉     style={{ marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "1rem" }}
// 等同 >> className="mb-4 border-b border-gray-300 pb-4"

// 👉 order.booking_time.slice(0, 5)     
// 從 order.booking_time 字串中，擷取前五個字元（從索引 0 開始，到索引 5 結束，但不包含 5）。
// "17:00:00" -> "17:00"
// 因為時間資料通常是 "HH:MM:SS" 格式，但在畫面上我們只需要顯示到「分鐘」，所以只取 "HH:MM"。

// 👉 {detail.services?.join("、")} 
// ?. 是 ES2020 的語法，意思是：
// 如果 detail.services 存在，就呼叫 join()；如果是 undefined 或 null，就不做任何事，避免程式報錯。

// join("、")
// join() 是陣列的方法，會把陣列中的每一個元素，用指定的分隔符（這裡是「、」）組合成一個字串。

// 假設 detail.services = ["A", "B", "C"]，畫面會顯示： A、B、C