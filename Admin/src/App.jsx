import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Components/Navbar/Navbar'
import Admin from './Pages/admin/Admin';



function App() {
  const [count, setCount] = useState(0)

  return (
    <div >
      <Navbar />
      <Admin />
    </div>
  )
}

export default App
