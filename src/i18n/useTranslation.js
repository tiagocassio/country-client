'use client';

import { useState, useEffect } from 'react';

export function useTranslation() {
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    loadTranslations();
  }, []);

  const loadTranslations = async () => {
    try {
      const localeData = await import(`./locales/pt-BR.json`);
      setTranslations(localeData.default);
    } catch (error) {
      setTranslations({});
    }
  };

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    if (typeof value === 'string') {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }

    return value || key;
  };

  return {
    t,
    translations
  };
}
