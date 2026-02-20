import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('amenudo_admin') === 'true')

  function login() {
    localStorage.setItem('amenudo_admin', 'true')
    setIsAdmin(true)
  }

  function logout() {
    localStorage.removeItem('amenudo_admin')
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
