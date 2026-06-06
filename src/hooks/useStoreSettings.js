import { useEffect, useState } from 'react';
import { fetchSettings, subscribeToSettings } from '../supabase/settings';

export const DEFAULT_STORE_SETTINGS = {
    store_name: 'Intime & Co',
    announcement_text: "Livraison gratuite des 3000 DZD d'achat",
    delivery_fee: '500',
    free_delivery_threshold: '3000',
    instagram_url: 'https://www.instagram.com/inti.me15',
    store_phone: '+213 555 00 00 00',
    store_address: 'Blida, Algerie',
    store_hours: 'Lun-Sam : 09h00 - 19h00',
};

export function getNumberSetting(settings, key, fallback) {
    const value = Number.parseFloat(settings?.[key]);
    return Number.isFinite(value) && value >= 0 ? value : fallback;
}

export function getPhoneHref(phone) {
    const cleaned = String(phone || '').replace(/[^\d+]/g, '');
    return cleaned ? `tel:${cleaned}` : '#contact';
}

export default function useStoreSettings() {
    const [settings, setSettings] = useState(DEFAULT_STORE_SETTINGS);

    useEffect(() => {
        let mounted = true;

        const loadSettings = async () => {
            try {
                const data = await fetchSettings();
                if (mounted) {
                    setSettings((prev) => ({ ...prev, ...data }));
                }
            } catch (error) {
                console.error('Erreur lors du chargement des parametres:', error);
            }
        };

        loadSettings();

        const unsubscribe = subscribeToSettings((payload) => {
            const next = payload?.new;
            if (next?.key) {
                setSettings((prev) => ({ ...prev, [next.key]: next.value ?? '' }));
            }
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    return settings;
}
