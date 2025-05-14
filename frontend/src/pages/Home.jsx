import { Link } from 'react-router-dom';
import Testimonial from "../components/Testimonial";
import Services from "./Services";

function Home() {
    return (
      <div>
        {/*<section
          id="hero"
          className="relative max-w-full mx-auto p-4 flex flex-col justify-center text-center items-center min-h-dvh overflow-hidden">
           背景圖層  
          <div className="absolute inset-0 bg-[url('src/assets/hero9.png')] bg-cover bg-center z-0" />

           前景內容
          <div className="relative z-10 ">
            <h2 className="text-4xl md:text-5xl text-rose-700 text-shadow-xs">
              質 感 香 氣 x 熱 蠟 美 肌
            </h2>
            <h1 className="text-xl py-6 md:text-2xl text-shadow-xs">
              讓 肌 膚 深 呼 吸，讓 妳 自 在 閃 耀
            </h1>
            <Link to="/services">
              <button className="rounded-full px-10 py-2 my-2 text-lg hover:opacity-80 md:text-xl cursor-pointer bg-rose-700 text-white">
                服務項目
              </button>
            </Link>
          </div>
        </section> */}

      <section
        id="hero"
        className="relative max-w-full mx-auto p-4 flex flex-col justify-center text-center items-center min-h-dvh overflow-hidden"
      >
        {/* 背景影片層 */}
        <video
          className="absolute inset-0 w-full h-dvh object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/hero14.mp4" type="video/mp4" />
          您的瀏覽器不支援影片播放。
        </video>

        {/* 前景內容 */}
        <div className="relative z-10">
          <h2 className=" text-rose-400 text-shadow-lg text-[clamp(2rem,5vw,3rem)]">
            質 感 香 氣 / 熱 蠟 美 肌
          </h2>
          <h1 className=" py-6 text-[clamp(1rem,5vw,2rem)] text-white text-shadow-lg">
            讓 肌 膚 深 呼 吸，讓 妳 自 在 閃 耀
          </h1>
          <Link to="/services">
            <button className="rounded px-12 py-3 mt-20 text-lg hover:opacity-80 md:text-xl cursor-pointer bg-rose-400 text-white">
              服務項目
            </button>
          </Link>
        </div>
      </section>


      <section id="intro" className='max-w-5xl mx-auto px-15 py-20 grid sm:grid-cols-2 gap-x-10'>
        
        <div className='flex flex-col justify-center items-center'>
        <h2 className="text-3xl/10 md:text-4xl/12 mb-6 text-shadow-lg">
        使 用 芳 香 療 法 融 合 熱 蠟 美 肌 ，呵 護 您 的 肌 膚
        </h2>
        <article className="text-base/8 md:text-lg/10 text-shadow-md mb-10">
            <p >
              希臘神話的眾女神中, 有一位女神叫<span className='font-bold'>Cale</span>,
              音：「卡蕾～」,代表優雅、美麗、有魅力的女人的意思,
              在Cale's Breathe的空間裡, 我們運用芳香療法結合熱蠟除毛🌿,
              在這個空間裡, 妳聞的香氣都是天然精油和植物熱蠟的味道,  香香的。
            </p>
            <p >
              做完熱蠟美肌後🍯, 從臉到腳的每個毛孔都純淨的在呼吸, 
              像嬰兒的呼吸般純淨, 帶著甜蜜的輕喘, 綻放心心點點的美麗。
            </p>
        </article>
        </div>
        <img src="test4.jpg" className='w-full h-full rounded-4xl object-cover'></img>
      </section>
      {/* <div id="services" className='pt-16'><Services /></div> */}
      
      <Testimonial />
        </div>
        
    );
  }
  
  export default Home;
  