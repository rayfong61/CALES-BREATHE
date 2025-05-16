# Cale's Breathe 熱蠟美肌預約系統
#### Video Demo:  <https://youtu.be/NNO4vuKKK4U>
一個為熱蠟工作室設計的客製化預約平台，結合前台預約、用戶帳戶管理、業者後台管理功能與客戶評價展示，專為提升預約效率與品牌形象而打造。

## 功能特色
### 使用者前台
- 首頁: 形象影片/店家介紹/顧客回饋
- 服務項目: 服務介紹/照片/價目表/預約按鈕
- 會員: 註冊 / 登入（支援 LINE、Google OAuth）
- 檢視可預約時段
- 建立與取消預約
- 查看個人預約紀錄
- 編輯帳戶資料 / 上傳大頭貼
- 響應式設計，支援手機與桌機

###  業者後台（EJS 伺服端渲染）
- 月曆視圖檢視所有預約
- 客戶名單與聯絡資料總覽
- 評價與回饋彙整
- 權限驗證保護

### 技術棧

| 前端（React） | 後端（Node.js） | 資料庫 |
| --- | --- | --- |
| Vite + React | Express + Passport.js | PostgreSQL |
| Tailwind CSS | Multer (圖片上傳) | pg Node 驅動 |
| React Router | session-based auth | bcrypt 密碼加密 |
| 前端狀態管理：useState / useEffect | RESTful API 設計 | JWT / Session |

### 內容
