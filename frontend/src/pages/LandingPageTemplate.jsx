import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Wifi, Wind, Car, Shield, Star, Phone, Instagram, ArrowRight, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Sub-Components ---
const HeroSection = ({ content }) => {
    const navigate = useNavigate();

    return (
        <section style={{
            height: '100vh',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
        }}>
            {/* Background Image */}
            <img
                src={content.heroImage}
                alt="Background"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2565&auto=format&fit=crop';
                }}
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 0
                }}
            />

            {/* Gradient Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(17, 24, 39, 0.7) 0%, rgba(17, 24, 39, 0.4) 50%, rgba(17, 24, 39, 0.9) 100%)',
                zIndex: 1,
                backdropFilter: 'blur(2px)'
            }} />

            <div style={{ maxWidth: '1200px', width: '90%', zIndex: 2, textAlign: 'center', position: 'relative' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{
                            display: 'inline-block',
                            padding: '0.5rem 1.5rem',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '50px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            backdropFilter: 'blur(10px)',
                            marginBottom: '1.5rem',
                            fontSize: '0.9rem',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            color: '#e0e7ff'
                        }}
                    >
                        Premium Living in Jogja
                    </motion.div>

                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                        fontWeight: '800',
                        lineHeight: 1.1,
                        marginBottom: '1.5rem',
                        background: 'linear-gradient(to right, #ffffff, #818cf8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 20px 40px rgba(0,0,0,0.3)',
                        padding: '0 0.5rem'
                    }}>
                        {content.title}
                    </h1>

                    <p style={{
                        fontSize: '1.25rem',
                        maxWidth: '700px',
                        margin: '0 auto 3rem',
                        lineHeight: 1.6,
                        color: 'rgba(226, 232, 240, 0.9)',
                        fontWeight: '300'
                    }}>
                        {content.desc}
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(99, 102, 241, 0.6)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                        style={{
                            padding: '1rem 3rem',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            borderRadius: '50px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)'
                        }}
                    >
                        Pesan Sekarang <ArrowRight size={20} />
                    </motion.button>
                </motion.div>
            </div>

            {/* Admin Trigger */}
            <div
                style={{ position: 'absolute', bottom: '20px', right: '20px', cursor: 'default', opacity: 0 }}
                onDoubleClick={() => navigate('/login')}
            >
                <User size={20} />
            </div>
        </section>
    );
};

const FeatureCard = ({ icon: Icon, title, items }) => (
    <motion.div
        whileHover={{ y: -10 }}
        style={{
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2.5rem',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)'
        }}
    >
        <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            boxShadow: '0 10px 20px -5px rgba(79, 70, 229, 0.3)'
        }}>
            <Icon size={30} color="white" />
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' }}>{title}</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {items.map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', color: '#475569' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4f46e5' }} />
                    {item}
                </li>
            ))}
        </ul>
    </motion.div>
);

