import React, { createContext, useContext, useState, useEffect } from 'react';
import { COUNTRIES, Country, CountryCode, CountryModal } from '@/components/CountryModal';

interface CountryContextType {
  country: Country;
  countryCode: CountryCode;
  setCountry: (code: CountryCode) => void;
  openCountryModal: () => void;
  closeCountryModal: () => void;
  formatSubtotal: (quantity: number) => string;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export const CountryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [countryCode, setCountryCode] = useState<CountryCode>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('diydeg_country') as CountryCode;
      if (saved && COUNTRIES[saved]) return saved;
    }
    return 'mx';
  });

  // Always open modal as soon as the visitor enters the site
  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleSetCountry = (code: CountryCode) => {
    if (COUNTRIES[code]) {
      setCountryCode(code);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('diydeg_country', code);
      }
    }
  };

  const country = COUNTRIES[countryCode];

  const formatSubtotal = (quantity: number): string => {
    const total = country.price * quantity;
    if (countryCode === 'es') {
      return `${total.toFixed(2).replace('.', ',')} EUR`;
    }
    if (countryCode === 'mx') {
      return `${Math.round(total).toLocaleString('es-MX')} MXN`;
    }
    if (countryCode === 'co') {
      return `${Math.round(total).toLocaleString('es-CO')} COP`;
    }
    if (countryCode === 'uy') {
      return `${Math.round(total).toLocaleString('es-UY')} UYU`;
    }
    return `${total} ${country.currency}`;
  };

  return (
    <CountryContext.Provider
      value={{
        country,
        countryCode,
        setCountry: handleSetCountry,
        openCountryModal: () => setIsModalOpen(true),
        closeCountryModal: () => setIsModalOpen(false),
        formatSubtotal,
      }}
    >
      {children}
      <CountryModal
        isOpen={isModalOpen}
        selectedCountry={countryCode}
        onSelectCountry={handleSetCountry}
        onClose={() => setIsModalOpen(false)}
      />
    </CountryContext.Provider>
  );
};

export const useCountry = (): CountryContextType => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
};
