import { useCurrency } from '@/contexts/CurrencyContext';

type Currency = 'EUR' | 'DKK' | 'USD';

const currencies: { value: Currency; label: string; flag: string }[] = [
    { value: 'EUR', label: 'EUR', flag: '🇪🇺' },
    { value: 'DKK', label: 'DKK', flag: '🇩🇰' },
    { value: 'USD', label: 'USD', flag: '🇺🇸' },
];

const CurrencySelector = () => {
    const { currency, setCurrency } = useCurrency();

    return (
        <div className="flex items-center gap-0.5 rounded-full bg-muted/50 border border-border/50 p-0.5">
            {currencies.map((c) => (
                <button
                    key={c.value}
                    onClick={() => setCurrency(c.value)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${currency === c.value
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                    title={c.label}
                >
                    <span className="text-xs">{c.flag}</span>
                    <span className="hidden sm:inline">{c.label}</span>
                </button>
            ))}
        </div>
    );
};

export default CurrencySelector;
