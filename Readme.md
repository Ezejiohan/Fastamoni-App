### Documentation for Fastamoni App

#### 1. **User Authentication Endpoints**

- **POST** `/register`
  - **Description**: Registers a new user.
  - **Request Body**:
    ```json
    {
      "firstname": "John",
      "lastname": "Doe",
      "username": "johndoe",
      "email": "johndoe@example.com",
      "password": "password123",
      "phone": "1234567890",
      "country": "USA",
      "account_status": "active"
    }
    ```
  - **Response** (201 Created):
    ```json
    {
      "data": {
        "_id": "user_id",
        "firstname": "John",
        "lastname": "Doe",
        "username": "johndoe",
        "email": "johndoe@example.com",
        "phone": "1234567890",
        "country": "USA",
        "account_status": "active"
      }
    }
    ```

- **POST** `/login`
  - **Description**: Logs in an existing user.
  - **Request Body**:
    ```json
    {
      "email": "johndoe@example.com",
      "password": "password123"
    }
    ```
  - **Response** (200 OK):
    ```json
    {
      "result": {
        "id": "user_id",
        "email": "johndoe@example.com",
        "token": "jwt_token"
      }
    }
    ```

#### 2. **Wallet Management Endpoints**

- **POST** `/wallets`
  - **Description**: Creates a wallet for a user.
  - **Middleware**: `userAuthenticate`
  - **Request Body**:
    ```json
    {
      "user_id": "user_id",
      "type": "savings"
    }
    ```
  - **Response** (201 Created):
    ```json
    {
      "message": "Wallet created successfully",
      "newWallet": {
        "user_id": "user_id",
        "account_number": "generated_account_number",
        "balance": "0.00",
        "type": "savings",
        "status": "active"
      }
    }
    ```

- **GET** `/wallets/:walletId`
  - **Description**: Retrieves wallet details by ID.
  - **Middleware**: `userAuthenticate`
  - **Response** (200 OK):
    ```json
    {
      "message": "Wallet found successfully",
      "wallet": {
        "user_id": "user_id",
        "account_number": "account_number",
        "balance": "100.00",
        "type": "savings",
        "status": "active"
      }
    }
    ```

#### 3. **Transaction Pin Management Endpoint**

- **POST** `/createPin`
  - **Description**: Creates a transaction PIN for the user’s wallet.
  - **Middleware**: `userAuthenticate`
  - **Request Body**:
    ```json
    {
      "user_id": "user_id",
      "wallet_id": "wallet_id",
      "pin": "1234"
    }
    ```
  - **Response** (201 Created):
    ```json
    {
      "message": "Transaction PIN created successfully",
      "pin": {
        "user_id": "user_id",
        "wallet_id": "wallet_id",
        "pin": "hashed_pin"
      }
    }
    ```

#### 4. **Donation System Endpoints**

- **POST** `/donations`
  - **Description**: Creates a donation from a donor to a recipient.
  - **Middleware**: `userAuthenticate`
  - **Request Body**:
    ```json
    {
      "donorId": "donor_id",
      "recipientId": "recipient_id",
      "donor_wallet_id": "donor_wallet_id",
      "recipient_wallet_id": "recipient_wallet_id",
      "amount": 50.0,
      "message": "Keep up the good work",
      "pin": "1234"
    }
    ```
  - **Response** (201 Created):
    ```json
    {
      "message": "Donation created successfully",
      "donation": {
        "donor": "donor_id",
        "recipient": "recipient_id",
        "amount": 50.0,
        "message": "Keep up the good work"
      }
    }
    ```

- **GET** `/donations/getDonationCount/:userId`
  - **Description**: Retrieves the count of donations made by a user.
  - **Middleware**: `userAuthenticate`
  - **Response** (200 OK):
    ```json
    {
      "message": "User has made 3 donation(s)",
      "count": 3
    }
    ```

- **GET** `/donations/getSingleDonation/:donationId`
  - **Description**: Retrieves a single donation by its ID.
  - **Middleware**: `userAuthenticate`
  - **Response** (200 OK):
    ```json
    {
      "message": "Donation fetched successfully",
      "donation": {
        "donor": "donor_id",
        "recipient": "recipient_id",
        "amount": 50.0,
        "message": "Keep up the good work"
      }
    }
    ```

- **GET** `/donations/:startDate/:endDate`
  - **Description**: Retrieves all donations within a specific date range.
  - **Middleware**: `userAuthenticate`
  - **Response** (200 OK):
    ```json
    {
      "message": "Donations fetched successfully",
      "donations": [
        {
          "donor": "donor_id",
          "recipient": "recipient_id",
          "amount": 50.0,
          "message": "Keep up the good work",
          "createdAt": "2023-08-01"
        },
        ...
      ]
    }
    ```

#### 5. **Email Notification**

- **Description**: Sends a special thank you email to donors who make two or more donations.
  - **Email Subject**: "Thank You for Your Generous Donations!"
  - **Message**: 
    ```
    Dear {user.firstname}, thank you for making multiple donations! We truly appreciate your support.
    ```