const FeaturesSection = ({ facilityData }) => {
    const kamarItems = facilityData?.facilities_kamar || ["Kamar Mandi Dalam", "AC & Water Heater", "Full Furnished", "Springbed Premium", "Smart TV 32 inch"];
    const keamananItems = facilityData?.facilities_keamanan || ["CCTV 24 Jam", "Access Card", "Penjaga 24 Jam", "Pembersihan Kamar Rutin", "Laundry Service"];
    const bersamaItems = facilityData?.facilities_bersama || ["High Speed WiFi 300Mbps", "Dapur Mewah + Kulkas", "Rooftop Garden", "Area Parkir Luas"];

    return (
        <section style={{ padding: '8rem 0', background: '#f8fafc' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', width: '90%' }}>
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem', letterSpacing: '-1px' }}>Fasilitas Premium</h2>
                    <p style={{ color: '#64748b', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>Nikmati kenyamanan maksimal dengan fasilitas lengkap yang kami sediakan khusus untuk Anda.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
                    <FeatureCard icon={Star} title="Kamar Eksklusif" items={kamarItems} />
                    <FeatureCard icon={Shield} title="Keamanan & Layanan" items={keamananItems} />
                    <FeatureCard icon={Wifi} title="Fasilitas Bersama" items={bersamaItems} />
                </div>
            </div>
        </section>
    );
};

const FacilitiesCarousel = ({ facilities }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-scroll every 3 seconds
    useEffect(() => {
        if (!facilities || facilities.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % facilities.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [facilities]);

    if (!facilities || facilities.length === 0) return null;

    return (
        <section style={{ padding: '2rem 0', background: '#0f172a', overflow: 'hidden', position: 'relative' }}>
            {/* Background glow effect */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '400px', height: '400px', background: 'rgba(79, 70, 229, 0.15)', filter: 'blur(100px)', borderRadius: '50%' }} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', width: '90%', position: 'relative', zIndex: 2 }}>
                <div style={{ position: 'relative', height: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {facilities.map((url, index) => {
                        let offset = index - currentIndex;
                        if (offset < -1) offset += facilities.length;
                        if (offset > 1 && facilities.length > 2) offset -= facilities.length;

                        if (Math.abs(offset) > 1) return null;

                        return (
                            <motion.div
                                key={index}
                                animate={{
                                    x: `${offset * 110}%`,
                                    scale: offset === 0 ? 1 : 0.8,
                                    opacity: offset === 0 ? 1 : 0.4,
                                    zIndex: offset === 0 ? 10 : 5,
                                    rotateY: offset === 0 ? 0 : offset * 15
                                }}
                                transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                                style={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: '380px',
                                    maxWidth: '80%',
                                    height: '220px',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    boxShadow: offset === 0 ? '0 20px 40px -10px rgba(0, 0, 0, 0.5)' : 'none',
                                    border: offset === 0 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                                }}
                            >
                                <img
                                    src={url}
                                    alt={`Fasilitas ${index + 1}`}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </motion.div>
                        );
                    })}
                </div>

                {/* Pagination Dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                    {facilities.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            style={{
                                width: currentIndex === index ? '30px' : '8px',
                                height: '8px',
                                borderRadius: '4px',
                                border: 'none',
                                background: currentIndex === index ? '#818cf8' : 'rgba(255,255,255,0.2)',
                                cursor: 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

const LocationSection = () => (
    <section style={{ padding: '6rem 0', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '90%', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '3rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem', letterSpacing: '-1px' }}>Lokasi Paling Strategis</h2>
                <p style={{ color: '#64748b', fontSize: '1.25rem' }}>Akses mudah ke mana saja. Hemat waktu, lebih produktif.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    {[
                        { label: 'Univ. Amikom', dist: '2 Min' }, { label: 'UPN Veteran', dist: '5 Min' },
                        { label: 'UII Ekonomi', dist: '5 Min' }, { label: 'Hartono Mall', dist: '7 Min' },
                        { label: 'RS JIH', dist: '6 Min' }, { label: 'Warmindo', dist: '1 Min' }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.05 }}
                            style={{
                                padding: '1.5rem',
                                background: '#f8fafc',
                                borderRadius: '16px',
                                border: '1px solid #e2e8f0',
                                textAlign: 'center'
                            }}
                        >
                            <h4 style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#334155', marginBottom: '0.25rem' }}>{item.label}</h4>
                            <span style={{ color: '#4f46e5', fontWeight: 'bold', fontSize: '0.9rem' }}>{item.dist}</span>
                        </motion.div>
                    ))}
                </div>

                <div style={{ height: '400px', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)', border: '4px solid white' }}>
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d17749.753224541862!2d110.40762558006985!3d-7.757126119552964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59007722c22b%3A0xab99762cd38e04a4!2sPandawaX45%20Kos!5e0!3m2!1sid!2sid!4v1765888503584!5m2!1sid!2sid"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Kost Location"
                    ></iframe>
                </div>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer id="contact" style={{ background: '#0f172a', color: 'white', padding: '2rem 0 1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '90%', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.25rem', background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Siap Huni Sekarang?</h2>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0', textDecoration: 'none', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50px', transition: 'all 0.3s', fontSize: '0.9rem' }} className="hover:bg-white/10">
                    <Phone size={16} color="#818cf8" />
                    <span style={{ fontWeight: '500' }}>0812-3456-7890</span>
                </a>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e2e8f0', textDecoration: 'none', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '50px', transition: 'all 0.3s', fontSize: '0.9rem' }} className="hover:bg-white/10">
                    <Instagram size={16} color="#e879f9" />
                    <span style={{ fontWeight: '500' }}>@kosputra_executive</span>
                </a>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', color: '#64748b', fontSize: '0.8rem' }}>
                <p style={{ margin: 0 }}>&copy; 2025 Kos Putra Executive. Created with ❤️ in Jogja.</p>
            </div>
        </div>
    </footer>
);

// --- Main Template Component ---
const LandingPageTemplate = ({ data, onClosePreview }) => {
    // If we have an onClosePreview prop, we are in "Preview Mode"
    const isPreview = !!onClosePreview;

    // Parse facility spec arrays (might be string from DB or array from form)
    const parseSafe = (val) => {
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') {
            try { return JSON.parse(val); } catch { return []; }
        }
        return [];
    };

    const facilityData = {
        facilities_kamar: parseSafe(data.facilities_kamar),
        facilities_keamanan: parseSafe(data.facilities_keamanan),
        facilities_bersama: parseSafe(data.facilities_bersama)
    };

    return (
        <div style={{ fontFamily: '"Inter", sans-serif', background: 'white', position: 'relative' }}>
            {isPreview && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    background: '#1f2937',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                }}>
                    <span>Mode Preview</span>
                    <button
                        onClick={onClosePreview}
                        style={{ background: 'white', color: 'black', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer', display: 'flex' }}
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            <HeroSection content={{
                heroImage: data.landing_hero || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2565&auto=format&fit=crop',
                title: data.landing_title || 'KOS PUTRA EXECUTIVE',
                desc: data.landing_desc || 'Hunian premium dengan fasilitas lengkap.'
            }} />

            <FeaturesSection facilityData={facilityData} />

            {/* Parse facilities if string */}
            <FacilitiesCarousel facilities={typeof data.landing_facilities === 'string' ? JSON.parse(data.landing_facilities || '[]') : data.landing_facilities} />

            <LocationSection />
            <Footer />
        </div>
    );
};

export default LandingPageTemplate;
