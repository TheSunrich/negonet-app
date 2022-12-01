import { useState } from 'react'
import reactLogo from './assets/react.svg'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import NavBar from './components/NavBar';
import ContainerIndex from './components/ContainerIndex';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NavBar/>
      <ContainerIndex/>
    </>
  )
}

export default App

