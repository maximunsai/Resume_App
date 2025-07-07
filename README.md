# Resume_App

. Install Dependencies
Backend:

In your backend folder, run:

bash
npm init -y
npm install express cors body-parser openai dotenv
Frontend:

In your React app folder, run:

bash
npm install axios jspdf
4. Run the Application
Backend:

Start the backend server:

bash
node server.js
Frontend:

Start the React frontend:

bash
npm start
5. How to Use
Open your browser at http://localhost:3000.

Click Sign In (mock).

Select a resume template.

Fill in your personal, education, skills, and experience details.

Click Generate Summary to get an AI-powered summary.

Review/edit the summary if needed.

Click Download PDF to save your resume.

6. Customization & Next Steps
You can expand templates, add Word export, or connect to a real authentication system.

For production, secure your API keys and consider deploying the backend and frontend on platforms like Vercel, Netlify, or Heroku.
