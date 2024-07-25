**Project Documentation & Design Choices
Frameworks and Libraries:**

**Backend:** Django with Django REST Framework (DRF) and Simple JWT for authentication.

**Frontend:** React for the user interface.

**Database:** SQLite3 for simplicity in development.

**Static Files:** Served from a directory named staticfiles.

**Authentication:**
Implemented using Simple JWT to handle user login and registration.

**Folder Structure:**

**Backend:**
**myapp/:** Main Django application directory.
**staticfiles/:** Directory for static files.
**templates/:** Directory for HTML templates (if any).

**Frontend:**
**src/context/:** Contains AuthContext.js for authentication state management.
**src/components/:** Directory for React components.
**src/App.js**: Main React component file.

**Security:**
Used simple authentication methods for development purposes; no advanced security features implemented.

**Development Focus:**
Core features include user authentication, managing interests, and a basic chat system.
Assumptions

**Development Environment:**
Development is done on a local machine with Visual Studio Code.
No deployment or production-level security concerns are considered.

**Tools and Setup:**
No use of axios for API requests in React.
Development server runs with Django's built-in server and React's development server.

**Setup and Running Instructions**
**1. Prerequisites and Dependencies:**

Python 3.x
Django 4.x
Django REST Framework 3.x
Simple JWT 5.x
Node.js and npm (for React)
React 18.x

**2. Step-by-Step Installation and Setup:**

**Backend Setup:**

**Clone the repository:**

bash
Copy code
git clone (https://github.com/Kanagasundar/Meet_and_Chat.git)
cd Meet_and_Chat

**Set up a Python virtual environment and activate it:**
bash
Copy code
pipenv shell used virtual environment

**Install backend dependencies:**
bash
Copy code
pip install -r requirements.txt

**Apply migrations and create a superuser:**
bash
Copy code
python manage.py migrate
python manage.py createsuperuser

**Run the Django development server:**
bash
Copy code
python manage.py runserver

**Frontend Setup:**

**Navigate to the myapp directory (or where your React app is located):**
bash
Copy code
cd myapp

**Install frontend dependencies:**
bash
Copy code
npm install

**Start the React development server:**
bash
Copy code
npm start
but npm run build used in this project to start react server when django server started

**3. Running the Application:**

Ensure both the Django backend and React frontend servers are running.
Access the Django server at http://localhost:8000/.

Note: Corsheaders used in this project so starting Django server will also start React server(After npm run build)

**4. Additional Information:**

The frontend uses AuthContext.js for managing user authentication state.
Static files are served from the staticfiles directory.
For more details on the API endpoints, refer to the Django REST Framework documentation.

**Incomplete Aspects and Next Steps**
**Incomplete Aspects:**

Advanced security features and deployment settings are not implemented.
No comprehensive unit or integration tests are included.
UI/UX improvements and additional frontend features are pending.

**Repository Link:** (https://github.com/Kanagasundar/Meet_and_Chat)
