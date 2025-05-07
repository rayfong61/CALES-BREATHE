import axios from "axios";
import { useState, useEffect } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

function BookingClientContent() {
  const navigate = useNavigate();
  const { user, setUser, loading } = useAuth();
  const [bookingData, setBookingData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [name, setName] = useState(user?.client_name || "");
  const [mobile, setMobile] = useState(user?.contact_mobile || "");
  const [note, setNote] = useState("");

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

  // useEffect(() => {
  //   if (user) {
  //     setName(user.client_name || "");
  //     setMobile(user.contact_mobile || "");
  //   }
  // }, [user]);

  useEffect(() => {
    if (user && bookingData) {
      const services = bookingData.selectedServices.map(s => s.name);
      const addons = bookingData.selectedAddons.map(id => addonMap[id] || id);
      setName(user.client_name || "");
      setMobile(user.contact_mobile || "");
  
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

    if (!name.trim() || !mobile.trim()) {
      setInputError("姓名與手機為必填欄位");
      return;
    }

    try {
      // 1. 更新使用者資料
      await axios.put("http://localhost:5000/account/update2", {
        client_name: name.trim(),
        contact_mobile: mobile.trim(),
      }, { withCredentials: true });

      // 2. 提交預約資料
      const res = await axios.post("http://localhost:5000/orders", {
        ...formData,
        booking_detail: JSON.stringify(formData.booking_detail),
        booking_note: note.trim() || null
      }, { withCredentials: true });

      setMessage(res.data.message);
      setIsSubmitted(true); // 觸發按鈕顯示"已送出"
      setTimeout(() => navigate("/account"), 1500);  // 成功後導向預約紀錄頁
      localStorage.removeItem("bookingData"); // 成功送出後清空 localStorage 資料
    } catch (err) {
      setMessage(err.response?.data?.message || "預約失敗");
      console.error(err);
    }
  };
  


  if (!user) {
    return (
      <div className="max-w-xl mx-auto p-6 my-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">請先登入以繼續預約</h2>
        <div className="space-y-4">
          <button
            onClick={() => window.location.href = "http://localhost:5000/auth/google"}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            使用 Google 登入
          </button>
          <button
            onClick={() => window.location.href = "http://localhost:5000/auth/line"}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full"
          >
            使用 LINE 登入
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded w-full"
          >
            使用帳號密碼登入
          </button>
        </div>
      </div>
    );
  }

  if (!formData) return <p>載入中...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 my-6 bg-white rounded-xl shadow-md">
       {(!user) && {
    // 顯示請先登入的頁面
    // 設計登入google / line / 或local 三個選項
    // 完成後帶入資料繼續下列步驟
  } }
      <h2 className="text-xl font-bold mb-4">請確認以下內容是否正確:</h2>
      
      <form onSubmit={handleSubmit} className="px-2 ">

        <h3 className="block my-2 font-semibold">聯絡資訊：</h3>

        <label className="block my-1">*姓名 : </label>
        <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="border p-2 rounded w-full"
        />
        <label className="block my-1">*手機 : </label>
        <input
        type="text"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
        required
        className="border p-2 rounded w-full"
        />
        <label className="block my-1">備註事項 : </label>
        <textarea
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="border p-2 rounded w-full "
        placeholder="例如 : 懷孕第幾周? 第一次除毛等等"
        rows={2}
        />

    

        <h3 className="block my-2 font-semibold">預約內容：</h3>
        <p>預約項目：{formData.booking_detail.services.join(", ")}</p>
        <p>加購項目：{formData.booking_detail.addons.join(", ") || "無"}</p>
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

export default BookingClientContent;

            
 

// Note:
// 🔍 為什麼要用 trim()？  
// 移除字串開頭與結尾的空白字元(只影響「開頭與結尾」的空白，不會移除中間的空白)
// "王 小明".trim()  // => "王 小明"