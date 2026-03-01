import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import DashboardPage from './dashborad/DasboradPage'
import Seesion from './session/Session'
import LiveSession from './livesSession/LiveSession'
import { SessionProvider } from './SessionContext'

function App() {
   return (
    <SessionProvider>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<DashboardPage/>}/>
      <Route path="/session" element={<Seesion/>}/>
      <Route path="/livesession"element={<LiveSession/>}/>
    </Routes>
    </BrowserRouter>
    </SessionProvider>
  )
}

export default App
