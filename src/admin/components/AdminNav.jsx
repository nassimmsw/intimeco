import { LayoutDashboard, Package, ShoppingCart, Tag, Settings, LogOut } from 'lucide-react';

const NAV_ITEMS = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'orders', label: 'Commandes', icon: ShoppingCart },
    { id: 'products', label: 'Produits', icon: Package },
    { id: 'promos', label: 'Codes promo', icon: Tag },
    { id: 'settings', label: 'Parametres', icon: Settings },
];

export default function AdminNav({ currentPage, onNavigate, userEmail, onLogout }) {
    return (
        <header className="sticky top-0 z-50 bg-white border-b border-[#F9D7DA]">
            <div className="max-w-screen-xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="font-serif text-[#1C2340]" style={{ fontSize: '24px', fontWeight: 600 }}>
                        Intime & Co — Administration
                    </h1>
                    <div className="flex items-center gap-4">
                        <span className="font-sans text-[#5A6080]" style={{ fontSize: '14px' }}>
                            {userEmail}
                        </span>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#EBB4BB] font-sans text-[#1C2340] hover:bg-[#FDE8EC] transition-colors"
                            style={{ fontSize: '14px' }}
                        >
                            <LogOut size={16} strokeWidth={1.8} />
                            Se deconnecter
                        </button>
                    </div>
                </div>

                <nav className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full font-sans transition-all duration-200 whitespace-nowrap"
                                style={{
                                    fontSize: '14px',
                                    background: isActive ? '#1C2340' : 'transparent',
                                    color: isActive ? 'white' : '#1C2340',
                                    fontWeight: isActive ? 600 : 500,
                                }}
                            >
                                <Icon size={16} strokeWidth={1.8} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}
