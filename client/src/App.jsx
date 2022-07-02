import './App.css'
import { Route, Routes, BrowserRouter, Outlet, Navigate } from 'react-router-dom'
import { useLocation } from 'react-router'

import Login from './pages/Login'
import Home from './pages/Home'
import Register from './pages/Register'

import useUser from './hooks/useUser'
import { UserContextProvider } from './context/UserContextProvider'

const PortectedRoutes = () => {
  const { isLogged } = useUser()
  const location = useLocation()
  return isLogged
    ? <Outlet />
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
