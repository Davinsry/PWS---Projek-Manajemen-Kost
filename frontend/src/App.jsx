import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Kamar from './pages/Kamar'
import Penyewa from './pages/Penyewa'
import Pembayaran from './pages/Pembayaran'
import Pengeluaran from './pages/Pengeluaran'
import Laporan from './pages/Laporan'
import LandingPage from './pages/LandingPage'
import EditTampilan from './pages/EditTampilan'
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<LandingPage />} />

      {/* Admin Login */}
      <Route path="/login" element={<Login />} />

      {/* Protected Admin Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Layout />}>
          {/* Redirect dashboard base path to actual dashboard if accessed directly inside layout */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="kamar" element={<Kamar />} />
          <Route path="penyewa" element={<Penyewa />} />
          <Route path="pembayaran" element={<Pembayaran />} />
          <Route path="pengeluaran" element={<Pengeluaran />} />
          <Route path="laporan" element={<Laporan />} />
          <Route path="tampilan" element={<EditTampilan />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
