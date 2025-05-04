import { Link } from "react-router-dom";
import React from 'react'
import { useAuth } from "./AuthContext";

function Footer() {
  const year = new Date().getFullYear();
  const { user } = useAuth();

  return (
    <footer id="footer" className="bg-red-200 text-md">
      <section className="max-w-4xl mx-auto p-10 flex flex-col sm:flex-row sm:justify-between">
        <div>
          <h2>Cale's Breathe</h2>
          330桃園市桃園區同德十一街136號3樓<br />
          Email: <a href="mailto:lindseytseng@gmail.com">lindseytseng@gmail.com</a><br />
          Phone: <a href="tel:+886925780626">0925780626</a>
        </div>
        <nav className="hidden md:flex flex-col gap-2" aria-label="footer">
          
          <Link className="hover:opacity-80" to="/about">關於我們</Link>
          <Link className="hover:opacity-80" to="/services">服務項目</Link>
          <Link className="hover:opacity-80" to="/booking">立即預約</Link>
          {!user ? (
            <Link className="hover:opacity-80" to="/login">會員登入</Link>
          ) : (
            <Link className="hover:opacity-80" to="/account">我的帳號</Link>
          )}
        </nav>
        <div className="flex flex-col sm:gap-2 text-right">
          <p>Copyright &copy; {year}</p>
          <p>All Rights Reserved</p>
        </div>
      </section>
    </footer>
  )
}

export default Footer

