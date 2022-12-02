import { useState } from 'react'
import reactLogo from './assets/react.svg'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap-icons/font/bootstrap-icons';
import NavBar from './components/NavBar';
import ContainerIndex from './components/ContainerIndex';
import Login from './public/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Footer from './components/Footer';
import 'animate.css';
import Registro from './public/Registro';
import Loading from './components/Loading';
import MainPage from './private/MainPage';
function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path='/' element={<ContainerIndex />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Registro />} />
          <Route path='/loading' element={<Loading />} />
          <Route path='/main' element={<MainPage/>} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App

