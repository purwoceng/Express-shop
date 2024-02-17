# API Documentation

## Overview
The following is the Shop API Documentation with Express.Js
The system I created has 2 roles, namely:
- Seller (Only has 1 Seller)
- Regular User

Table Relations
![Alt text](./app/configs/db.png)

## Installation
For Instalation Project:
- Clone This Repository
```
https://github.com/purwoceng/Express-shop.git
```
- After successful Clone then go to the Project folder
```
cd Express-Shop
```
- After that to install all Dependencies do the command:
```
npm install
```
- If you have to migrate the database that has been created in the Prisma schema:
``` 
npx prisma migrate dev
```
Table Migrate Result:
![Alt text](./app/configs/shop.png)


## Usage
- To run it, please type the code:
```
npm start
```
- From this project I created 3 data seeders, namely:
  - authorization.jsn(to create faker role and permission data)
      - Role Seller Permission
    ![Alt text](./app/configs/seller.png)
      - Role Regular User Permission
    ![Alt text](./app/configs/user.png)
    to run the authorization.js seeder with the command
    ```
    node database/authorization.js
    ```
  - products.js (to create faker product data)
    Before running seeders products.js we have to fill in the categories table first
    ### `POST /categories`
    Description: Creates a new category.
    #### Request Body
    - `name`: The name of the categories.
    #### Example
      ```json
      {
        "name": "Makanan"
      }
      ```

       - to run the products.js seeder with the command
        ```
        node database/products.js
        ```
      - Result of the products.js
    ![Alt text](./app/configs/product.png)

  - user.js (to create faker user data)
      - to run the users.js seeder with the command
        ```
        node database/users.js
        ```
  ![Alt text](./app/configs/usersfaker.png)

## Endpoints
List all Endpoint Express Shopping Cart:


### `POST /users`
Description: Retrieves information about the authenticated user.

#### Example

### `POST /users`
Description: Creates a new user.

#### Request Body
- `name`: The name of the user.
- `email`: The email address of the user.
- `password`: The password of the user.

#### Example
```json
{
  "name": "Purwoceng",
  "email": "purwoceng@gmail.com",
  "password": "password123"
}
```
## Response
```json
{
  "message": "success add to users",
  "user": {
    "id": 6,
    "email": "purwoceng@gmail.com",
    "name": "Purwoceng",
    "password": "$2b$04$SMWQOObVhChGXGCw3xQVq.9FPBnHVRhvcS9tS63T16BmpikpWns0y",
    "is_blocked": false,
    "role_id": 2,
    "created_at": "2024-02-17T16:28:16.522Z",
    "updated_at": "2024-02-17T16:28:16.522Z"
  }
}
```

- After Register/Post Users Data, you can login with your email and password
## Endpoints
### `POST /login`
## Example
```json
{
  "email": "purwoceng@gmail.com",
  "password": "password123"
}
```
### Response
```json
  {
  "token": "Nvu+SSF2UewvAe86gNLexEf5Kf0ORweKjVs4KVJoJvKzmtOertwqRorZo8O+VQOaxBIhHf6f4Ku28RP0rFQ9+A==",
  "user": {
    "id": 6,
    "email": "purwoceng@gmail.com",
    "name": "Purwoceng"
  }
}
```

- and we will get a token after we log in and the token will be stored in the tokens table
  ![Alt text](./app/configs/tokens.png)
