import React, { useState } from 'react'

const Context = React.createContext({})

export function UserContextProvider ({ children }) {
  const [jwt, setJwt] = useState(() => window.sessionStorage.getItem('jwt'))
  const [user, setUser] = useState(() => window.sessionStorage.getItem('user'))
  return (
    <Context.Provider value={{
      jwt, setJwt, user, setUser
    }}
    >
      {children}
    </Context.Provider>
  )
}

export default Context
