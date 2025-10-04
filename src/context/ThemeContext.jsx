// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        // Check localStorage first, then system preference
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) {
            return savedTheme
        }
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark'
        }
        return 'light'
    })

    useEffect(() => {
        const root = document.documentElement

        // Remove both classes first
        root.classList.remove('light', 'dark')

        // Add the current theme class
        root.classList.add(theme)

        // Set color scheme
        root.style.colorScheme = theme

        // Save to localStorage
        localStorage.setItem('theme', theme)

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]')
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#111827' : '#ffffff')
        }
    }, [theme])

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
    }

    const value = {
        theme,
        setTheme,
        toggleTheme,
        isDark: theme === 'dark'
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}