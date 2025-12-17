import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Trash, Search, Filter, Wallet } from 'lucide-react';

const Pengeluaran = () => {
    const [expenses, setExpenses] = useState([]);
    const [newExpense, setNewExpense] = useState({
        title: '',
        amount: '',
        category: 'Operasional',
        payment_method: 'Tunai'
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await api.get('/pengeluaran');
            setExpenses(response.data);
        } catch (error) {
            console.error("Error fetching expenses", error);
        }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        try {
            await api.post('/pengeluaran', newExpense);
            setIsModalOpen(false);
            setNewExpense({ title: '', amount: '', category: 'Operasional', payment_method: 'Tunai' });
            fetchExpenses();
        } catch (error) {
            console.error("Error adding expense", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Yakin ingin menghapus data ini?')) {
            try {
                await api.delete(`/pengeluaran/${id}`);
                fetchExpenses();
            } catch (error) {
                console.error("Error deleting expense", error);
            }
        }
    };

    const totalExpense = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Data Pengeluaran</h1>
                    <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>Catat arus kas keluar operasional kost</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '500'
                    }}
                >
                    <Plus size={20} />
                    Catat Pengeluaran
                </button>
            </div>

            {/* Stats Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '2rem' }}>
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    borderLeft: '4px solid #ef4444'
                }}>
                    <div style={{ padding: '12px', background: '#fef2f2', color: '#dc2626', borderRadius: '50%' }}>
                        <Wallet size={24} />
                    </div>
                    <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Total Pengeluaran (Semua)</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                            Rp {totalExpense.toLocaleString('id-ID')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Expense Table */}
            <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                    <div style={{ position: 'relative', maxWidth: '300px' }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={20} />
                        <input
                            type="text"
                            placeholder="Cari pengeluaran..."
                            style={{
                                width: '100%',
                                padding: '10px 10px 10px 40px',
                                border: '1px solid #d1d5db',
                                borderRadius: '8px',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>Tanggal</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>Keterangan</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>Kategori</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>Metode</th>
                            <th style={{ padding: '16px', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>Nominal</th>
                            <th style={{ padding: '16px', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.length > 0 ? expenses.map((item) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '16px', color: '#4b5563' }}>
                                    {new Date(item.date).toLocaleDateString('id-ID', {
                                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                    })}
                                </td>
                                <td style={{ padding: '16px', fontWeight: '500', color: '#1f2937' }}>{item.title}</td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{ padding: '4px 10px', background: '#f3f4f6', color: '#4b5563', borderRadius: '999px', fontSize: '0.75rem' }}>
                                        {item.category}
                                    </span>
                                </td>
                                <td style={{ padding: '16px', color: '#4b5563' }}>{item.payment_method}</td>
                                <td style={{ padding: '16px', textAlign: 'right', fontWeight: '600', color: '#dc2626' }}>
                                    - Rp {Number(item.amount).toLocaleString('id-ID')}
                                </td>
                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '6px' }}
                                    >
                                        <Trash size={18} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#6b7280' }}>
                                    Belum ada data pengeluaran.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        width: '100%',
                        maxWidth: '450px',
                        padding: '24px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>Catat Pengeluaran Baru</h2>
                        <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Keterangan</label>
                                <input
                                    required
                                    type="text"
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                    placeholder="Contoh: Bayar Listrik Bulan Ini"
                                    value={newExpense.title}
                                    onChange={e => setNewExpense({ ...newExpense, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Nominal (Rp)</label>
                                <input
                                    required
                                    type="number"
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                    placeholder="0"
                                    value={newExpense.amount}
                                    onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Kategori</label>
                                    <select
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                        value={newExpense.category}
                                        onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
                                    >
                                        <option>Operasional</option>
                                        <option>Perbaikan/Maintenance</option>
                                        <option>Gaji Karyawan</option>
                                        <option>Pajak/Iuran</option>
                                        <option>Lainnya</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Metode Bayar</label>
                                    <select
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d1d5db' }}
                                        value={newExpense.payment_method}
                                        onChange={e => setNewExpense({ ...newExpense, payment_method: e.target.value })}
                                    >
                                        <option>Tunai</option>
                                        <option>Transfer Bank</option>
                                        <option>E-Wallet</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    style={{ padding: '10px 20px', borderRadius: '8px', background: '#f3f4f6', color: '#4b5563', border: 'none', cursor: 'pointer' }}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '10px 20px', borderRadius: '8px', background: '#2563eb', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '500' }}
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Pengeluaran;
