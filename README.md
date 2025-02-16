
### Features

- Real-Time Messaging
- Private and Group Chats
- Message Attachments
- Conversation History
- User Authentication and Admin Controls
- Last Message Tracking
- Responsive Design

### How to Run the App (Development Environment)

1. Clone the repository and navigate into it:
    ```sh
    git clone <repository-url>
    cd MessageChat_Reverb
    ```
2. Install dependencies:
    ```sh
    composer install
    npm install
    ```
3. Copy the example environment file to `.env`:
    ```sh
    cp .env.example .env
    ```
4. Run database migrations and seed the database:
    ```sh
    php artisan migrate:fresh --seed
    ```
5. Generate the application key:
    ```sh
    php artisan key:generate
    ```
6. Start the development servers:
    ```sh
    npm run dev
    php artisan serve
    php artisan reverb:start
    ```
7. Open your browser and visit `http://localhost:8000` or `http://127.0.0.1:8000`.

