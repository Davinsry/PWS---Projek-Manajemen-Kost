import React, { useState, useEffect } from 'react';
import api from '../api';
import { Printer, Eye, Search } from 'lucide-react';

const Pembayaran = () => {
    const [payments, setPayments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPreview, setShowPreview] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const fetchPayments = async () => {
        try {
            const response = await api.get('/pembayaran');
            setPayments(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const filteredPayments = payments.filter(p =>
        (p.tenant_name && p.tenant_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.room_number && p.room_number.includes(searchTerm))
    );

    const handlePrint = () => {
        const printContent = document.getElementById('receipt-preview').innerHTML;
        const win = window.open('', '', 'height=600,width=800');
        win.document.write('<html><head><title>Cetak Kuitansi</title>');
        win.document.write('<style>body{font-family: sans-serif; padding: 20px;} .receipt-box{border: 2px solid #000; padding: 20px;} table{width: 100%;} td{padding: 5px;}</style>');
        win.document.write('</head><body>');
        win.document.write(printContent);
        win.document.write('</body></html>');
        win.document.close();
        win.print();
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Kuitansi & Riwayat Pembayaran</h1>
            </div>

            <div className="card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                    <input
                        type="text"
                        placeholder="Cari nama penyewa..."
                        className="form-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '2.5rem', width: '100%', boxSizing: 'border-box' }}
                    />
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                </div>
            </div>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                        <tr>
                            <th style={{ padding: '1rem' }}>No</th>
                            <th style={{ padding: '1rem' }}>Tanggal</th>
                            <th style={{ padding: '1rem' }}>Penyewa</th>
                            <th style={{ padding: '1rem' }}>Kamar</th>
                            <th style={{ padding: '1rem' }}>Nominal</th>
                            <th style={{ padding: '1rem' }}>Tipe</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.map((p, idx) => (
                            <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1rem' }}>{idx + 1}</td>
                                <td style={{ padding: '1rem' }}>{new Date(p.date).toLocaleDateString('id-ID')}</td>
                                <td style={{ padding: '1rem', fontWeight: '500' }}>{p.tenant_name || 'Umum/Eks'}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                                        {p.room_number || '-'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>Rp {parseInt(p.amount).toLocaleString('id-ID')}</td>
                                <td style={{ padding: '1rem' }}>{p.type}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        color: p.status === 'Lunas' ? '#16a34a' : '#ca8a04',
                                        fontWeight: '600',
                                        backgroundColor: p.status === 'Lunas' ? '#f0fdf4' : '#fefce8',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '1rem'
                                    }}>
                                        {p.status || 'Lunas'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button className="btn btn-primary" style={{ padding: '0.5rem', display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}
                                        onClick={() => {
                                            setSelectedPayment(p);
                                            setShowPreview(true);
                                        }}>
                                        <Eye size={16} /> Kuitansi
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Receipt Modal */}
            {showPreview && selectedPayment && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card" style={{ maxWidth: '600px', width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h3 style={{ fontWeight: 'bold' }}>Preview Kuitansi</h3>
                            <button onClick={() => setShowPreview(false)} style={{ background: 'none', border: 'none' }}>Tutup</button>
                        </div>

                        <div id="receipt-preview" style={{ border: '2px solid #000', padding: '2rem', marginBottom: '1rem', backgroundColor: 'white' }}>
                            <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid #000', paddingBottom: '1rem' }}>
                                <h2 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>KUITANSI PEMBAYARAN</h2>
                                <p style={{ margin: '0.5rem 0 0', fontSize: '0.875rem' }}>Manajemen Kost Eksklusif</p>
                            </div>
                            <table style={{ width: '100%' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ width: '150px' }}>Nama</td>
                                        <td>: <strong>{selectedPayment.tenant_name}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>Nomor Kamar</td>
                                        <td>: {selectedPayment.room_number || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td>Periode</td>
                                        <td>: {selectedPayment.checkin_date ? `${new Date(selectedPayment.checkin_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} - ${new Date(selectedPayment.checkout_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}` : '-'}</td>
                                    </tr>
                                    <tr>
                                        <td>Sejumlah</td>
                                        <td>: <strong>Rp {parseInt(selectedPayment.amount).toLocaleString('id-ID')}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>Metode</td>
                                        <td>: Transfer</td>
                                    </tr>
                                    <tr>
                                        <td>Status</td>
                                        <td style={{ textTransform: 'uppercase' }}>: {selectedPayment.status}</td>
                                    </tr>
                                </tbody>
                            </table>
                            {/* Removed "Terbilang" box per new format which includes "Sejumlah" inline */}

                            <div style={{ marginTop: '3rem', textAlign: 'left' }}>
                                <p style={{ margin: '0 0 0.5rem 0', fontStyle: 'italic' }}>Terimakasih atas pembayaran Anda,</p>
                                <p style={{ margin: 0 }}>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold' }}>PandawaX45 Jogja</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'end', gap: '1rem' }}>
                            <button className="btn btn-primary" onClick={handlePrint}>
                                <Printer size={20} style={{ marginRight: '0.5rem' }} /> Cetak / Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pembayaran;
