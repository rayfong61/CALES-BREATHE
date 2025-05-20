import { useAuth } from "../components/AuthContext"; 
import { useState, useEffect } from "react";
import axios from "axios";
import Orders from "../components/Orders";


function Account() {
    const api = import.meta.env.VITE_API_BASE;
    const fallbackPhoto = "default.jpg"; 
    const [isBooking, setIsBooking] = useState(true);
    const toggleToAditing = () => setIsBooking(false);
    const toggleToBooking = () => setIsBooking(true);
    const { user, setUser, loading } = useAuth();
    const [originalData, setOriginalData] = useState(null);
    const formatToDateInput = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份從 0 開始，所以要加 1 並補零
      const day = String(date.getDate()).padStart(2, '0'); // 補零確保是兩位數
      return `${year}-${month}-${day}`;
    };
    
    

    useEffect(() => {
      if (user) {
        const initialData = {
          client_name: user.client_name || "",
          contact_mobile: user.contact_mobile || "",
          contact_mail: user.contact_mail || "",
          birthday: user.birthday ? formatToDateInput(user.birthday) : "",
          address: user.address || "",
          photo: user.photo || null,
        };
        setFormData(initialData);
        setOriginalData(initialData); // ← 加這行
      }
    }, [user]);

    const [formData, setFormData] = useState({
      client_name: "",
      contact_mobile: "",
      contact_mail: "",
      birthday: "",
      address: "",
      photo: null,
    });

    const isFormChanged = () => {
      if (!originalData) return false;
      for (let key in formData) {
        if (key === "photo") {
          // 判斷圖片是否有更新（File vs 路徑）
          if (formData.photo instanceof File) return true;
          if (formData.photo !== originalData.photo) return true;
        } else if (formData[key] !== originalData[key]) {
          return true;
        }
      }
      return false;
    };

    

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    const handleFileChange = (e) => {
      setFormData(prev => ({ ...prev, photo: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const data = new FormData();
      for (let key in formData) {
        if (formData[key]) data.append(key, formData[key]);
      }
    
      try {
        const res = await axios.put(`${api}/account/update`, data, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
    
        const updatedUser = res.data.updatedUser;
    
        setUser(updatedUser);
        setFormData({
          client_name: updatedUser.client_name || "",
          contact_mobile: updatedUser.contact_mobile || "",
          contact_mail: updatedUser.contact_mail || "",
          birthday: updatedUser.birthday?.split("T")[0] || "",
          address: updatedUser.address || "",
          photo: updatedUser.photo || null, // ← 用新路徑覆蓋掉 File 物件
        });
    
        alert("資料已更新！");
      } catch (err) {
        alert("更新失敗");
      }
    };
  
    
    const handleLogout = () => {
        fetch(`${api}/logout`, {
          method: "GET",
          credentials: "include",
        })
          .then((res) => res.json())
          .then(() => {
            setUser(null);
            window.location.href = "/"; // 可選：登出後導回首頁
          });
      };
      

    if (loading) return <div>載入中...</div>;

    if (!user) return <div>請先登入</div>;

    let photoSrc = fallbackPhoto;
    

    if (formData.photo instanceof File) {
      photoSrc = URL.createObjectURL(formData.photo);
    } else if (formData.photo) {
      // ✅ 新增判斷：是完整的 URL 就不要加 API_BASE
      if (formData.photo.startsWith("http")) {
        photoSrc = formData.photo;
      } else {
        photoSrc = `${api}${formData.photo}`;
      }
    } else if (user.photo) {
      if (user.photo.startsWith("http")) {
        photoSrc = user.photo;
      } else {
        photoSrc = `${api}${user.photo}`;
      }
    }

    // console.log(photoSrc);

    return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="min-h-screen max-w-md mx-auto">
                <section className='m-6 '>

                    <div className='grid place-content-center text-center '>

                      <div id="customerPic" className='bg-red-50 w-32 h-32 rounded-full shadow-sm grid place-content-center'>
                        <div className="w-30 h-30 rounded-full overflow-hidden shadow-sm relative">
                            <img
                              src={photoSrc}
                              alt="使用者頭像"
                              className="w-full h-full object-cover cursor-pointer"
                              onClick={() => document.getElementById("photoInput").click()}
                            />
                        </div>
                        <input id="photoInput" type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }}/>
                      </div>
                      <h2 className='text-xl p-2'>
                          {user.client_name}
                      </h2>
                    </div>
                    
                            

                    <nav className="text-base my-3 flex justify-center gap-2 text-center">
                        <div className={`hover:bg-red-300 hover:underline cursor-pointer py-3 rounded-full w-25 ${isBooking ? 'bg-red-200' : ''}`} onClick={toggleToBooking}>預約紀錄</div>

                        <div className={`hover:bg-red-300 hover:underline cursor-pointer py-3 rounded-full w-25 ${!isBooking ? 'bg-red-200' : ''}`} onClick={toggleToAditing}>個人資料</div>

                        <div className='hover:bg-red-300 hover:underline cursor-pointer py-3 rounded-full w-25'
                             onClick={handleLogout}>登出</div>
                    </nav>

                    <div className='text-base bg-white p-6 rounded-4xl'>
                        {isBooking && 
                         <Orders/>
                        }

                        {!isBooking &&
                            
    
                            <div className='grid  w-full items-center'>

                            

                            <label className="text-sm py-2" >姓名 : </label>
                            <input name="client_name" 
                                   value={formData.client_name} 
                                   onChange={handleChange} 
                                   className="bg-rose-50 w-full" />

                            <label className="text-sm py-2" >手機 : </label>
                            <input name="contact_mobile" 
                                   value={formData.contact_mobile} 
                                   onChange={handleChange} 
                                   className="bg-rose-50 w-full" />

                            <label className="text-sm py-2" >E-mail : </label>
                            <input name="contact_mail" 
                                   value={formData.contact_mail} 
                                   onChange={handleChange} 
                                   className="bg-rose-50 w-full" />

                            <label className="text-sm py-2" >生日 : </label>
                            <input type="date" 
                                   name="birthday" 
                                   value={formData.birthday} 
                                   onChange={handleChange} 
                                   className="bg-rose-50 w-full" />

                            <label className="text-sm py-2" >地址 : </label>
                            <input name="address" 
                                   value={formData.address} 
                                   onChange={handleChange} 
                                   className="bg-rose-50 w-full" />
                            <nav className="text-sm pt-6 flex justify-center gap-2 text-center">
                            <button type="submit"
                                    disabled={!isFormChanged()}
                                    className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded w-30 disabled:opacity-50 cursor-pointer">
                                      儲存變更
                            </button>
                            </nav>
                            
          

                            
                            </div>
                            
                        }
                        
                    </div>
                </section>
            </div>
    </form>

    )
}

export default Account;

{/* 
    姓名
    生日
    電話
    LINE
    地址
    如何得知本店
    是否有肌膚過敏史
    平常除毛方式
    平常去角質方式
    是否有皮膚方面疾病
    */}