import { LayoutDashboard, Package, ShoppingCart, Tag, Settings, LogOut } from 'lucide-react';

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'promos', label: 'Promos', icon: Tag },
    { id: 'settings', label: 'Reglages', icon: Settings },
];

export default function AdminNav({ currentPage, onNavigate, userEmail, onLogout }) {
    return (
        <header className="sticky top-0 z-50 bg-white/95 border-b border-[#F9D7DA] backdrop-blur">
            <div className="max-w-screen-xl mx-auto px-3 sm:px-4 py-3">
                <div className="flex items-start sm:items-center justify-between gap-3 mb-3">
                    <div className="min-w-0">
                        <p className="font-sans text-[#9CA3AF] truncate sm:hidden" style={{ fontSize: '12px' }}>
                            {userEmail}
                        </p>
                        <h1 className="font-serif text-[#1C2340] leading-tight truncate" style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 600 }}>
                            Intime & Co - Administration
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 flex-none">
                        <span className="hidden sm:inline max-w-[220px] truncate font-sans text-[#5A6080]" style={{ fontSize: '14px' }}>
                            {userEmail}
                        </span>
                        <button
                            onClick={onLogout}
                            className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-[#EBB4BB] font-sans text-[#1C2340] hover:bg-[#FDE8EC] transition-colors min-h-[40px]"
                            style={{ fontSize: '14px' }}
                            title="Se deconnecter"
                        >
                            <LogOut size={16} strokeWidth={1.8} />
                            <span className="hidden sm:inline">Se deconnecter</span>
                        </button>
                    </div>
                </div>

                <nav className="grid grid-cols-5 sm:flex sm:items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide" aria-label="Navigation admin">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-xl sm:rounded-full font-sans transition-all duration-200 whitespace-nowrap min-h-[54px] sm:min-h-0"
                                style={{
                                    fontSize: 'clamp(11px, 2.8vw, 14px)',
                                    background: isActive ? '#1C2340' : 'transparent',
                                    color: isActive ? 'white' : '#1C2340',
                                    fontWeight: isActive ? 600 : 500,
                                }}
                                aria-current={isActive ? 'page' : undefined}
                            >
                                <Icon size={17} strokeWidth={1.8} />
                                <span className="leading-tight text-center">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}
