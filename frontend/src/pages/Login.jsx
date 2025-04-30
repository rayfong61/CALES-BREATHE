import React from 'react'
import { useState , useEffect} from 'react';
import { useAuth } from "../components/AuthContext"; 



function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, setUser } = useAuth(); 

  const toggleToRigster = () => setIsLogin(false);
  const toggleToLogin = () => setIsLogin(true);



if(!user) {
  return (
    <div className="max-w-md mx-auto min-h-screen">
      <section className='m-10'>
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
              <form action="" className="max-w-4xl mx-auto flex flex-col items-center gap-5 text-base">
                      <div className='flex justify-between w-full items-center'>
                      <label className="pl-5" htmlFor="tel">手機 : </label>
                        <input type="tel" id="tel" name="tel" required minLength="10" maxLength="10" placeholder="09XXXXXXXX" className="px-5 py-2 rounded-full border border-solid border-slate-900 dark:border-none w-3/4" />
                      </div>
                      
                      <div className='flex justify-between w-full items-center'>
                        <label className="pl-5" htmlFor="birthday">生日 : </label>
                        <input type="date" name="birthday" id="birthday" required className=" px-5 py-2 rounded-full border border-solid border-slate-900 dark:border-none w-3/4"></input>
                      </div>
                      
                      <button 
                      className="bg-rose-400 hover:bg-rose-300 active:bg-rose-200 text-white p-2 w-full  rounded-full border border-solid border-slate-900 dark:border-none">
                        登入</button>
                      <button 
                      onClick={() => (window.location.href = "http://localhost:5000/auth/google")}
                      className="bg-rose-400 hover:bg-rose-300 active:bg-rose-200 text-white p-2 w-full  rounded-full border border-solid border-slate-900 dark:border-none flex justify-center gap-2" >
                        <img src="src/assets/googleIcon2.png" alt="googleIcon" width="25" />
                        使用Google登入
                      </button>
                      <button 
                      onClick={() => (window.location.href = "http://localhost:5000/auth/line")}
                      className="bg-rose-400 hover:bg-rose-300 active:bg-rose-200 text-white p-2 w-full  rounded-full border border-solid border-slate-900 dark:border-none flex justify-center gap-2">
                        <img src="src/assets/lineIcon3.png" alt="googleIcon" width="25" />
                        使用Line登入</button>
                </form>
            }
            
            {/* 註冊表單  */}

            {!isLogin && 
              <form action="" className="max-w-4xl mx-auto flex flex-col items-center gap-5 text-md ">

                <div className='flex justify-between w-full items-center'>
                <label className="pl-5" htmlFor="name">姓名 : </label>
                  <input type="name" name="name" required maxLength="10" placeholder="您的大名" className="px-5 py-2 rounded-full border border-solid border-slate-900 dark:border-none w-3/4" />

                </div>

                <div className='flex justify-between w-full items-center'>
                <label className="pl-5" htmlFor="tel">手機 : </label>
                  <input type="tel" id="tel" name="tel" required minLength="10" maxLength="10" placeholder="09XXXXXXXX" className="px-5 py-2 rounded-full border border-solid border-slate-900 dark:border-none w-3/4" />

                </div>
                
                <div className='flex justify-between w-full items-center'>
                  <label className="pl-5" htmlFor="birthday">生日 : </label>
                  <input type="date" name="birthday" id="birthday" required className=" px-5 py-2 rounded-full border border-solid border-slate-900 dark:border-none w-3/4"></input>
                </div>
                
                <button 
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
              </form>
            }
            
        </div>

      </section>
    </div>
  )
}}


export default Login;