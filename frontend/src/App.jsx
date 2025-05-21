import {
    Routes,
    Route,
    useLocation
  } from "react-router-dom";

  import {useState, useEffect} from "react";
  import Navbar from "./components/Navbar";
  import Footer from "./components/Footer";
  import Home from "./pages/Home";
  import About from "./pages/About";
  import Services from "./pages/Services";
  import Booking from "./pages/Booking";
  import BookingDateTimeContent from "./pages/Booking-step2";
  import BookingClientContent from "./pages/Booking-step3";
  import Login from "./pages/Login";
  import Account from "./pages/Account";
  import ScrollToTop from "./components/ScrollToTop";
  // import Loading from "./components/Loading";
  
  
  function App() {
    // const location = useLocation();
    // const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //   setLoading(true);

    //   const timer = setTimeout(() => {
    //     setLoading(false);
    //   },800);

    //   return () => clearTimeout(timer);
    // },[location]);

    
    return (
      <>
        {/* {loading && <Loading />} */}
        <ScrollToTop />
        <Navbar />
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking-step2" element={<BookingDateTimeContent />} />
            <Route path="/booking-step3" element={<BookingClientContent />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </div>
        <Footer />
      </>
    );
  }
  
  export default App;
