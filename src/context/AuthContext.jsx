import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('amenudo_admin') === 'true')
  const [theme, setTheme] = useState(() => localStorage.getItem('amenudo_theme') ?? 'dark')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  function login() {
    localStorage.setItem('amenudo_admin', 'true')
    setIsAdmin(true)
  }

  function logout() {
    localStorage.removeItem('amenudo_admin')
    setIsAdmin(false)
  }

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('amenudo_theme', next)
    setTheme(next)
  }

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
