CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(25) NOT NULL,
    user_type TEXT CHECK(user_type IN ('admin', 'shopper')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    categories_id INTEGER PRIMARY KEY AUTOINCREMENT,
    categories_name VARCHAR(50) NOT NULL
);

CREATE TABLE products (
    products_id INTEGER PRIMARY KEY AUTOINCREMENT,
    products_name VARCHAR(50) NOT NULL,
    products_description TEXT,
    products_image_url VARCHAR(400),
    products_price DECIMAL(10, 2) NOT NULL,
    products_category_id INTEGER NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
);

CREATE TABLE carts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    status TEXT CHECK(status IN ('new', 'abandoned', 'purchased')) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL,
);

CREATE TABLE cart_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cart_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
);