Frontend Documentation for FreelanceHub
Project Overview
This is a React-based frontend for FreelanceHub, featuring:

AI-powered job matching for freelancers.
Dashboard for job posters to manage job details, active jobs, and completed projects.
Common pages for login, registration, and user profiles.
Dedicated views for detailed job applications and freelancer bids.
Tech Stack
React 19 (Component-based UI)
React Router (Routing management)
Redux Toolkit (State management)
Tailwind CSS (Styling framework)
Sonner (Notification system)
Vite (Build tool)
TensorFlow.js (AI-powered features)
Axios (API requests)
Folder Structure
css
Copy
Edit
/src
 ├── /components
 │   ├── Body.jsx
 │   ├── Layout.jsx
 ├── /Pages
 │   ├── Home.jsx
 │   ├── Login.jsx
 │   ├── Register.jsx
 │   ├── Freelancer.jsx
 │   ├── JobPoster.jsx
 │   ├── EachJobApplication.jsx
 │   ├── EachJobAdmin.jsx
 │   ├── Profile.jsx
 │   ├── FApplications.jsx
 │   ├── NotFound.jsx
 ├── App.js
 ├── main.jsx
 ├── index.css
Routing Overview
The App.js file defines the routing structure.

/ — Home Page (Overview of website functionality)
/login — Login Page
/register — Registration Page
/freelancer — Freelancer Dashboard with AI-powered job matching
/jobposter — Job Poster Dashboard (active/completed jobs, expenses)
/jobs/:jobId — Admin view for job management
/freelancer/job/:jobId — Freelancer's view for bidding and detailed job applications
/profile — Common profile page for both users
/freelancer/applications — Freelancer's view of submitted job bids
* — Not Found Page (Fallback for undefined routes)
Key Features
1. Home Page
Introduces the platform with details on how it works.
2. Login/Register
Common login and registration forms for both Freelancers and Job Posters.
3. Freelancer Dashboard
Displays AI-powered job recommendations based on the user's skills.
4. Job Poster Dashboard
Displays:
Total active jobs
Completed jobs
Money spent
List of all jobs with View, Edit, Close, Accept, and Mark as Confirmed options.
5. Job Application View
Provides a detailed view of each job application with bid details.
6. Profile Page
Displays user details such as skills, bio, and profile picture.
7. Freelancer Applications
Lists all the bids placed by the freelancer for various job posts.
Scripts
npm run dev — Start development server
npm run build — Build for production
npm run preview — Preview the production build
npm run lint — Run ESLint for code quality checks
Dependencies Overview
Core Libraries
React 19 — Core framework
React Router 7.3.0 — Routing management
Redux Toolkit — State management for global data flow
UI Libraries
Radix UI — Accessible and customizable components
Lucide React — Icon library
Sonner — Toast notifications
Tailwind CSS — Utility-first CSS framework
AI Integration
TensorFlow.js — For implementing AI-powered job matching.
