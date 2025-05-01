import React from 'react'
import { useState , useEffect} from 'react';
import { useAuth } from "../components/AuthContext"; 
import { useNavigate } from "react-router";


function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, setUser, loading } = useAuth();

  const toggleToRigster = () => setIsLogin(false);
  const toggleToLogin = () => setIsLogin(true);
  const [contactMail, setContactMail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // 登入成功後導向我的帳號頁面

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // 重要：保持 cookie/session
        body: JSON.stringify({ contact_mail: contactMail, password }),
      });
  
      if (!res.ok) {
        const data = await res.json();
        alert(data.message || "登入失敗");
        return;
      }
  
      const data = await res.json();
      setUser(data.user);         // 更新全域登入狀態
      navigate("/account");       // 導向帳號頁面
    } catch (err) {
      console.error("登入錯誤", err);
      alert("登入時發生錯誤");
    }
  };
  

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  const handleLineLogin = () => {
    window.location.href = "http://localhost:5000/auth/line"
  }




  return (
    <div className="max-w-md mx-auto min-h-screen">
      <section className='my-10 mx-4'>
        <div className='text-xl mb-6 flex justify-center gap-2'>
          <div className={` hover:bg-red-300 hover:underline cursor-pointer px-6 py-3 rounded-full ${isLogin ? 'bg-red-200' : ''}`}  onClick={toggleToLogin}>
            帳號登入
          </div>
          <div className={` hover:bg-red-300 hover:underline cursor-pointer px-6 py-3 rounded-full ${!isLogin ? 'bg-red-200' : ''}`} onClick={toggleToRigster}>
            新客註冊
          </div>
        </div>

        <div className='bg-white px-4 py-10 rounded-4xl'>
           
           {/* 登入表單  */}

            {isLogin &&
              <form onSubmit={handleLogin}  className="max-w-4xl mx-auto flex flex-col items-center gap-5 text-base">
                      
                  
                        <div className='flex justify-between w-full items-center'>
                          <label className="pl-5" htmlFor="email">e-mail : </label>
                          <input  type="email"
                                  name="email"
                                  value={contactMail}
                                  onChange={(e) => setContactMail(e.target.value)}
                                  placeholder="e-mail"
                                  required 
                                  className="px-5 py-2 rounded-full border border-solid border-slate-900 dark:border-none w-3/4" 
                          />
                        </div>
                        
                        <div className='flex justify-between w-full items-center'>
                          <label className="pl-5" htmlFor="password">密碼 : </label>
                          <input  type="password"
                                  name="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="密碼"
                                  required 
                                  className=" px-5 py-2 rounded-full border border-solid border-slate-900 dark:border-none w-3/4"
                          />
                        </div>
                              
                        <button 
                        type="submit"
                        className="bg-rose-400 hover:bg-rose-300 active:bg-rose-200 text-white p-2 w-full  rounded-full border border-solid border-slate-900 dark:border-none">
                          登入</button>
                  

                      <div 
                      onClick={handleGoogleLogin}
                      className="bg-rose-400 hover:bg-rose-300 active:bg-rose-200 text-white p-2 w-full  rounded-full border border-solid border-slate-900 dark:border-none flex justify-center gap-2" >
                        <img src="src/assets/googleIcon2.png" alt="googleIcon" width="25" />
                        使用Google登入
                      </div>

                      <div
                      onClick={handleLineLogin}
                      className="bg-rose-400 hover:bg-rose-300 active:bg-rose-200 text-white p-2 w-full  rounded-full border border-solid border-slate-900 dark:border-none flex justify-center gap-2">
                        <img src="src/assets/lineIcon3.png" alt="googleIcon" width="25" />
                        使用Line登入
                      </div>
                </form>
            }
            
            {/* 註冊表單  */}

            {!isLogin && 
              <div className="max-w-4xl mx-auto flex flex-col items-center gap-5 text-md ">

                <div className='flex justify-between w-full items-center'>
                <label className="pl-5" htmlFor="name">姓名 : </label>
                  <input type="name" name="name" required maxLength="10" placeholder="您的大名" className="px-5 py-2 rounded-full border border-solid border-slate-900 dark:border-none w-3/4" />

                </div>

                <div className='flex justify-between w-full items-center'>
                  <label className="pl-5" htmlFor="email">e-mail : </label>
                  <input  type="email"
                          name="email"
                          value={contactMail}
                          onChange={(e) => setContactMail(e.target.value)}
                          placeholder="e-mail"
                          required 
                          className="px-5 py-2 rounded-full border border-solid border-slate-900 dark:border-none w-3/4" 
                  />

                </div>
                
                <div className='flex justify-between w-full items-center'>
                  <label className="pl-5" htmlFor="password">密碼 : </label>
                  <input  type="password"
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="密碼"
                          required 
                          className=" px-5 py-2 rounded-full border border-solid border-slate-900 dark:border-none w-3/4"

                  />
                </div>
                
                <button type="submit"
                        className="bg-rose-400 hover:bg-rose-300 active:bg-rose-200 text-white p-2 w-full  rounded-full border border-solid border-slate-900 dark:border-none">
                  註冊</button>
                <button 
                className="bg-rose-400 hover:bg-rose-300 active:bg-rose-200 text-white p-2 w-full  rounded-full border border-solid border-slate-900 dark:border-none flex justify-center gap-2">
                  <img src="src/assets/googleIcon2.png" alt="googleIcon" width="25" />
                  使用Google註冊
                </button>
                <button 
                className="bg-rose-400 hover:bg-rose-300 active:bg-rose-200 text-white p-2 w-full  rounded-full border border-solid border-slate-900 dark:border-none flex justify-center gap-2">
                  <img src="src/assets/lineIcon3.png" alt="googleIcon" width="25" />
                  使用Line註冊</button>
              </div>
            }
            
        </div>

      </section>
    </div>
  )
}


export default Login;