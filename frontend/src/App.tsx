import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import { ToastProvider } from "./context/ToastContext"
import "./i18n"
import { AppLayout } from "./components/layout/AppLayout"
import { Dashboard } from "./pages/Dashboard"
import { Appointments } from "./pages/Appointments"
import { Payouts } from "./pages/Payouts"
import { Patients } from "./pages/Patients"
import { Profile } from "./pages/Profile"
import { AddDepartment } from "./pages/AddDepartment"
import { AddDoctor } from "./pages/AddDoctor"
import { AddLab } from "./pages/AddLab"
import { AddNurse } from "./pages/AddNurse"
import { AddReceptionist } from "./pages/AddReceptionist"
import { PatientDetail } from "./pages/PatientDetail"
import { Settings } from "./pages/Settings"
import { Notifications } from "./pages/Notifications"
import { Security } from "./pages/Security"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import './index.css'

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth Routes */}
        <Route path="/login" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Login />
          </motion.div>
        } />
        <Route path="/register" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Register />
          </motion.div>
        } />

        {/* Protected App Routes */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/payouts" element={<Payouts />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/security" element={<Security />} />
          
          <Route path="/add-department" element={<AddDepartment />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          <Route path="/add-lab" element={<AddLab />} />
          <Route path="/add-nurse" element={<AddNurse />} />
          <Route path="/add-receptionist" element={<AddReceptionist />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
