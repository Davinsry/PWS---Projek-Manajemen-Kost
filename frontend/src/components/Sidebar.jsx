import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BedDouble, Users, CreditCard, FileText, LogOut, Home, Wallet, Monitor } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Basic logout logic
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/kamar', label: 'Data Kamar', icon: BedDouble },
        { path: '/penyewa', label: 'Data Penyewa', icon: Users },
        { path: '/pembayaran', label: 'Pembayaran', icon: CreditCard },
        { path: '/pengeluaran', label: 'Pengeluaran', icon: Wallet },
        { path: '/laporan', label: 'Laporan', icon: FileText },
        { path: '/tampilan', label: 'Edit Tampilan', icon: Monitor }, // Using valid lucide-react icon
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon">
                    <Home size={24} />
                </div>
                <div className="logo-text">
                    <h1>Manajemen Kos</h1>
                    <p>Admin Panel</p>
                </div>
            </div>

            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={20} />
                    <span>Keluar</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
