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
  const [formData, setFormData] = useState({
    client_name: "",
    contact_mail: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
      setMessage("✅ " + data.message);
      console.log("註冊成功:", data.user);

      // 註冊成功後立即登入
      const loginRes = await fetch(`${import.meta.env.VITE_API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          contact_mail: formData.contact_mail,
          password: formData.password,
        }),
      });

      const loginData = await loginRes.json();

      if (loginRes.ok) {
        setUser(loginData.user);
        navigate("/account");
      } else {
        alert("註冊後自動登入失敗：" + loginData.message);
      }

    } else {
      setMessage("❌ " + data.message);
    }
  } catch (err) {
    console.error(err);
    setMessage("❌ 發送請求時發生錯誤");
  }
};

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // 保持 cookie/session
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
      window.location.reload();
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
          <div onClick={toggleToLogin} 
               className={` hover:bg-red-300 hover:underline cursor-pointer px-6 py-3 rounded-full ${isLogin ? 'bg-red-200' : ''}`}  >
            帳號登入
          </div>
          <div onClick={toggleToRigster}
               className={` hover:bg-red-300 hover:underline cursor-pointer px-6 py-3 rounded-full ${!isLogin ? 'bg-red-200' : ''}`} >
            新客註冊
          </div>
        </div>

        <div className='bg-white px-4 py-10 rounded-4xl'>
           
           {/* 登入表單  */}

            {isLogin &&
              <form onSubmit={handleLogin}  className="max-w-4xl mx-auto flex flex-col items-center gap-5 text-base px-5">
                
                          <input  type="email"
                                  name="email"
                                  value={contactMail}
                                  onChange={(e) => setContactMail(e.target.value)}
                                  placeholder="電子郵件地址"
                                  required 
                                  className="px-5 py-2 rounded-full border border-solid border-slate-900 w-full" 
                          />
                  
                          <input  type="password"
                                  name="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="密碼"
                                  required 
                                  className=" px-5 py-2 rounded-full border border-solid border-slate-900 w-full"
                          />
                        
                        <button 
                        type="submit"
                        className="bg-rose-400 hover:bg-rose-300 active:bg-rose-200 text-white p-2 w-full  rounded-full border border-solid cursor-pointer">
                          登入</button>
                        
                      <div 
                      onClick={handleGoogleLogin}
                      className="bg-rose-400 hover:bg-rose-300 active:bg-rose-200 text-white p-2 w-full  rounded-full border border-solid  flex justify-center gap-2 cursor-pointer" >
                        <img src="src/assets/googleIcon2.png" alt="googleIcon" width="25" />
                        使用Google登入
                      </div>

                      <div
                      onClick={handleLineLogin}
                      className="bg-rose-400 hover:bg-rose-300 active:bg-rose-200 text-white p-2 w-full  rounded-full border border-solid   flex justify-center gap-2 cursor-pointer">
                        <img src="src/assets/lineIcon3.png" alt="googleIcon" width="25" />
                        使用Line登入
                      </div>
                </form>
            }
            
            {/* 註冊表單  */}
        

            {!isLogin && 
              <form onSubmit={handleRegister}  className="max-w-4xl mx-auto flex flex-col items-center gap-5 text-base px-5">
                
              <input  type="test"
                      name="client_name"
                      value={formData.client_name}
                      onChange={handleChange}
                      placeholder="姓名"
                      required 
                      className="px-5 py-2 rounded-full border border-solid border-slate-900 w-full" 
              />
              <input  type="email"
                      name="contact_mail"
                      value={formData.contact_mail}
                      onChange={handleChange}
                      placeholder="電子郵件地址"
                      required 
                      className="px-5 py-2 rounded-full border border-solid border-slate-900 w-full" 
              />
      
              <input  type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="密碼"
                      required 
                      minLength="6"
                      className=" px-5 py-2 rounded-full border border-solid border-slate-900 w-full"
              />
            
            <button 
            type="submit"
            className="bg-rose-400 hover:bg-rose-300 active:bg-rose-200 text-white p-2 w-full  rounded-full border border-solid cursor-pointer">
              註冊</button>
            
          <div 
          onClick={handleGoogleLogin}
          className="bg-rose-400 hover:bg-rose-300 active:bg-rose-200 text-white p-2 w-full  rounded-full border border-solid  flex justify-center gap-2 cursor-pointer" >
            <img src="src/assets/googleIcon2.png" alt="googleIcon" width="25" />
            使用Google註冊
          </div>

          <div
          onClick={handleLineLogin}
          className="bg-rose-400 hover:bg-rose-300 active:bg-rose-200 text-white p-2 w-full  rounded-full border border-solid   flex justify-center gap-2 cursor-pointer">
            <img src="src/assets/lineIcon3.png" alt="googleIcon" width="25" />
            使用Line註冊
          </div>
          {message && <p>{message}</p>}
    </form>
            }
            
        </div>

      </section>
    </div>
  )
}


export default Login;