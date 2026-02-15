import { createContext, useContext, useState, ReactNode } from 'react';

type Currency = 'EUR' | 'DKK' | 'USD';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (c: Currency) => void;
    format: (amountEUR: number) => string;
    symbol: string;
}

const rates: Record<Currency, number> = {
    EUR: 1,
    DKK: 7.46,
    USD: 1.08,
};

const symbols: Record<Currency, string> = {
    EUR: '€',
    DKK: 'kr',
    USD: '$',
};

const CurrencyContext = createContext<CurrencyContextType>({
    currency: 'EUR',
    setCurrency: () => { },
    format: (n) => `€${n.toFixed(2)}`,
    symbol: '€',
});

export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
    const [currency, setCurrency] = useState<Currency>(() => {
        const saved = localStorage.getItem('ecofy_currency');
        return (saved as Currency) || 'EUR';
    });

    const handleSetCurrency = (c: Currency) => {
        setCurrency(c);
        localStorage.setItem('ecofy_currency', c);
    };

    const format = (amountEUR: number) => {
        const converted = amountEUR * rates[currency];
        const formatter = new Intl.NumberFormat(
            currency === 'DKK' ? 'da-DK' : currency === 'EUR' ? 'de-DE' : 'en-US',
            { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }
        );
        return formatter.format(converted);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, format, symbol: symbols[currency] }}>
            {children}
        </CurrencyContext.Provider>
    );
};
