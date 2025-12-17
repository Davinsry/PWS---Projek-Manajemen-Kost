import React, { useState, useEffect } from 'react';
import api from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Calendar, Wallet } from 'lucide-react';

// Data will be fetched
// const data = ...

const StatCard = ({ title, value, sub, icon: Icon, color, bg }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
        <div style={{
            padding: '1rem',
            borderRadius: '0.75rem',
            backgroundColor: bg,
            color: color,
            display: 'flex'
        }}>
            <Icon size={24} />
        </div>
        <div>
            <h3 style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>{title}</h3>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{value}</p>
            <p style={{ fontSize: '0.75rem', color: color, marginTop: '0.25rem', fontWeight: 500 }}>{sub}</p>
        </div>
    </div>
);

const Laporan = () => {
    const [chartData, setChartData] = useState([]);
    const [summary, setSummary] = useState({ totalIncl: 0, totalExp: 0 });
    const [dashboardStats, setDashboardStats] = useState({ totalKamar: 0, kamarTerisi: 0, sisaKamar: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch payment report for chart
                const response = await api.get('/pembayaran/laporan');
                setChartData(response.data);

                const totalIncl = response.data.reduce((acc, curr) => acc + (Number(curr.Pendapatan) || 0), 0);
                const totalExp = response.data.reduce((acc, curr) => acc + (Number(curr.Pengeluaran) || 0), 0);

                setSummary({ totalIncl, totalExp });

                // Fetch dashboard stats for occupancy
                const dashboardResponse = await api.get('/dashboard/stats');
                setDashboardStats(dashboardResponse.data);
            } catch (error) { console.error(error); }
        };
        fetchData();
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Laporan Keuangan</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select className="form-input" style={{ backgroundColor: 'white' }}>
                        <option>Tahun 2025</option>
                        <option>Tahun 2024</option>
                    </select>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                <StatCard
                    title="Total Pendapatan (YTD)"
                    value={`Rp ${summary.totalIncl.toLocaleString('id-ID')}`}
                    sub="Pemasukan dari Sewa"
                    icon={TrendingUp}
                    color="#16a34a"
                    bg="#f0fdf4"
                />
                <StatCard
                    title="Total Pengeluaran (YTD)"
                    value={`Rp ${summary.totalExp.toLocaleString('id-ID')}`}
                    sub="Biaya Operasional"
                    icon={Wallet}
                    color="#ef4444"
                    bg="#fef2f2"
                />
                <StatCard
                    title="Keuntungan Bersih"
                    value={`Rp ${(summary.totalIncl - summary.totalExp).toLocaleString('id-ID')}`}
                    sub="Cash Flow Bersih"
                    icon={Users} // Could be better icon
                    color="#2563eb"
                    bg="#eff6ff"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <div className="card">
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Grafik Pendapatan & Pengeluaran</h3>
                    <div style={{ width: '100%', height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                width={500}
                                height={300}
                                data={chartData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend />
                                <Bar dataKey="Pendapatan" fill="#2563eb" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Laporan;
