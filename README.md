
PawsWev Application - README
Installation Requirements
NodeJS
Sqlite3


To test the application, start the server and navigate to the following routes in your web browser:

Homepage: http://localhost:3000
Login Page: http://localhost:3000/login
Register Page: http://localhost:3000/register
Pet Management (for Shelter users): http://localhost:3000/shelter/pet-management

***Shelter ACCOUNT:*** 
username : bob_shelter    
password : password123

***Admin ACCOUNT:*** 
username: wanni    
password: 123



Configuration
Environment Variables
Ensure the following environment variables are set in your .env file:
SESSION_SECRET=your_session_secret
DATABASE_URL=./database.db
Database Initialization
The database schema is automatically initialized when the application starts. Make sure that the db_schema.sql file is located in the database directory.

Additional Libraries
The following additional libraries are used in this project:

express-session: For managing user sessions
sqlite3: For SQLite database management
dotenv: For managing environment variables


checkAdmin: This middleware function is used to ensure that only users with the admin role can access certain routes. If a non-admin user tries to access these routes, they will receive a "403 Access Denied" error.

checkShelter: This middleware function checks if the user is authenticated as a shelter manager. If the user is not logged in as a shelter manager, they are redirected to the login page.

checkAuth: This function ensures that the user is authenticated before they can access protected routes. If the user is not authenticated, they will be redirected to the login page.

handleDatabaseError: This utility function is used to handle database errors consistently throughout the application. It logs the error and sends a custom error message to the client.

