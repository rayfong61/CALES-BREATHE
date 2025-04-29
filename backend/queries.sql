CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES client(id),  -- 顧客id
    booking_detail JSONB,                  -- 預約的詳細內容
    total_price INTEGER,                   -- 總金額
    total_duration INTEGER,                -- 總時長
    booking_date DATE,                     -- 預約日期
    booking_time TIME,                     -- 預約時間
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE client (
	id SERIAL PRIMARY KEY,                      -- 顧客id
	client_name VARCHAR(100) NOT NULL,          -- 顧客姓名
	contact_mobile VARCHAR(20),                 -- 手機
	contact_mail VARCHAR(100) UNIQUE,           -- e-mail
	birthday DATE,                              -- 生日
	address VARCHAR(255),                       -- 地址
	password VARCHAR(255) NOT NULL,             -- 密碼
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO client (client_name, contact_mobile, contact_mail, birthday, address, password)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING id, client_name, contact_mail
