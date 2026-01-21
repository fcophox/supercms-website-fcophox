import { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

export const usePageTitle = (titleKey: string) => {
    const { t, language } = useLanguage();

    useEffect(() => {
        const translatedTitle = t(titleKey);
        // Base suffix that represents the brand
        const suffix = " | fcoPhox";

        if (translatedTitle) {
            document.title = `${translatedTitle}${suffix}`;
        }
    }, [language, t, titleKey]);
};
