// Demo Mode Configuration
// Set to true for static demo deployment (no backend required)
export const DEMO_MODE = true;

// Demo Credentials
export const DEMO_CREDENTIALS = {
    username: 'admin',
    password: 'admin'
};

// Demo Data for Landing Page
export const DEMO_LANDING_DATA = {
    landing_hero: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2670&auto=format&fit=crop',
    landing_title: 'PANDAWAX45 KOS',
    landing_desc: 'Hunian premium dengan fasilitas lengkap, lokasi strategis dekat kampus AMIKOM, dan kenyamanan maksimal untuk mahasiswa & profesional.',
    landing_facilities: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2680&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2670&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2670&auto=format&fit=crop'
    ],
    facilities_kamar: ["Kamar Mandi Dalam", "AC & Water Heater", "Full Furnished", "Springbed Premium", "Smart TV 32 inch"],
    facilities_keamanan: ["CCTV 24 Jam", "Access Card", "Penjaga 24 Jam", "Pembersihan Kamar Rutin", "Laundry Service"],
    facilities_bersama: ["High Speed WiFi 300Mbps", "Dapur Mewah + Kulkas", "Rooftop Garden", "Area Parkir Luas"]
};

// Demo Data for Dashboard
export const DEMO_DASHBOARD_DATA = {
    totalKamar: 12,
    kamarTerisi: 10,
    kamarKosong: 2,
    totalPenyewa: 10,
    pendapatanBulanIni: 15000000,
    pengeluaranBulanIni: 2500000,
    totalKunjungan: 1250,
    kamarList: [
        { id: 1, nomor_kamar: 'K01', status: 'terisi', harga: 1500000 },
        { id: 2, nomor_kamar: 'K02', status: 'terisi', harga: 1500000 },
        { id: 3, nomor_kamar: 'K03', status: 'kosong', harga: 1500000 },
        { id: 4, nomor_kamar: 'K04', status: 'terisi', harga: 1500000 },
        { id: 5, nomor_kamar: 'K05', status: 'terisi', harga: 1800000 },
        { id: 6, nomor_kamar: 'K06', status: 'terisi', harga: 1800000 },
        { id: 7, nomor_kamar: 'K07', status: 'kosong', harga: 1800000 },
        { id: 8, nomor_kamar: 'K08', status: 'terisi', harga: 1800000 },
        { id: 9, nomor_kamar: 'K09', status: 'terisi', harga: 2000000 },
        { id: 10, nomor_kamar: 'K10', status: 'terisi', harga: 2000000 },
        { id: 11, nomor_kamar: 'K11', status: 'terisi', harga: 2000000 },
        { id: 12, nomor_kamar: 'K12', status: 'terisi', harga: 2000000 }
    ],
    penyewaList: [
        { id: 1, nama: 'Budi Santoso', nomor_kamar: 'K01', no_hp: '081234567890', tanggal_masuk: '2024-01-15', tanggal_keluar: '2025-01-15' },
        { id: 2, nama: 'Andi Wijaya', nomor_kamar: 'K02', no_hp: '081234567891', tanggal_masuk: '2024-02-01', tanggal_keluar: '2025-02-01' },
        { id: 3, nama: 'Rudi Hartono', nomor_kamar: 'K04', no_hp: '081234567892', tanggal_masuk: '2024-03-10', tanggal_keluar: '2025-03-10' },
        { id: 4, nama: 'Deni Pratama', nomor_kamar: 'K05', no_hp: '081234567893', tanggal_masuk: '2024-04-01', tanggal_keluar: '2025-04-01' },
        { id: 5, nama: 'Eko Saputra', nomor_kamar: 'K06', no_hp: '081234567894', tanggal_masuk: '2024-05-15', tanggal_keluar: '2025-05-15' }
    ],
    pembayaranList: [
        { id: 1, nama_penyewa: 'Budi Santoso', nomor_kamar: 'K01', jumlah: 1500000, tanggal: '2024-12-01', status: 'lunas' },
        { id: 2, nama_penyewa: 'Andi Wijaya', nomor_kamar: 'K02', jumlah: 1500000, tanggal: '2024-12-01', status: 'lunas' },
        { id: 3, nama_penyewa: 'Rudi Hartono', nomor_kamar: 'K04', jumlah: 1500000, tanggal: '2024-12-05', status: 'lunas' },
        { id: 4, nama_penyewa: 'Deni Pratama', nomor_kamar: 'K05', jumlah: 1800000, tanggal: '2024-12-10', status: 'pending' }
    ]
};
