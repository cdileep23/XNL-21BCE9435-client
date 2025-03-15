# FreelanceHub Frontend
Deployed Link: https://freelance-hub-client-six.vercel.app/

A modern React-based platform that connects freelancers with job posters, featuring AI-powered job matching and comprehensive project management tools.

## 🚀 Features

- **AI-Powered Job Matching**: Intelligent recommendations for freelancers based on their skills
- **Comprehensive Dashboards**: Dedicated views for both freelancers and job posters
- **Project Management**: Track active jobs, completed projects, and expenses
- **Bidding System**: Transparent application process for freelancers
- **User Profiles**: Customizable profiles with skills, bio, and portfolio

## 🛠️ Tech Stack

- **Frontend**: React 19
- **Routing**: React Router 7.3.0
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Build Tool**: Vite
- **AI Integration**: TensorFlow.js
- **API Communication**: Axios

## 📁 Project Structure

```
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
```

## 🔄 Routing

| Path | Description |
|------|-------------|
| `/` | Home page with platform overview |
| `/login` | Login page for all users |
| `/register` | Registration page for all users |
| `/freelancer` | Freelancer dashboard with AI job matching |
| `/jobposter` | Job poster dashboard for managing jobs |
| `/jobs/:jobId` | Admin view for detailed job management |
| `/freelancer/job/:jobId` | Freelancer's job application view |
| `/profile` | User profile page |
| `/freelancer/applications` | Freelancer's submitted job bids |
| `*` | 404 Not Found page |

## 🧠 AI-Powered Features

FreelanceHub incorporates TensorFlow.js to provide intelligent job matching for freelancers based on:
- Skill compatibility
- Previous work history
- Job requirements
- Success patterns

## 💻 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/cdileep23/freelanceHubClient

# Navigate to project directory
cd freelancehub-frontend

# Install dependencies
npm install
```

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 📱 Key Features

### For Freelancers
- AI-powered job recommendations
- Comprehensive job search
- Bidding system for job applications
- Application tracking
- Profile customization

### For Job Posters
- Job posting and management
- Application review system
- Freelancer selection tools
- Project tracking
- Expense monitoring



- [XNL Innovations](https://github.com/xnl-innovations)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [TensorFlow.js](https://www.tensorflow.org/js)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
