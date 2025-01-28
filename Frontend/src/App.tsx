
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
import PrivateRoute from './components/PrivateRoute'
import Try from './assets/pages/Try'

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
          <Route element={<PrivateRoute />} >
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/try' element={<Try />} />
          </Route>
          <Route path='/projects' element={<Projects />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App
