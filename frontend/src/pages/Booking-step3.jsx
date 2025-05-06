import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import AddingItems from "../components/AddingItems";
import { useAuth } from "../components/AuthContext"; 
import axios from "axios";

function BookingClientContent() {
    const { user, setUser, loading } = useAuth();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({ name:"", phone:""});
    const [isBookingSuccess, setIsBookingSuccess] = useState(false);
    const [bookingData, setBookingData] = useState(null);
    const [confirmedBooking, setConfirmedBooking] = useState(null);

    useEffect(() => {
        const storedData = localStorage.getItem("bookingData")

        if(storedData) {
            setBookingData(JSON.parse(storedData));
        }
    },[]);

    const handleLogin = () => {
        setIsLoggedIn(true);
        
        setUserInfo({ name: user.client_name, phone: user.contact_mobile });
    }

    const handleSubmitBooking = () => {
        // 這邊可以加入送出API的邏輯
        setIsBookingSuccess(true);

        const bookingDetails = {
          ...bookingData,
          name: user.client_name,
          phone: user.contact_mobile,
        };
        localStorage.setItem("bookingData", JSON.stringify(bookingDetails));
        setConfirmedBooking(bookingDetails);
        console.log(bookingDetails);
    };

    



    return(
        <div className="max-w-xl mx-auto p-6 my-6 bg-white rounded-xl shadow-md">
            {!isLoggedIn ? (
                
                <div className="text-center py-10">
                    <p className="mb-4 text-lg">請先登入 Cale's Breathe</p>
                    <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">Google登入</button>
                    <button onClick={handleLogin} className="bg-green-500 text-white px-4 py-2 rounded ml-2">Line登入</button>
                </div>
            ) : !isBookingSuccess ? (
                <div>
                    <h2 className="text-xl font-bold mb-4">確認預約內容</h2>
                    <p><strong>姓名：</strong> {userInfo.name}</p>
                    <p><strong>電話：</strong> {userInfo.phone}</p>

                    {/* 顯示預約內容 */}
                    {bookingData ? (
                        <div className="mt-4">
                            <p><strong>預約日期：</strong>{bookingData.date}</p>
                            <p><strong>預約時間：</strong>{bookingData.time}</p>
                            <p className="mt-2 font-bold">預約項目：</p>
                            <ul className="list-disc list-inside">
                                {bookingData.selectedServices.map((item) => (
                                    <li key={item.id}>
                                        {item.name} - ${item.price}
                                    </li>
                                ))}
                            </ul>

                            {bookingData.selectedAddons.length > 0 && (
                                <>
                                    
                                    <ul className="list-disc list-inside">
                                    {bookingData.selectedAddons.map((id) => {
                                        const addon = AddingItems.find((item) => item.id === id);
                                        return (
                                        <li key={id}>
                                            加購項目：{addon?.name} - ${addon?.price}
                                        </li>
                                        );
                                    })}
                                    </ul>
                                </>
                            )}

                            <p className="mt-4"><strong>總金額：</strong> NT$ {bookingData.total}</p>
                            <p><strong>總時長：</strong> {bookingData.totalDuration} 分鐘</p>
                        </div>
                    ) : (
                        <p className="text-red-500">無預約資料</p>
                    )}

                    <button onClick={handleSubmitBooking} className="mt-6 bg-rose-500 text-white px-4 py-2 rounded">送出預約單</button>
                </div>
            ) : (
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-rose-600 mb-4">預約成功！</h2>
                    <p>感謝您的預約，我們將盡快與您聯繫。</p>
                    <Link to="/" className="mt-6 inline-block bg-rose-500 text-white px-4 py-2 rounded">回首頁</Link>
                </div>
            )}
        </div>

    )
    
}

export default BookingClientContent;

{/* 
            1. 判斷是否登入
                如果未登入：
                顯示提示：「請先登入 Cale's Breathe」
                提供「Google登入」和「Line登入」按鈕

                如果已登入：
                顯示「用戶姓名」和「電話號碼」
                          
            
            2. 顯示預約內容（從 localStorage 或 context 取資料）
                預約的服務（selectedServices）
                加購項目（selectedAddons）
                預約日期（selectedDate）
                預約時間（selectedTime）
                總金額和總時長

            3. 送出預約單
                點擊「送出預約單」按鈕
                把預約資料（+ 使用者資訊）發送到後端 API 或存入資料庫
                可以設定 loading 狀態避免重複送出

            4. 顯示預約成功畫面
                成功後：
                顯示「預約成功！」訊息
                告知客人預約編號、細節
                可以提供「回到首頁」或「查看我的預約」按鈕

            5. 登入後可查看自己的預約
                顯示「我的預約」列表頁
                包含：服務內容、時間、地點、狀態（ex: 已確認 / 已取消）
                            
            
            
            */}

            
              