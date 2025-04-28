import React, { useState, useEffect } from 'react';


export default function About()  {

    useEffect(() => {

        const interval = 
        setInterval( () => {  console.log("每秒執行一次")  }, 1000 );
      
        return () => clearInterval(interval); // 元件卸載時清除
      }, []);}


