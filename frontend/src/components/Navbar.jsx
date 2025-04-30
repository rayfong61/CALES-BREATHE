import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./AuthContext";

function Navbar() {
  const[isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = (
    <>
      <Link className="hover:opacity-80" to="/about">關於我們</Link>
      <Link className="hover:opacity-80" to="/services">服務項目</Link>
      <Link className="hover:opacity-80" to="/booking">立即預約</Link>
      {!user ? (
        <Link className="hover:opacity-80" to="/login">會員登入</Link>
      ) : (
        <Link className="hover:opacity-80" to="/account">我的帳號</Link>
      )}
    </>
  );

  return (
    <nav className="bg-red-200 sticky top-0 z-60">
      <section className="max-w-4xl mx-auto p-4 flex justify-between items-center">
          <h1 className="leckerli-one-regular text-4xl">
          <Link to="/">🎀Cale's Breathe</Link>
          </h1>
          <div>
            <button className="text-4xl md:hidden cursor-pointer" onClick ={toggleMenu}>
            &#9776;
            </button>
            <nav className="hidden md:block space-x-8 text-md">
            
            {menuItems}
            
            </nav>
          </div>
      </section>
      {isMenuOpen && (
        <section className="absolute top-0 bg-red-400 w-full text-3xl flex flex-col justify-center origin-top" onClick={toggleMenu}>
        <button className="text-4xl self-end p-5 cursor-pointer">
            &times;
        </button>
        <nav className="flex flex-col min-h-screen items-center py-8 ">
          <Link className="w-full text-4xl text-center py-6 hover:opacity-80 leckerli-one-regular" to="/">🎀Cale's Breathe</Link>
          {menuItems}
        
        </nav>
       </section>
      )}
      
       
      
    </nav>
  );
}

export default Navbar;
