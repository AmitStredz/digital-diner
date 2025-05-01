# The Digital Diner API

This is the backend API for "The Digital Diner" restaurant application. The API allows users to browse the menu, place orders, and view order history.

## Database Design

This application uses both MongoDB and PostgreSQL databases:

1. **MongoDB** - Used for menu-related data:
   - Menu items collection - Stores flexible menu item details including name, description, price, dietary information, etc.
   - Categories collection - Stores menu categories

2. **PostgreSQL** - Used for user and order-related data:
   - Users table - Stores customer information
   - Orders table - Stores order information
   - Order_Items table - Links orders to menu items

## Tech Stack

- Node.js
- Express
- MongoDB (for menu items - flexible schema)
- PostgreSQL (for users and orders - relational data)
- Mongoose (MongoDB ORM)
- Sequelize (PostgreSQL ORM)

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following environment variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://<db_username>:<db_password>@test.b2t9voc.mongodb.net/digital-diner
   POSTGRES_URI=postgresql://postgres:[YOUR-PASSWORD]@db.iaynguqaltrwighlrlsm.supabase.co:5432/postgres
   JWT_SECRET=your-secret-key
   ```
   (Replace `<db_username>`, `<db_password>`, `[YOUR-PASSWORD]`, and `your-secret-key` with actual values)

4. Create the PostgreSQL tables using the following SQL:
   ```sql
   CREATE TABLE users (
     user_id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     phone_number VARCHAR(20) NOT NULL UNIQUE,
     email VARCHAR(255),
     role VARCHAR(50) NOT NULL DEFAULT 'customer',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE orders (
     order_id SERIAL PRIMARY KEY,
     user_id INTEGER NOT NULL REFERENCES users(user_id),
     total_price DECIMAL(10, 2) NOT NULL,
     status VARCHAR(50) NOT NULL DEFAULT 'pending',
     pickup_time TIMESTAMP,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE order_items (
     order_item_id SERIAL PRIMARY KEY,
     order_id INTEGER NOT NULL REFERENCES orders(order_id),
     menu_item_id VARCHAR(255) NOT NULL,
     quantity INTEGER NOT NULL DEFAULT 1,
     price_at_time DECIMAL(10, 2) NOT NULL,
     special_instructions TEXT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

5. Start the server:
   ```
   npm start
   ```
   Or for development:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication Endpoints
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login a user

### Menu Endpoints
- `GET /api/menu` - Get all menu items
- `GET /api/menu/categories` - Get all categories
- `GET /api/menu/category/:category` - Get menu items by category
- `GET /api/menu/:id` - Get a specific menu item by ID

### Admin Menu Endpoints
- `POST /api/menu` - Create a new menu item
- `PUT /api/menu/:id` - Update a menu item
- `DELETE /api/menu/:id` - Delete a menu item
- `POST /api/menu/categories` - Create a new category
- `PUT /api/menu/categories/:id` - Update a category
- `DELETE /api/menu/categories/:id` - Delete a category

### Order Endpoints
- `POST /api/orders` - Create a new order
- `GET /api/orders/:id` - Get a specific order by ID
- `GET /api/orders/phone/:phone` - Get all orders for a specific phone number 