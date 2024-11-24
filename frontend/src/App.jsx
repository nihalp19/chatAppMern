import Navbar from "./components/Navbar"
import {Routes,Route} from "react-router-dom"
function App() {

  return (
    <div className="">
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/signup" element={<SignUpPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/settings" element={<HomePage/>}/>
        <Route path="/" element={<HomePage/>}/>
      </Routes>
  </div>
  )
}

export default App
