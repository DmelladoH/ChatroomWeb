import './App.css'
import { Route, Routes, BrowserRouter, Outlet, Navigate } from 'react-router-dom'
import { useLocation } from 'react-router'

import Login from './pages/Login'
import Chatroom from './pages/Chatroom'
import Home from './pages/Home'
import Register from './pages/Register'

import useUser from './hooks/useUser'
import { UserContextProvider } from './context/UserContextProvider'
import RoomsNav from './components/RoomsNav'
import TopNav from './components/TopNav'

const PortectedRoutes = () => {
  const { isLogged } = useUser()
  const location = useLocation()
  return isLogged
    ? (
      <>
        <TopNav />
        <RoomsNav />
        <Outlet />
      </>
      )
    : <Navigate to='/login' replace state={{ from: location }} />
}

function App () {
  return (
    <UserContextProvider>
      <div className='App'>
        <BrowserRouter>
          <Routes>
            <Route element={<PortectedRoutes />}>
              <Route path='/' element={<Home />} />
              <Route path='/:room' element={<Chatroom />} />
            </Route>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Routes>
        </BrowserRouter>
      </div>
    </UserContextProvider>
  )
}

export default App
