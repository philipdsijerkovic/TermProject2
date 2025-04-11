# Term Project for CSC 372 - Web Development

## Installation
1. Clone the repository:
    ```bash
    git clone https://github.com/philipdsijerkovic/TermProject2.git
    ```
2. Navigate to the project directory (some computers are already there):
    ```bash
    cd TermProject2
    ```
3. Install dependencies:
    ```bash
    npm install
    ```

4. Create a folder named ".data"

6. Launch the node server:
     ```bash
    node server.js
    ```

7. Populate the SQL table with these commands: 
     ```bash
    sqlite3 .data/fish.db
    .read insert_products.sql
    .read insert_categories.sql
    SELECT * FROM products
    SELECT * FROM categories
    ```
    These last two lines are to verify it was successful. 


8. Now, the site is dynamically set up so you can navigate or run endpoints such as:
     ```bash
    localhost:3000/api/all
    ```

Access the app at `http://localhost:3000`.


