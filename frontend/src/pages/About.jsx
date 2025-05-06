import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";

function About() {
  const { user, setUser, loading } = useAuth();
  const [bookingData, setBookingData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 取得 localStorage 的預約資料
  useEffect(() => {
    const storedData = localStorage.getItem("bookingData");
    if (storedData) {
      const parsed = JSON.parse(storedData);
      setBookingData(parsed);
    }
  }, []);

  // 等 user 和 bookingData 都有值後，再建立 formData
  const addonMap = {
    "add-toes": "腳趾加購",
    "add-armpit": "腋下加購",
    "add-fingers": "手指加購",
    "add-lip": "上唇加購",
    // 可以依實際情況補上
  };

  useEffect(() => {
    if (user && bookingData) {
      const services = bookingData.selectedServices.map(s => s.name);
      const addons = bookingData.selectedAddons.map(id => addonMap[id] || id);
  
      setFormData({
        client_id: user.id,
        booking_detail: {
          services,
          addons
        },
        total_price: bookingData.total,
        total_duration: bookingData.totalDuration,
        booking_date: bookingData.date,
        booking_time: bookingData.time
      });
    }
  }, [user, bookingData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/orders",
        {
          ...formData,
          booking_detail: JSON.stringify(formData.booking_detail)
        },
        { withCredentials: true }
      );

      setMessage(res.data.message);
      console.log("預約成功，訂單 ID：", res.data.orderId);
      setIsSubmitted(true); // 停用按鈕
    } catch (err) {
      setMessage(err.response?.data?.message || "預約失敗");
      console.error(err);
    }
  };

  if (!formData) return <p>載入中...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 my-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">請確認以下內容是否正確:</h2>
      
      <form onSubmit={handleSubmit} className="px-2 ">

        <h3 className="block my-2 font-semibold">聯絡資訊：</h3>
        <p>姓名 : {user.client_name}</p>
        <p>手機 : {user.contact_mobile}</p>
        <p>備註事項 : </p>

        <h3 className="block my-2 font-semibold">預約內容：</h3>
        <p>預約項目：{formData.booking_detail.services.join(", ")}</p>
        <p>加購項目：{formData.booking_detail.addons.join(", ")}</p>
        <p>價格：{formData.total_price}</p>
        <p>時長：{formData.total_duration} 分鐘</p>
        <p>日期：{formData.booking_date}</p>
        <p>時間：{formData.booking_time}</p>

        <button type="submit"
                disabled={isSubmitted}
                className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded  w-30 disabled:opacity-50 cursor-pointer my-2 block mx-auto">
                  {isSubmitted ? "已送出" : "送出預約"}
        </button>
        {message && <p className="text-rose-400 text-center text-xl font-bold py-3">{message}</p>}
      </form>
    </div>
  );
}

export default About;


