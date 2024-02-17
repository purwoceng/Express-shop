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


## Usage
Describe how to use your API, including authentication methods and any special considerations.

## Endpoints
List all available endpoints of your API along with a brief description of each.

### `GET /users`
Description: Retrieves information about the authenticated user.

#### Request Headers
- `Authorization`: Bearer token for authentication.

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
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
