import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Trash2, Edit, UserPlus, Check, X } from 'lucide-react';

const Kamar = () => {
    const [rooms, setRooms] = useState([]);

    const fetchRooms = async () => {
        try {
            const response = await api.get('/kamar');
            setRooms(response.data);
        } catch (error) {
            console.error("Error fetching rooms", error);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const [items, setItems] = useState([]); // Placeholder for tenants if needed here, but usually managed separately

    const [showAddRoom, setShowAddRoom] = useState(false);
    const [showAddTenant, setShowAddTenant] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Form States
    // Helper for formatting number input
    const formatNumber = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const parseNumber = (str) => str.replace(/\./g, "");

    const [newRoom, setNewRoom] = useState({ number: '', facility: '', price_month: '', price_week: '', price_day: '', status: 'Kosong' });
    const [newTenant, setNewTenant] = useState({ name: '', job: '', phone: '', checkin: '', checkout: '', payment: '', paymentStatus: 'Lunas' });

    const handleSaveRoom = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.put(`/kamar/${selectedRoomId}`, newRoom);
            } else {
                await api.post('/kamar', newRoom);
            }
            fetchRooms();
            setNewRoom({ number: '', facility: '', price_month: '', price_week: '', price_day: '', status: 'Kosong' });
            setShowAddRoom(false);
            setIsEditing(false);
        } catch (error) {
            alert('Gagal menyimpaan data kamar');
        }
    };

    const handleEditRoom = (room) => {
        setNewRoom({
            number: room.number,
            facility: room.facility,
            price_month: room.price_month,
            price_week: room.price_week,
            price_day: room.price_day,
            status: room.status // Preserve status
        });
        setSelectedRoomId(room.id);
        setIsEditing(true);
        setShowAddRoom(true);
    };

    const handleOpenAddTenant = (roomId) => {
        setSelectedRoomId(roomId);
        setIsEditingTenant(false); // Reset editing state
        setSelectedTenantId(null);
        setNewTenant({ name: '', job: '', phone: '', checkin: '', checkout: '', payment: '', paymentStatus: 'Lunas' });
        setShowAddTenant(true);
    };

    const [selectedTenantId, setSelectedTenantId] = useState(null);
    const [isEditingTenant, setIsEditingTenant] = useState(false);

    const handleEditTenant = async (room, e) => {
        if (e) e.stopPropagation();
        try {
            let tenant;

            // Try by tenant_id first, fallback to room_id
            if (room.tenant_id) {
                const response = await api.get(`/penyewa/${room.tenant_id}`);
                tenant = response.data;
            } else {
                // Fallback: fetch by room_id
                const response = await api.get(`/penyewa/byroom/${room.id}`);
                tenant = response.data;
            }

            if (tenant) {
                // Use payment_amount directly from tenant table
                const paymentAmount = tenant.payment_amount ? String(tenant.payment_amount) : '0';

                setNewTenant({
                    name: tenant.name,
                    job: tenant.job,
                    phone: tenant.phone,
                    checkin: tenant.checkin_date ? tenant.checkin_date.split('T')[0] : '',
                    checkout: tenant.checkout_date ? tenant.checkout_date.split('T')[0] : '',
                    payment: paymentAmount,
                    paymentStatus: tenant.payment_status || 'Lunas'
                });
                setSelectedTenantId(tenant.id);
                setSelectedRoomId(room.id);
                setIsEditingTenant(true);
                setShowAddTenant(true);
            } else {
                alert('Data penyewa tidak ditemukan.');
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 404) {
                alert('Data penyewa tidak ditemukan di database.');
            } else {
                alert('Gagal mengambil data penyewa: ' + err.message);
            }
        }
    };

    const handleSaveTenant = async (e) => {
        e.preventDefault();
        try {
            if (isEditingTenant) {
                await api.put(`/penyewa/${selectedTenantId}`, {
                    ...newTenant,
                    checkin_date: newTenant.checkin,
                    checkout_date: newTenant.checkout,
                    payment_status: newTenant.paymentStatus
                });
                alert('Data penyewa diperbarui!');
            } else {
                const tenantData = {
                    ...newTenant,
                    room_id: selectedRoomId,
                    payment_amount: newTenant.payment,
                    checkin_date: newTenant.checkin,
                    checkout_date: newTenant.checkout,
                    payment_status: newTenant.paymentStatus
                };
                const tenantResponse = await api.post('/penyewa', tenantData);
                const newTenantId = tenantResponse.data.id;

                // First Payment Record
                await api.post('/pembayaran', {
                    tenant_id: newTenantId,
                    amount: newTenant.payment,
                    date: newTenant.checkin,
                    type: 'Pembayaran Awal',
                    status: newTenant.paymentStatus
                });
                alert(`Penyewa ${newTenant.name} berhasil ditambahkan!`);
            }

            fetchRooms();
            setShowAddTenant(false);
            setNewTenant({ name: '', job: '', phone: '', checkin: '', checkout: '', payment: '', paymentStatus: 'Lunas' });
            setIsEditingTenant(false);
        } catch (error) {
            console.error(error);
            alert('Gagal menyimpan penyewa');
        }
    };

    const handleCheckout = async (tenantId, roomId) => {
        if (window.confirm('Checkout penyewa ini?')) {
            try {
                await api.put(`/penyewa/${tenantId}/checkout`);
                fetchRooms();
                alert('Checkout berhasil!');
            } catch (error) {
                console.error(error);
                alert('Gagal checkout penyewa');
            }
        }
    };

    const handleDeleteRoom = async (room) => {
        if (room.status === 'Isi' || room.status === 'DP') {
            alert('Gagal: Kamar masih ada penyewa. Silakan checkout terlebih dahulu.');
            return;
        }
        if (window.confirm('Hapus kamar ini?')) {
            try {
                await api.delete(`/kamar/${room.id}`);
                fetchRooms();
            } catch (error) {
                alert('Gagal menghapus kamar');
            }
        }
    };

    // Extend States
    const [showExtendModal, setShowExtendModal] = useState(false);
    const [extendData, setExtendData] = useState({ tenant_id: null, checkout_date: '', payment_amount: '' });

    const handleOpenExtend = (room) => {
        setExtendData({
            tenant_id: room.tenant_id,
            checkout_date: room.tenant_checkout ? room.tenant_checkout.split('T')[0] : '',
            payment_amount: ''
        });
        setShowExtendModal(true);
    };

    const handleExtendSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/penyewa/${extendData.tenant_id}/extend`, {
                checkout_date: extendData.checkout_date,
                payment_amount: extendData.payment_amount
            });
            alert('Perpanjangan sewa berhasil!');
            setShowExtendModal(false);
            fetchRooms();
        } catch (error) {
            console.error(error);
            alert('Gagal memperpanjang sewa');
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Manajemen Kamar</h1>
                <button
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    onClick={() => {
                        setNewRoom({ number: '', facility: '', price_month: '', price_week: '', price_day: '', status: 'Kosong' });
                        setIsEditing(false);
                        setShowAddRoom(true);
                    }}
                >
                    <Plus size={20} /> Tambah Kamar
                </button>
            </div>

            {/* Room List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {rooms.map((room) => (
                    <div key={room.id} className="card" style={{ position: 'relative', borderLeft: `4px solid ${(room.status === 'Isi' || room.status === 'DP') ? (room.status === 'DP' ? '#ca8a04' : '#ef4444') : '#22c55e'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Kamar {room.number}</h3>
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '1rem',
                                    backgroundColor: (room.status === 'Isi' || room.status === 'DP') ? (room.status === 'DP' ? '#fef9c3' : '#fee2e2') : '#dcfce7',
                                    color: (room.status === 'Isi' || room.status === 'DP') ? (room.status === 'DP' ? '#ca8a04' : '#b91c1c') : '#15803d',
                                    fontWeight: '600'
                                }}>
                                    {(room.status === 'Isi' || room.status === 'DP') ? (room.status === 'DP' ? 'DP' : 'Isi') : 'Kosong'}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn" style={{ padding: '0.25rem', color: 'var(--color-primary)' }} title="Edit" onClick={() => handleEditRoom(room)}><Edit size={18} /></button>
                                <button className="btn" style={{ padding: '0.25rem', color: '#ef4444' }} onClick={() => handleDeleteRoom(room)} title="Hapus"><Trash2 size={18} /></button>
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                            {room.facility}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                            <div>
                                <span style={{ color: 'var(--color-text-muted)' }}>Bulanan:</span>
                                <div style={{ fontWeight: '600' }}>Rp {parseFloat(room.price_month).toLocaleString('id-ID')}</div>
                            </div>
                            <div>
                                <span style={{ color: 'var(--color-text-muted)' }}>Mingguan:</span>
                                <div style={{ fontWeight: '600' }}>Rp {parseFloat(room.price_week).toLocaleString('id-ID')}</div>
                            </div>
                            <div>
                                <span style={{ color: 'var(--color-text-muted)' }}>Harian:</span>
                                <div style={{ fontWeight: '600' }}>Rp {parseFloat(room.price_day).toLocaleString('id-ID')}</div>
                            </div>
                        </div>

                        {/* Tenant Info */}
                        {(room.status === 'Isi' || room.status === 'DP') && (
                            <div style={{ backgroundColor: '#f0f9ff', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', border: '1px solid #bae6fd' }}>
                                <div style={{ fontSize: '0.75rem', color: '#0ea5e9', fontWeight: '600', marginBottom: '0.25rem' }}>PENYEWA</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{room.tenant_name}</span>
                                        <button className="btn" style={{ padding: '0.1rem', color: 'var(--color-primary)' }} onClick={(e) => handleEditTenant(room, e)} title="Edit Penyewa"><Edit size={14} /></button>
                                    </div>
                                </div>

                                {/* Lease Expiry Badge */}
                                {room.tenant_checkout && (
                                    <div style={{ marginBottom: '0.5rem' }}>
                                        {(() => {
                                            const diffTime = new Date(room.tenant_checkout) - new Date();
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                            let badgeColor = '#15803d'; // Green
                                            let badgeBg = '#dcfce7';
                                            let label = `${diffDays} Hari Lagi`;

                                            let showExtend = false;

                                            if (diffDays <= 5) {
                                                badgeColor = '#b91c1c'; // Red
                                                badgeBg = '#fee2e2';
                                                label = `⚠️ Sisa ${diffDays} Hari`;
                                                showExtend = true;
                                            } else if (diffDays >= 6 && diffDays <= 10) {
                                                badgeColor = '#ca8a04'; // Yellow/Orange
                                                badgeBg = '#fef9c3';
                                            }

                                            return (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{
                                                        fontSize: '0.75rem',
                                                        padding: '2px 8px',
                                                        borderRadius: '12px',
                                                        backgroundColor: badgeBg,
                                                        color: badgeColor,
                                                        fontWeight: '600',
                                                        display: 'inline-block'
                                                    }}>
                                                        {label}
                                                    </span>

                                                    {showExtend && (
                                                        <button
                                                            style={{
                                                                fontSize: '0.75rem',
                                                                padding: '4px 8px',
                                                                backgroundColor: '#2563eb',
                                                                color: 'white',
                                                                borderRadius: '4px',
                                                                border: 'none',
                                                                cursor: 'pointer'
                                                            }}
                                                            onClick={() => handleOpenExtend(room)}
                                                        >
                                                            Perpanjang
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button
                                        className="btn"
                                        style={{ fontSize: '0.75rem', color: '#ef4444', border: '1px solid #ef4444', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}
                                        onClick={() => handleCheckout(room.tenant_id, room.id)}
                                    >
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        )}

                        {room.status === 'Kosong' && (
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                onClick={() => handleOpenAddTenant(room.id)}
                            >
                                <UserPlus size={18} /> Tambah Penyewa
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Add Room Modal */}
            {showAddRoom && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{isEditing ? 'Edit Kamar' : 'Tambah Kamar Baru'}</h2>
                            <button onClick={() => setShowAddRoom(false)} style={{ background: 'none', border: 'none', padding: 0 }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSaveRoom}>
                            <div className="input-group">
                                <label className="input-label">Nomor Kamar</label>
                                <input required type="text" className="form-input" value={newRoom.number} onChange={e => setNewRoom({ ...newRoom, number: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Fasilitas</label>
                                <input required type="text" className="form-input" value={newRoom.facility} onChange={e => setNewRoom({ ...newRoom, facility: e.target.value })} placeholder="AC, WiFi, dll" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="input-group">
                                    <label className="input-label">Harga Bulanan</label>
                                    <input required type="text" className="form-input"
                                        value={formatNumber(newRoom.price_month)}
                                        onChange={e => setNewRoom({ ...newRoom, price_month: parseNumber(e.target.value) })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Harga Mingguan</label>
                                    <input required type="text" className="form-input"
                                        value={formatNumber(newRoom.price_week)}
                                        onChange={e => setNewRoom({ ...newRoom, price_week: parseNumber(e.target.value) })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Harga Harian</label>
                                    <input required type="text" className="form-input"
                                        value={formatNumber(newRoom.price_day)}
                                        onChange={e => setNewRoom({ ...newRoom, price_day: parseNumber(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn" style={{ flex: 1, border: '1px solid var(--border-color)' }} onClick={() => setShowAddRoom(false)}>Batal</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Tenant Modal */}
            {showAddTenant && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{isEditingTenant ? 'Edit Data Penyewa' : 'Registrasi Penyewa'}</h2>
                            <button onClick={() => setShowAddTenant(false)} style={{ background: 'none', border: 'none', padding: 0 }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSaveTenant}>
                            <div className="input-group">
                                <label className="input-label">Nama Lengkap</label>
                                <input required type="text" className="form-input" value={newTenant.name} onChange={e => setNewTenant({ ...newTenant, name: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Pekerjaan</label>
                                <input required type="text" className="form-input" value={newTenant.job} onChange={e => setNewTenant({ ...newTenant, job: e.target.value })} />
                            </div>
                            <div className="input-group">
                                <label className="input-label">No. Telepon</label>
                                <input required type="tel" className="form-input" value={newTenant.phone} onChange={e => setNewTenant({ ...newTenant, phone: e.target.value })} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="input-group">
                                    <label className="input-label">Check In</label>
                                    <input required type="date" className="form-input" value={newTenant.checkin} onChange={e => setNewTenant({ ...newTenant, checkin: e.target.value })} />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Check Out</label>
                                    <input required type="date" className="form-input" value={newTenant.checkout} onChange={e => setNewTenant({ ...newTenant, checkout: e.target.value })} />
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Jumlah Bayar {isEditingTenant && '(Tidak dapat diubah)'}</label>
                                <input required={!isEditingTenant} disabled={isEditingTenant} type="text" className="form-input"
                                    value={formatNumber(newTenant.payment)}
                                    onChange={e => setNewTenant({ ...newTenant, payment: parseNumber(e.target.value) })}
                                />
                            </div>

                            {/* Only show payment status selector if editing and status is DP */}
                            {isEditingTenant && newTenant.paymentStatus === 'DP' && (
                                <div className="input-group">
                                    <label className="input-label">Status Pembayaran (Tidak dapat diubah)</label>
                                    <select className="form-input" value={newTenant.paymentStatus} disabled style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}>
                                        <option value="DP">DP</option>
                                    </select>
                                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                        Gunakan tombol "Proses Pelunasan" di bawah untuk mengubah status ke Lunas
                                    </p>
                                </div>
                            )}

                            {/* Show payment status selector when adding new tenant */}
                            {!isEditingTenant && (
                                <div className="input-group">
                                    <label className="input-label">Status Pembayaran</label>
                                    <select className="form-input" value={newTenant.paymentStatus} onChange={e => setNewTenant({ ...newTenant, paymentStatus: e.target.value })}>
                                        <option value="Lunas">Lunas</option>
                                        <option value="DP">DP</option>
                                    </select>
                                </div>
                            )}

                            {/* Show payment completion option if editing and status is DP */}
                            {isEditingTenant && newTenant.paymentStatus === 'DP' && (
                                <div style={{ backgroundColor: '#fef9c3', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #ca8a04' }}>
                                    <div style={{ color: '#ca8a04', fontWeight: 'bold', marginBottom: '0.5rem' }}>Pelunasan Pembayaran</div>
                                    <div className="input-group">
                                        <label className="input-label">Jumlah Pelunasan</label>
                                        <input type="text" className="form-input"
                                            value={newTenant.pelunasan ? formatNumber(newTenant.pelunasan) : ''}
                                            onChange={e => setNewTenant({ ...newTenant, pelunasan: parseNumber(e.target.value) })}
                                            placeholder="Masukkan jumlah pelunasan"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        style={{ width: '100%', marginTop: '0.5rem' }}
                                        onClick={async () => {
                                            if (!newTenant.pelunasan || newTenant.pelunasan === '0' || newTenant.pelunasan === '') {
                                                alert('Masukkan jumlah pelunasan terlebih dahulu');
                                                return;
                                            }
                                            try {
                                                // First, update the initial DP payment status to Lunas
                                                const paymentsResponse = await api.get('/pembayaran');
                                                const dpPayment = paymentsResponse.data.find(p =>
                                                    p.tenant_id === selectedTenantId &&
                                                    p.type === 'Pembayaran Awal' &&
                                                    p.status === 'DP'
                                                );

                                                if (dpPayment) {
                                                    await api.put(`/pembayaran/${dpPayment.id}`, {
                                                        ...dpPayment,
                                                        status: 'Lunas'
                                                    });
                                                }

                                                // Record pelunasan payment
                                                await api.post('/pembayaran', {
                                                    tenant_id: selectedTenantId,
                                                    amount: newTenant.pelunasan,
                                                    date: new Date().toISOString().split('T')[0],
                                                    type: 'Pelunasan',
                                                    status: 'Lunas'
                                                });

                                                // Update tenant status to Lunas
                                                await api.put(`/penyewa/${selectedTenantId}`, {
                                                    ...newTenant,
                                                    checkin_date: newTenant.checkin,
                                                    checkout_date: newTenant.checkout,
                                                    payment_status: 'Lunas'
                                                });

                                                // Update local state to reflect Lunas status
                                                setNewTenant({ ...newTenant, paymentStatus: 'Lunas', pelunasan: '' });

                                                alert(`Pelunasan berhasil!\n\nBayar Awal: Rp ${parseInt(newTenant.payment).toLocaleString('id-ID')}\nPelunasan: Rp ${parseInt(newTenant.pelunasan).toLocaleString('id-ID')}\nTotal: Rp ${(parseInt(newTenant.payment) + parseInt(newTenant.pelunasan)).toLocaleString('id-ID')}\n\nStatus berubah menjadi Lunas. Silakan klik "Simpan" untuk menyimpan perubahan.`);

                                                fetchRooms();
                                            } catch (err) {
                                                console.error(err);
                                                alert('Gagal memproses pelunasan');
                                            }
                                        }}
                                    >
                                        Proses Pelunasan
                                    </button>
                                </div>
                            )}
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn" style={{ flex: 1, border: '1px solid var(--border-color)' }} onClick={() => setShowAddTenant(false)}>Batal</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    {isEditingTenant ? 'Simpan' : 'Simpan & Check-In'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Extend Lease Modal */}
            {showExtendModal && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Perpanjang Sewa</h2>
                            <button onClick={() => setShowExtendModal(false)} style={{ background: 'none', border: 'none', padding: 0 }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleExtendSubmit}>
                            <div className="input-group">
                                <label className="input-label">Tanggal Checkout Baru</label>
                                <input
                                    required
                                    type="date"
                                    className="form-input"
                                    value={extendData.checkout_date}
                                    onChange={e => setExtendData({ ...extendData, checkout_date: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Biaya Perpanjangan</label>
                                <input
                                    required
                                    type="text"
                                    className="form-input"
                                    value={formatNumber(extendData.payment_amount)}
                                    onChange={e => setExtendData({ ...extendData, payment_amount: parseNumber(e.target.value) })}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                <button type="button" className="btn" style={{ flex: 1, border: '1px solid var(--border-color)' }} onClick={() => setShowExtendModal(false)}>Batal</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Kamar;
