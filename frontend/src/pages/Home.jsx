import { Link } from 'react-router-dom';
import Testimonial from "../components/Testimonial";
import Services from "./Services";

function Home() {
    return (
      <div>
        <section id="hero" className="max-w-full mx-auto p-4 flex flex-col justify-center text-center items-center bg-[url(src/assets/hero5.jpg)] bg-cover bg-center h-150">
        <h2 className="text-xl md:text-2xl  text-rose-800">
        Cale's Breathe - 質感香氣x熱蠟美肌工作坊
        </h2>
        <h1 className="text-4xl py-6 md:text-5xl">
        讓肌膚深呼吸，讓妳自在閃耀
        </h1>
        <a href="#services">
        <button className="rounded-full px-5 py-2 my-2 text-md border border-solid hover:text-white md:text-lg cursor-pointer">
          服務項目
        </button>
        </a>
      </section>

      <section id="intro" className='max-w-4xl mx-auto p-10 flex flex-col justify-center  items-center '>
      <h2 className="text-3xl md:text-4xl">
      品牌故事
      </h2>
      <article className="text-base/10 py-6 md:text-xl/12">
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
        
        







        <p>

        </p>


      </section>
      <div id="services" className='pt-16'><Services /></div>
      
      <Testimonial />
        </div>
        
    );
  }
  
  export default Home;
  