import React, { useState, useEffect } from 'react';
import api from '../api';
import { Users, LayoutDashboard, AlertCircle, TrendingUp } from 'lucide-react';
import { DEMO_MODE, DEMO_DASHBOARD_DATA } from '../demoConfig';

const StatCard = ({ title, value, icon: Icon, color, bg }) => (
    <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    }}>
        <div style={{
            padding: '12px',
            borderRadius: '10px',
            backgroundColor: bg,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Icon size={24} />
        </div>
        <div>
            <h3 style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 5px 0' }}>{title}</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0, color: '#1f2937' }}>{value}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_rooms: 0,
        occupied_rooms: 0,
        available_rooms: 0,
        monthly_income: 0,
        visitor_stats: { today_visits: 0, total_visits: 0 }
    });

    useEffect(() => {
        // Demo Mode: Use static data
        if (DEMO_MODE) {
            setStats({
                total_rooms: DEMO_DASHBOARD_DATA.totalKamar,
                occupied_rooms: DEMO_DASHBOARD_DATA.kamarTerisi,
                available_rooms: DEMO_DASHBOARD_DATA.kamarKosong,
                monthly_income: DEMO_DASHBOARD_DATA.pendapatanBulanIni,
                visitor_stats: { today_visits: 45, total_visits: DEMO_DASHBOARD_DATA.totalKunjungan }
            });
            return;
        }

        // Normal Mode: Fetch from API
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching dashboard stats", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>Dashboard Overview</h1>

            {/* Top Stats Row - GRID LAYOUT */}

            {stats.expiring_leases > 0 && (
                <div style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fca5a5',
                    color: '#991b1b',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <AlertCircle size={24} />
                    <p style={{ margin: 0, fontWeight: '500' }}>
                        Peringatan: Ada <strong>{stats.expiring_leases}</strong> kamar yang masa sewanya akan habis dalam 5 hari ke depan!
                    </p>
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)', // Force 4 columns
                gap: '20px',
                marginBottom: '20px'
            }}>
                <StatCard
                    title="Total Kamar"
                    value={stats.total_rooms || 0}
                    icon={LayoutDashboard}
                    color="#2563eb"
                    bg="#eff6ff"
                />
                <StatCard
                    title="Kamar Terisi"
                    value={stats.occupied_rooms || 0}
                    icon={Users}
                    color="#16a34a"
                    bg="#f0fdf4"
                />
                <StatCard
                    title="Sisa Kamar"
                    value={stats.available_rooms || 0}
                    icon={AlertCircle}
                    color="#ca8a04"
                    bg="#fef9c3"
                />
                <StatCard
                    title="Pendapatan Bulan Ini"
                    value={`Rp ${parseInt(stats.monthly_income || 0).toLocaleString('id-ID')}`}
                    icon={TrendingUp}
                    color="#9333ea"
                    bg="#faf5ff"
                />
            </div>

            {/* Bottom Section - GRID LAYOUT */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr', // Force 2 columns
                gap: '20px'
            }}>

                {/* Visitor Stats */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '15px' }}>Aktivitas Website</h2>
                    <div style={{ display: 'grid', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: '#f9fafb', borderRadius: '12px' }}>
                            <div>
                                <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Kunjungan Hari Ini</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{stats.visitor_stats?.today_visits || 0}</p>
                            </div>
                            <div style={{ padding: '10px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '50%' }}>
                                <Users size={20} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px', background: '#f9fafb', borderRadius: '12px' }}>
                            <div>
                                <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Total Kunjungan</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{stats.visitor_stats?.total_visits || 0}</p>
                            </div>
                            <div style={{ padding: '10px', background: '#dbeafe', color: '#2563eb', borderRadius: '50%' }}>
                                <TrendingUp size={20} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '15px' }}>Aktivitas Terbaru</h2>
                    <div style={{
                        background: '#f9fafb',
                        borderRadius: '12px',
                        padding: '30px',
                        textAlign: 'center',
                        color: '#6b7280',
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <p style={{ margin: 0 }}>Belum ada aktivitas tercatat hari ini.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
