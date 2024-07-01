# Bite Menu Trigger Sync

## Requirements

- Node.js
- PostgreSQL

## Installation

1. Clone the repository:
    git clone https://github.com/your-username/bite-menu.git
    cd bite-menu

2. Install dependencies:
    npm install

3. Set up environment variables:
    Replace user and password fields in .env file for postgres

4. Set up the database by running script to create bite database and necessary schemas:
    npm run setup-db

5. Start the server:
    npm run start

6. Navigate to [localhost](http://www.localhost:3000/) or make call to http://www.localhost:3000/trigger-sync

7. Inspect console for successful menu synchronization message

## Testing

To run jest test suite:
    npm run test