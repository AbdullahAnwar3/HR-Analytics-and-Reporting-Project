itle: HR Analytics and Reporting Web Application

Overview:
This web application is designed to facilitate Human Resources (HR) management by providing analytics and reporting functionalities. It consists of two sides: the employee side and the admin side. The backend is powered by Node.js with MongoDB as the database, while the frontend is built using React.js.

Features:

1. Employee Side:
    - Login Page: Allows users to authenticate using their credentials stored in the database.
    - Employee Portal Page: Upon successful login, employees are directed to this page. It serves as a dashboard providing various navigation options.
    - Leave Request Page: Enables employees to apply for leave with customizable options.
    - Payroll Benefit Page: Displays sample details of an employee's benefit program and payroll information. Backend implementation for this page is pending.

2. Admin Side:
    - Not implemented yet.

File Structure:
- app.js: Backend server file responsible for routing and handling API requests.
- mongo.js: Handles MongoDB connections and schema definitions.
- src/Components/: Contains frontend components representing different pages of the web application.

Database Structure:
- login.credentials.collections: Collection storing user authentication credentials. Example document structure:
    ```json
    {
      "id": 1,
      "firstName": "Meesum",
      "lastName": "Raza",
      "email": "24100183@lums.edu.pk",
      "password": "12345678",
      "salary": "95000",
      "date": "2019-04-11"
    }
    ```
