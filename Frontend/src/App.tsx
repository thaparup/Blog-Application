
// import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import About from '../src/pages/About'
import Dashboard from '../src/pages/Dashboard'
import Projects from '../src/pages/Projects'
import SignIn from '../src/pages/SignIn'
import Home from '../src/pages/Home'
import SignUp from '../src/pages/SignUp'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import CreatePost from '../src/pages/CreatePost'
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute'

function App() {


  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route element={<OnlyAdminPrivateRoute />}>
            <Route path='/create-post' element={<CreatePost />} />
          </Route>

          <Route element={<PrivateRoute />} >
            <Route path='/dashboard' element={<Dashboard />} />
          </Route>
          <Route path='/projects' element={<Projects />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
