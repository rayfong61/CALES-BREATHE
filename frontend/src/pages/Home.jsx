import { Link } from 'react-router-dom';

function Home() {
    return (
      <div>
        <section id="hero" className="max-w-4xl mx-auto p-4 flex flex-col justify-end text-center items-center bg-[url(src/assets/hero.png)] bg-cover bg-center h-150">
        <h2 className="text-md md:text-lg">
        Cale's Breathe - 質感香氣x熱蠟美肌工作坊
        </h2>
        <h1 className="text-3xl py-6 md:text-4xl">
        讓肌膚深呼吸，讓妳自在閃耀
        </h1>
        <Link to="/services">
        <button className="rounded-full px-5 py-2 my-2 text-md border border-solid hover:text-white md:text-lg cursor-pointer">
          服務項目
        </button>
        </Link>
      </section>

      <section id="intro" className='max-w-4xl mx-auto p-10 flex flex-col justify-center text-center items-center bg-red-300 '>
      <h2 className="text-2xl md:text-3xl">
      品牌故事
      </h2>
      <article className="italic text-md text-base/8 py-6 md:text-lg">
        <p >
          希臘神話的眾女神中, 有一位女神叫<span className='font-bold'>Cale</span>,<br/> 
          音：「卡蕾～」,<br />
          代表優雅、美麗、有魅力的女人的意思,<br/> 
          在Cale's Breathe的空間裡, <br/>
          我們運用芳香療法結合熱蠟除毛🌿,<br/>
          在這個空間裡, <br/>
          妳聞的香氣都是天然精油和植物熱蠟的味道, <br/>
          香香的,<br/>
          做完熱蠟美肌後🍯, <br/>
          從臉到腳的每個毛孔都純淨的在呼吸, <br/>
          像嬰兒的呼吸般純淨, 帶著甜蜜的輕喘, <br/>
          綻放心心點點的美麗<br/>
        </p>
      </article>
        
        







        <p>

        </p>


      </section>
        </div>
        
    );
  }
  
  export default Home;
  