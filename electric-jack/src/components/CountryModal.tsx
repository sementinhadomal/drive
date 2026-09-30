import React from 'react';
import { X } from 'lucide-react';

export type CountryCode = 'mx' | 'co' | 'uy' | 'es';

export interface Country {
  code: CountryCode;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  delivery: string;
  price: number;
  oldPrice: number;
  priceDisplay: {
    symbol: string;
    integer: string;
    decimal: string;
  };
  formattedPrice: string;
  formattedOldPrice: string;
  savings: string;
}

export const COUNTRIES: Record<CountryCode, Country> = {
  mx: {
    code: 'mx',
    name: 'México',
    flag: '🇲🇽',
    currency: 'MXN',
    currencySymbol: '$',
    delivery: 'Envío gratis a todo México',
    price: 599,
    oldPrice: 2399,
    priceDisplay: {
      symbol: '$',
      integer: '599',
      decimal: '',
    },
    formattedPrice: '$599 MXN',
    formattedOldPrice: '$2,399 MXN',
    savings: 'Ahorra $1,800 MXN (75%)',
  },
  co: {
    code: 'co',
    name: 'Colombia',
    flag: '🇨🇴',
    currency: 'COP',
    currencySymbol: '$',
    delivery: 'Envío gratis a toda Colombia',
    price: 129900,
    oldPrice: 499000,
    priceDisplay: {
      symbol: '$',
      integer: '129.900',
      decimal: '',
    },
    formattedPrice: '$129.900 COP',
    formattedOldPrice: '$499.000 COP',
    savings: 'Ahorra $369.100 COP (75%)',
  },
  uy: {
    code: 'uy',
    name: 'Uruguay',
    flag: '🇺🇾',
    currency: 'UYU',
    currencySymbol: '$U',
    delivery: 'Envío gratis a todo Uruguay',
    price: 1190,
    oldPrice: 4790,
    priceDisplay: {
      symbol: '$U ',
      integer: '1.190',
      decimal: '',
    },
    formattedPrice: '$U 1.190',
    formattedOldPrice: '$U 4.790',
    savings: 'Ahorra $U 3.600 (75%)',
  },
  es: {
    code: 'es',
    name: 'España',
    flag: '🇪🇸',
    currency: 'EUR',
    currencySymbol: '€',
    delivery: 'Envío gratis a toda España',
    price: 29.90,
    oldPrice: 119.99,
    priceDisplay: {
      symbol: '€',
      integer: '29',
      decimal: '.90',
    },
    formattedPrice: '29,90 €',
    formattedOldPrice: '119,99 €',
    savings: 'Ahorra 90,09 € (75%)',
  },
};

interface CountryModalProps {
  isOpen: boolean;
  selectedCountry: CountryCode;
  onSelectCountry: (country: CountryCode) => void;
  onClose: () => void;
}

export const CountryModal: React.FC<CountryModalProps> = ({
  isOpen,
  selectedCountry,
  onSelectCountry,
  onClose,
}) => {
  const [activeCode, setActiveCode] = React.useState<CountryCode>(selectedCountry);

  React.useEffect(() => {
    setActiveCode(selectedCountry);
  }, [selectedCountry]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelectCountry(activeCode);
    onClose();
  };

  const countryList: Country[] = Object.values(COUNTRIES);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-[420px] w-full p-6 sm:p-7 relative text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 transition-colors p-1 rounded-full hover:bg-gray-100 cursor-pointer"
          aria-label="Cerrar"
        >
          <X size={22} />
        </button>

        {/* Modal Title */}
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          Elige tu país
        </h2>
        <p className="text-gray-500 text-sm mt-1.5 mb-6 leading-relaxed">
          Mostramos precios, moneda y plazos de envío según tu país.
        </p>

        {/* Country Options */}
        <div className="space-y-3">
          {countryList.map((c) => {
            const isSelected = activeCode === c.code;
            return (
              <div
                key={c.code}
                onClick={() => setActiveCode(c.code)}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? 'border-[#205aa7] bg-[#f0f5fc] ring-2 ring-[#205aa7] shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={`https://flagcdn.com/w40/${c.code}.png`}
                    alt={c.name}
                    className="w-6 h-4.5 object-cover rounded-[3px] shadow-xs border border-gray-100 flex-none"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="font-bold text-gray-900 text-base">{c.name}</span>
                </div>
                <span className={`font-semibold text-sm ${isSelected ? 'text-[#205aa7]' : 'text-gray-500'}`}>
                  {c.currency}
                </span>
              </div>
            );
          })}
        </div>

        {/* Confirm Button */}
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full mt-6 py-3.5 px-6 rounded-2xl font-bold text-white text-base bg-[#205aa7] hover:bg-[#184987] active:scale-[0.99] transition-all shadow-md flex items-center justify-center cursor-pointer"
        >
          Continuar
        </button>
      </div>
    </div>
  );
};
