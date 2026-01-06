"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

interface SiteSettingsContextType {
    articlesVisible: boolean;
    caseStudiesVisible: boolean;
    servicesVisible: boolean;
    refreshSettings: () => Promise<void>;
    updateSetting: (key: string, value: boolean) => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
    const [articlesVisible, setArticlesVisible] = useState(true);
    const [caseStudiesVisible, setCaseStudiesVisible] = useState(true);
    const [servicesVisible, setServicesVisible] = useState(true);

    const fetchSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('site_settings')
                .select('*');

            if (error) {
                console.error("Error fetching site settings:", error);
                return;
            }

            if (data) {
                data.forEach(setting => {
                    if (setting.key === 'articles_visible') setArticlesVisible(setting.value);
                    if (setting.key === 'case_studies_visible') setCaseStudiesVisible(setting.value);
                    if (setting.key === 'services_visible') setServicesVisible(setting.value);
                });
            }

            // If rows don't exist, we default to true (initialized state)
        } catch (err) {
            console.error("Unexpected error fetching settings:", err);
        }
    };

    const updateSetting = async (key: string, value: boolean) => {
        try {
            // Optimistic update
            if (key === 'articles_visible') setArticlesVisible(value);
            if (key === 'case_studies_visible') setCaseStudiesVisible(value);
            if (key === 'services_visible') setServicesVisible(value);

            const { error } = await supabase
                .from('site_settings')
                .upsert({ key, value })
                .select();

            if (error) {
                console.error(`Error updating setting ${key}:`, error);
                console.error("Error details:", JSON.stringify(error, null, 2));
                toast.error("Error al actualizar la configuración. Verifica tu conexión o permisos.");
                // Revert on error
                fetchSettings();
            } else {
                toast.success(value ? "Sección visible en la web" : "Sección oculta en la web");
            }
        } catch (err) {
            console.error("Unexpected error updating setting:", err);
            toast.error("Ocurrió un error inesperado.");
            fetchSettings();
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SiteSettingsContext.Provider value={{
            articlesVisible,
            caseStudiesVisible,
            servicesVisible,
            refreshSettings: fetchSettings,
            updateSetting
        }}>
            {children}
        </SiteSettingsContext.Provider>
    );
};

export const useSiteSettings = () => {
    const context = useContext(SiteSettingsContext);
    if (context === undefined) {
        throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
    }
    return context;
};
