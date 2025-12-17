import React, { useState, useEffect } from 'react';
import api from '../api';
import { Search, UserX, Phone, Calendar, CreditCard } from 'lucide-react';

const Penyewa = () => {
    // Mock Data
    const [tenants, setTenants] = useState([]);

    const fetchTenants = async () => {
        try {
            const response = await api.get('/penyewa');
            setTenants(response.data);
        } catch (error) {
            console.error("Error fetching tenants", error);
        }
    };

    useEffect(() => {
        fetchTenants();
    }, []);

    const [searchTerm, setSearchTerm] = useState('');

    const activeTenants = tenants.filter(t => t.status === 'Aktif' && (t.name.toLowerCase().includes(searchTerm.toLowerCase()) || (t.room_number && t.room_number.includes(searchTerm))));
    const historyTenants = tenants.filter(t => t.status !== 'Aktif' && (t.name.toLowerCase().includes(searchTerm.toLowerCase()) || (t.room_number && t.room_number.includes(searchTerm))));

    const TableRow = ({ tenant, isActive }) => (
        <tr key={tenant.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
            <td style={{ padding: '1rem', fontWeight: '500' }}>{tenant.name}</td>
            <td style={{ padding: '1rem' }}>
                <span style={{
                    backgroundColor: '#eff6ff', color: '#2563eb',
                    padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontWeight: '500'
                }}>
                    {tenant.room_number || '-'}
                </span>
            </td>
            <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>{tenant.job}</td>
            <td style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Phone size={14} /> {tenant.phone}
                </div>
            </td>
            <td style={{ padding: '1rem' }}>{new Date(tenant.checkin_date).toLocaleDateString('id-ID')}</td>
            <td style={{ padding: '1rem' }}>
                <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    backgroundColor: isActive ? '#f0fdf4' : '#f3f4f6',
                    color: isActive ? '#16a34a' : '#6b7280'
                }}>
                    {tenant.status}
                </span>
            </td>
        </tr>
    );

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Data Penyewa</h1>
            </div>

            <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            type="text"
                            className="form-input"
                            style={{ width: '100%', paddingLeft: '40px', boxSizing: 'border-box' }}
                            placeholder="Cari nama penyewa atau nomor kamar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#16a34a' }}>Penyewa Aktif</h2>
            <div className="card" style={{ overflowX: 'auto', marginBottom: '2rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                        <tr>
                            <th style={{ padding: '1rem' }}>Nama</th>
                            <th style={{ padding: '1rem' }}>Kamar</th>
                            <th style={{ padding: '1rem' }}>Pekerjaan</th>
                            <th style={{ padding: '1rem' }}>Kontak</th>
                            <th style={{ padding: '1rem' }}>Tgl Masuk</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeTenants.length > 0 ? activeTenants.map(t => <TableRow key={t.id} tenant={t} isActive={true} />) : (
                            <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Tidak ada penyewa aktif</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#6b7280' }}>Riwayat Penyewa (Checkout)</h2>
            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                        <tr>
                            <th style={{ padding: '1rem' }}>Nama</th>
                            <th style={{ padding: '1rem' }}>Kamar Terakhir</th>
                            <th style={{ padding: '1rem' }}>Pekerjaan</th>
                            <th style={{ padding: '1rem' }}>Kontak</th>
                            <th style={{ padding: '1rem' }}>Tgl Masuk</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {historyTenants.length > 0 ? historyTenants.map(t => <TableRow key={t.id} tenant={t} isActive={false} />) : (
                            <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Belum ada riwayat</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Penyewa;
