import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import TasksPage from './pages/TasksPage'
import Team from './pages/Team'
import Settings from './pages/Settings'

function App() {
    return (
        <ThemeProvider>
            <AppProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route element={<Layout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/projects/:id" element={<ProjectDetail />} />
                            <Route path="/tasks" element={<TasksPage />} />
                            <Route path="/team" element={<Team />} />
                            <Route path="/settings" element={<Settings />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </AppProvider>
        </ThemeProvider>
    )
}

export default App