import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"
import { ToastProvider } from "./context/ToastContext"
import "./i18n"

// Role Dashboards
import { DoctorDashboard } from "./pages/doctor/DoctorDashboard"
import { NurseDashboard } from "./pages/nurse/NurseDashboard"
import { ReceptionistDashboard } from "./pages/receptionist/ReceptionistDashboard"

// Hospital layout & pages
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

// Lab layout & pages
import { LabLayout } from "./components/lab/LabLayout"
import { LabDashboard } from "./pages/lab/LabDashboard"
import { LabOrders } from "./pages/lab/LabOrders"
import { LabOrderDetail } from "./pages/lab/LabOrderDetail"
import { LabReports } from "./pages/lab/LabReports"
import { UploadReport } from "./pages/lab/UploadReport"
import { ReportView } from "./pages/lab/ReportView"
import { AddTest } from "./pages/lab/AddTest"
import { CreateOrder } from "./pages/lab/CreateOrder"
import { TestPackages } from "./pages/lab/TestPackages"
import { HomeCollection } from "./pages/lab/HomeCollection"
import { CreateHomeCollection } from "./pages/lab/CreateHomeCollection"
import { LabProfile } from "./pages/lab/LabProfile"
import { LabInfo } from "./pages/lab/LabInfo"
import { TestCatalog } from "./pages/lab/TestCatalog"
import { LabNotifications } from "./pages/lab/LabNotifications"

// Auth pages
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import './index.css'

import { type ReactNode } from "react"

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

/** Redirect root "/" based on role */
function RoleRedirect() {
  const { role } = useAuth()
  if (role === 'lab') return <Navigate to="/lab" replace />
  if (role === 'doctor') return <Navigate to="/doctor" replace />
  if (role === 'nurse') return <Navigate to="/nurse" replace />
  if (role === 'receptionist') return <Navigate to="/receptionist" replace />
  return <Navigate to="/dashboard" replace /> // admin
}

function AnimatedRoutes() {
  const location = useLocation()

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

        {/* Role-aware root redirect */}
        <Route path="/" element={<ProtectedRoute><RoleRedirect /></ProtectedRoute>} />

        {/* ── HOSPITAL ROUTES ─────────────────────────────── */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doctor" element={<DoctorDashboard />} />
          <Route path="/nurse" element={<NurseDashboard />} />
          <Route path="/receptionist" element={<ReceptionistDashboard />} />
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

        {/* ── LAB ROUTES ──────────────────────────────────── */}
        <Route element={<ProtectedRoute><LabLayout /></ProtectedRoute>}>
          <Route path="/lab" element={<LabDashboard />} />
          <Route path="/lab/orders" element={<LabOrders />} />
          <Route path="/lab/order/:id" element={<LabOrderDetail />} />
          <Route path="/lab/reports" element={<LabReports />} />
          <Route path="/lab/upload-report" element={<UploadReport />} />
          <Route path="/lab/report/:id" element={<ReportView />} />
          <Route path="/lab/add-test" element={<AddTest />} />
          <Route path="/lab/create-order" element={<CreateOrder />} />
          <Route path="/lab/add-package" element={<TestPackages />} />
          <Route path="/lab/packages" element={<TestPackages />} />
          <Route path="/lab/home-collection" element={<HomeCollection />} />
          <Route path="/lab/home-collection/create" element={<CreateHomeCollection />} />
          <Route path="/lab/profile" element={<LabProfile />} />
          <Route path="/lab/info" element={<LabInfo />} />
          <Route path="/lab/test-catalog" element={<TestCatalog />} />
          <Route path="/lab/notifications" element={<LabNotifications />} />
          <Route path="/lab/security" element={<Security />} />
          <Route path="/lab/settings" element={<Settings />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <AnimatedRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
