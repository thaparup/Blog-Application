
// import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import About from './assets/pages/About'
import Dashboard from './assets/pages/Dashboard'
import Projects from './assets/pages/Projects'
import SignIn from './assets/pages/SignIn'
import Home from './assets/pages/Home'
import SignUp from './assets/pages/SignUp'
import Header from './components/Header'
import Footer from './components/Footer'

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
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/projects' element={<Projects />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
