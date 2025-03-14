


import { BrowserRouter,Routes,Route } from 'react-router-dom'
import HomePage from './Pages/Home'
import Body from "./components/Body"
import Layout from './components/Layout'

import Login from './Pages/Login'
import Register from './Pages/Register'
import Freelancer from './Pages/Freelancer'
import JobPoster from './Pages/JobPoster'
import EachJobApplication from './Pages/EachJobApplication'
import Profile from './Pages/Profile'
import FApplications from './Pages/FApplications'
import { Toaster } from 'sonner'


function App() {


  return (
  <>
 <Toaster position="bottom-center" richColors />
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/" element={<Body/>}>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
      </Route>
      <Route path="/" element={<Layout/>}>
<Route path="/freelancer" element={<Freelancer/>}/>
<Route path="/jobposter" element={<JobPoster/>}/>
<Route path="/freelancer/job/:jobId" element={<EachJobApplication/>}/>
<Route path="/profile" element={<Profile/>}/>
<Route path="/freelancer/applications" element={<FApplications/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
    </>

  )
}

export default App
