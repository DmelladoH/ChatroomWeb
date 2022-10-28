import './App.css'
import { Route, Routes, BrowserRouter, Outlet, Navigate } from 'react-router-dom'
import { useLocation } from 'react-router'

import Login from './pages/Login'
import Chatroom from './pages/Chatroom'
import Home from './pages/Home'
import Register from './pages/Register'

import useLogin from './hooks/useLogin'
import { UserContextProvider } from './context/UserContextProvider'
import RoomsNav from './components/RoomsNav'
import TopNav from './components/TopNav'

const PortectedRoutes = () => {
  const { isLogged } = useLogin()
  const location = useLocation()
  return isLogged
    ? (
      <>
        <TopNav />
        <div style={{ display: 'flex' }}>
          <RoomsNav />
          <div style={{ width: '100%' }}>
            <Outlet />
          </div>
        </div>
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
