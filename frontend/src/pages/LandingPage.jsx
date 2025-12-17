
import React, { useEffect, useState } from 'react';
import api from '../api';
import LandingPageTemplate from './LandingPageTemplate';
import { DEMO_MODE, DEMO_LANDING_DATA } from '../demoConfig';

const LandingPage = () => {
    const [content, setContent] = useState({
        landing_hero: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2565&auto=format&fit=crop',
        landing_title: 'KOS PUTRA EXECUTIVE',
        landing_desc: 'Hunian premium dengan fasilitas lengkap, lokasi strategis, dan kenyamanan maksimal untuk mahasiswa & profesional.',
        landing_facilities: [],
        facilities_kamar: [],
        facilities_keamanan: [],
        facilities_bersama: []
    });

    useEffect(() => {
        // Demo Mode: Use static data
        if (DEMO_MODE) {
            setContent(DEMO_LANDING_DATA);
            return;
        }

        // Normal Mode: Fetch from API
        const fetchContent = async () => {
            try {
                const response = await api.get('/settings');
                const data = response.data;

                setContent({
                    landing_hero: data.landing_hero || content.landing_hero,
                    landing_title: data.landing_title || content.landing_title,
                    landing_desc: data.landing_desc || content.landing_desc,
                    landing_facilities: data.landing_facilities ? JSON.parse(data.landing_facilities) : [],
                    facilities_kamar: data.facilities_kamar ? JSON.parse(data.facilities_kamar) : [],
                    facilities_keamanan: data.facilities_keamanan ? JSON.parse(data.facilities_keamanan) : [],
                    facilities_bersama: data.facilities_bersama ? JSON.parse(data.facilities_bersama) : []
                });
            } catch (err) {
                console.error('Error fetching landing content:', err);
            }
        };
        fetchContent();

        // Track visit
        const trackVisit = async () => {
            try {
                const visited = sessionStorage.getItem('visited');
                if (!visited) {
                    await api.post('/dashboard/visit');
                    sessionStorage.setItem('visited', 'true');
                }
            } catch (err) {
                console.error('Error tracking visit:', err);
            }
        };
        trackVisit();
    }, []);

    return <LandingPageTemplate data={content} />;
};

export default LandingPage;

