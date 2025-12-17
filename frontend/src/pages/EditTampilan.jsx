
import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import { Save, Upload, Trash2, Plus, Image as ImageIcon, Loader2, Eye, X } from 'lucide-react';
import LandingPageTemplate from './LandingPageTemplate';

// Helper component for editing facility specification lists
const FacilitySpecEditor = ({ title, items, setItems }) => {
    const [newItem, setNewItem] = useState('');

    const handleAdd = () => {
        if (newItem.trim()) {
            setItems([...items, newItem.trim()]);
            setNewItem('');
        }
    };

    const handleRemove = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontWeight: '600', color: '#1e293b', marginBottom: '1rem', fontSize: '1rem' }}>{title}</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: '1rem' }}>
                {items.map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0' }}>
                        <span style={{ color: '#475569', fontSize: '0.9rem' }}>{item}</span>
                        <button onClick={() => handleRemove(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}>
                            <X size={16} />
                        </button>
                    </li>
                ))}
            </ul>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    placeholder="Tambah item..."
                    style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                />
                <button onClick={handleAdd} style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '0.5rem 0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
};

const EditTampilan = () => {
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({
        landing_hero: '',
        landing_title: '',
        landing_desc: '',
        landing_facilities: '[]'
    });
    const [facilities, setFacilities] = useState([]);

    // Facility Specification Lists (editable)
    const [facilitiesKamar, setFacilitiesKamar] = useState([]);
    const [facilitiesKeamanan, setFacilitiesKeamanan] = useState([]);
    const [facilitiesBersama, setFacilitiesBersama] = useState([]);

    // Preview Mode State
    const [showPreview, setShowPreview] = useState(false);

    // Upload States
    const [uploadingHero, setUploadingHero] = useState(false);
    const [uploadingFacility, setUploadingFacility] = useState(false);

    // Refs for hidden file inputs
    const heroInputRef = useRef(null);
    const facilityInputRef = useRef(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const parseSafe = (val) => {
        if (Array.isArray(val)) return val;
        if (typeof val === 'string' && val) {
            try { return JSON.parse(val); } catch { return []; }
        }
        return [];
    };

    const fetchSettings = async () => {
        try {
            const response = await api.get('/settings');
            setSettings(response.data);
            setFacilities(parseSafe(response.data.landing_facilities));
            setFacilitiesKamar(parseSafe(response.data.facilities_kamar) || ["Kamar Mandi Dalam", "AC & Water Heater", "Full Furnished", "Springbed Premium", "Smart TV 32 inch"]);
            setFacilitiesKeamanan(parseSafe(response.data.facilities_keamanan) || ["CCTV 24 Jam", "Access Card", "Penjaga 24 Jam", "Pembersihan Kamar Rutin", "Laundry Service"]);
            setFacilitiesBersama(parseSafe(response.data.facilities_bersama) || ["High Speed WiFi 300Mbps", "Dapur Mewah + Kulkas", "Rooftop Garden", "Area Parkir Luas"]);
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleHeroFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingHero(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await api.post('/settings/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSettings(prev => ({ ...prev, landing_hero: response.data.url }));
        } catch (error) {
            console.error("Hero upload failed", error);
            alert(`Gagal upload gambar: ${error.response?.data?.message || error.message} `);
        } finally {
            setUploadingHero(false);
            // Reset input value to allow re-uploading the same file if needed
            if (heroInputRef.current) heroInputRef.current.value = '';
        }
    };

    const handleFacilityFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingFacility(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await api.post('/settings/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFacilities(prev => [...prev, response.data.url]);
        } catch (error) {
            console.error("Facility upload failed", error);
            alert(`Gagal upload fasilitas: ${error.response?.data?.message || error.message} `);
        } finally {
            setUploadingFacility(false);
            if (facilityInputRef.current) facilityInputRef.current.value = '';
        }
    };

    const handleRemoveFacility = (index) => {
        if (window.confirm('Hapus foto ini dari galeri?')) {
            setFacilities(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleSaveAll = async () => {
        try {
            const updates = {
                landing_hero: settings.landing_hero,
                landing_title: settings.landing_title,
                landing_desc: settings.landing_desc,
                landing_facilities: JSON.stringify(facilities),
                facilities_kamar: JSON.stringify(facilitiesKamar),
                facilities_keamanan: JSON.stringify(facilitiesKeamanan),
                facilities_bersama: JSON.stringify(facilitiesBersama)
            };
            await api.put('/settings', updates);
            alert('Perubahan berhasil disimpan! Landing page telah diperbarui.');
        } catch (error) {
            console.error("Save failed", error);
            const errMsg = error.response?.data?.message || error.message;
            alert(`Gagal menyimpan perubahan: ${errMsg}`);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <Loader2 className="animate-spin" size={48} color="#2563eb" />
        </div>
    );

    // If Preview is active, assume control of the whole page
    if (showPreview) {
        return (
            <div style={{ position: 'fixed', inset: 0, zIndex: 1000, overflow: 'auto', background: 'white' }}>
                <LandingPageTemplate
                    data={{
                        ...settings,
                        landing_facilities: facilities,
                        facilities_kamar: facilitiesKamar,
                        facilities_keamanan: facilitiesKeamanan,
                        facilities_bersama: facilitiesBersama
                    }}
                    onClosePreview={() => setShowPreview(false)}
                />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>Edit Tampilan</h1>
                    <p style={{ color: '#6b7280' }}>Kelola konten halaman depan (Landing Page)</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setShowPreview(true)}
                        className="btn"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'white', color: '#1f2937', border: '1px solid #d1d5db' }}
                    >
                        <Eye size={20} /> Preview
                    </button>
                    <button
                        onClick={handleSaveAll}
                        className="btn btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
                    >
                        <Save size={20} /> Simpan Perubahan
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>Hero Section (Banner Utama)</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="input-group">
                            <label className="input-label">Judul Utama</label>
                            <input
                                type="text"
                                className="form-input"
                                value={settings.landing_title}
                                onChange={(e) => setSettings({ ...settings, landing_title: e.target.value })}
                                placeholder="Contoh: Temukan Hunian Nyaman..."
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Deskripsi</label>
                            <textarea
                                className="form-input"
                                rows="4"
                                value={settings.landing_desc}
                                onChange={(e) => setSettings({ ...settings, landing_desc: e.target.value })}
                                placeholder="Deskripsi singkat tentang kos..."
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Gambar Background</label>
                        <div style={{
                            border: '2px dashed #e5e7eb',
                            borderRadius: '0.75rem',
                            overflow: 'hidden',
                            position: 'relative',
                            height: '200px',
                            backgroundColor: '#f9fafb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {settings.landing_hero ? (
                                <>
                                    <img
                                        src={settings.landing_hero}
                                        alt="Hero Preview"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                        className="hover:opacity-100"
                                        onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                                        onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                                    >
                                        <button
                                            onClick={() => setSettings({ ...settings, landing_hero: '' })}
                                            style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer' }}
                                            title="Hapus Gambar"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', color: '#9ca3af', padding: '1rem' }}>
                                    <ImageIcon size={48} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                                    <p style={{ fontSize: '0.875rem' }}>Tidak ada gambar</p>
                                </div>
                            )}

                            {/* Loading Overlay */}
                            {uploadingHero && (
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Loader2 className="animate-spin" color="#2563eb" />
                                </div>
                            )}
                        </div>

                        <input
                            type="file"
                            ref={heroInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleHeroFileChange}
                        />
                        <button
                            type="button"
                            onClick={() => heroInputRef.current?.click()}
                            className="btn"
                            disabled={uploadingHero}
                            style={{ width: '100%', marginTop: '0.75rem', border: '1px solid #d1d5db', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                        >
                            {uploadingHero ? 'Mengupload...' : <><Upload size={16} /> Ganti Gambar</>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Facility Specifications Section */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>Spesifikasi Fasilitas</h2>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Edit daftar fasilitas yang tampil di landing page</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {/* Kamar Eksklusif */}
                    <FacilitySpecEditor
                        title="Kamar Eksklusif"
                        items={facilitiesKamar}
                        setItems={setFacilitiesKamar}
                    />
                    {/* Keamanan & Layanan */}
                    <FacilitySpecEditor
                        title="Keamanan & Layanan"
                        items={facilitiesKeamanan}
                        setItems={setFacilitiesKeamanan}
                    />
                    {/* Fasilitas Bersama */}
                    <FacilitySpecEditor
                        title="Fasilitas Bersama"
                        items={facilitiesBersama}
                        setItems={setFacilitiesBersama}
                    />
                </div>
            </div>

            {/* Facilities Section */}
            <div className="card">
                <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937' }}>Galeri Fasilitas</h2>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{facilities.length} Foto</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {facilities.map((url, index) => (
                        <div key={index} style={{
                            position: 'relative',
                            height: '160px',
                            borderRadius: '0.75rem',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            border: '1px solid #e5e7eb'
                        }}>
                            <img src={url} alt={`Fasilitas ${index + 1} `} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                background: 'white',
                                borderRadius: '50%',
                                padding: '4px',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                                onClick={() => handleRemoveFacility(index)}
                            >
                                <Trash2 size={16} color="#ef4444" />
                            </div>
                        </div>
                    ))}

                    <input
                        type="file"
                        ref={facilityInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleFacilityFileChange}
                    />

                    <div
                        onClick={() => facilityInputRef.current?.click()}
                        style={{
                            height: '160px',
                            border: '2px dashed #cbd5e1',
                            borderRadius: '0.75rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#64748b',
                            backgroundColor: '#f8fafc',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.color = '#2563eb'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#64748b'; }}
                    >
                        {uploadingFacility ? (
                            <Loader2 className="animate-spin" size={32} />
                        ) : (
                            <>
                                <Plus size={32} style={{ marginBottom: '0.5rem' }} />
                                <span style={{ fontWeight: '600' }}>Tambah Foto</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditTampilan;
