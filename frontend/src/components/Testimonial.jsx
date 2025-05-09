import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const testimonials = [
    {
        quote: "桃園藝文特區最棒的熱蠟除毛工作室!",
        content:"從一進門那刻就能感受到熱蠟師的細心與用心～使用的產品與衛教也很仔細說明♡除毛過程中很溫柔!!減緩了孕媽咪的緊張感☺️",
        name:"yuyu C",
        stars: 5,
    },
    {
    quote: "Amazing Results and So Friendly!",
    content: "I've seen huge improvements in just a few sessions. Highly recommend!",
    name: "Jessica",
    stars: 5,
    },
    {
    quote: "令人安心的店家!",
    content: "初次除毛，也因懷孕31周，會蠻緊張的，但整體的環境、除毛師的解說，過程執行前也會提醒，整個過令人十分安心，值得再訪☺️",
    name: "Amanda Yu",
    stars: 5,
    },


]

const TestimonialSlider = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
  };

  return (
    <div className="bg-rose-100 py-20 px-10 text-center font-serif">
      <Slider {...settings}>
        {testimonials.map((t, index) => (
          <div key={index} className="max-w-3xl mx-auto">
            <div className="text-white text-3xl mb-4">
              {"★".repeat(t.stars)}
            </div>
            <h2 className="text-4xl text-[#5c443a] mb-6 font-normal">
              "{t.quote}"
            </h2>
            <p className="text-lg text-gray-800 max-w-2xl mx-auto mb-6 leading-relaxed font-sans">
              {t.content}
            </p>
            <p className="text-2xl text-[#5c443a] font-sans">- {t.name}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default TestimonialSlider;