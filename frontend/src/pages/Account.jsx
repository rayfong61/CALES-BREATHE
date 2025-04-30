import React from 'react';
import { useState, useEffect} from 'react';
import { useAuth } from "../components/AuthContext"; 

function Account() {
    const [isBooking, setIsBooking] = useState(true);
    const { user, setUser } = useAuth(); 
    
    const toggleToAditing = () => setIsBooking(false);
    const toggleToBooking = () => setIsBooking(true);

    const handleLogout = () => {
        fetch(`${import.meta.env.VITE_API_BASE}/logout`, {
          method: "GET",
          credentials: "include",
        })
          .then((res) => res.json())
          .then(() => {
            setUser(null);
            window.location.href = "/"; // 可選：登出後導回首頁
          });
      };

    return (
            <div className="min-h-screen max-w-md mx-auto">
                <section className='m-6 '>

                    <div id='customerPic' className='grid place-content-center text-center'>

                            <div className='bg-red-50 w-30 h-30 rounded-full shadow-sm grid place-content-center'>

                                <section className='bg-[url(src/assets/customerPic1.png)] bg-cover bg-center w-27 h-27 rounded-full'></section>

                            </div>
                            <h2 className='text-xl p-2'>
                                曾思翎
                            </h2>
                    </div>

                    <nav className="text-base my-3 flex justify-center gap-2 text-center">
                        <div className={`hover:bg-red-300 hover:underline cursor-pointer py-3 rounded-full w-25 ${isBooking ? 'bg-red-200' : ''}`} onClick={toggleToBooking}>預約紀錄</div>

                        <div className={`hover:bg-red-300 hover:underline cursor-pointer py-3 rounded-full w-25 ${!isBooking ? 'bg-red-200' : ''}`} onClick={toggleToAditing}>個人資料</div>

                        <div className='hover:bg-red-300 hover:underline cursor-pointer py-3 rounded-full w-25'
                             onClick={handleLogout}>登出</div>
                    </nav>

                    <div className='text-base bg-white px-6 pt-6 pb-20 rounded-4xl'>
                        {isBooking && 
                         <p>您沒有預約紀錄</p>
                        }

                        {!isBooking &&
                            <form action="" className="max-w-4xl mx-auto flex flex-col items-center gap-5 text-md ">

                            <div className='grid  w-full items-center'>
                            <label className="text-sm py-2" htmlFor="name">姓名 : </label>
                              <input type="name" name="name" required maxLength="10" placeholder="曾思翎" className="px-2 py-2  bg-rose-50 w-full" />
                            <label className="text-sm py-2" htmlFor="name">生日 : </label>
                              <input type="name" name="name" required maxLength="10" placeholder="1989/06/26" className="px-2 py-2  bg-rose-50 w-full" />
                            <label className="text-sm py-2" htmlFor="name">電話 : </label>
                              <input type="name" name="name" required maxLength="10" placeholder="0925780626" className="px-2 py-2  bg-rose-50 w-full" />
                            <label className="text-sm py-2" htmlFor="name">LINE : </label>
                              <input type="name" name="name" required maxLength="10" placeholder="lindseytseng" className="px-2 py-2  bg-rose-50 w-full" />
                            <label className="text-sm py-2" htmlFor="name">地址 : </label>
                              <input type="name" name="name" required maxLength="10" placeholder="330桃園市桃園區同德十一街136號3樓" className="px-2 py-2  bg-rose-50 w-full" />
            
                            </div>
                            </form>
                        }
                        
                    </div>
                </section>
            </div>

    )
}

export default Account;

{/* 
    姓名
    生日
    電話
    LINE
    地址
    如何得知本店
    是否有肌膚過敏史
    平常除毛方式
    平常去角質方式
    是否有皮膚方面疾病
    */}