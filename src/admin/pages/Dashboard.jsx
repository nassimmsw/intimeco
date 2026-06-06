import { useState, useEffect } from 'react';
import { ShoppingCart, DollarSign, Clock, Package } from 'lucide-react';
import { fetchTodayStats, fetchOrders } from '../../supabase/orders';
import { fetchProducts } from '../../supabase/products';
import { supabase } from '../../supabase/client';
import StatCard from '../components/StatCard';
import OrderStatusBadge from '../components/OrderStatusBadge';

export default function Dashboard() {
    const [stats, setStats] = useState({
        todayCount: 0,
        todayRevenue: 0,
        pendingCount: 0,
        activeProducts: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const [todayStats, ordersData, productsData] = await Promise.all([
                fetchTodayStats(),
                fetchOrders({ limit: 10, offset: 0 }),
                fetchProducts({ onlyActive: true, limit: 1000 }),
            ]);

            setStats({
                ...todayStats,
                activeProducts: productsData.total,
            });
            setRecentOrders(ordersData.orders);
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();

        const channel = supabase
            .channel('dashboard-orders')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'orders',
                },
                (payload) => {
                    loadData();
                    const order = payload.new;
                    alert(`Nouvelle commande recue — ${order.order_number}`);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    if (loading) {
        return <div className="font-sans text-[#9CA3AF]">Chargement...</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="font-serif text-[#1C2340]" style={{ fontSize: '28px', fontWeight: 600 }}>
                Tableau de bord
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Commandes aujourd'hui"
                    value={stats.todayCount}
                    icon={ShoppingCart}
                    color="#3B82F6"
                />
                <StatCard
                    title="Chiffre d'affaires du jour"
                    value={`${stats.todayRevenue.toLocaleString('fr-DZ')} DZD`}
                    icon={DollarSign}
                    color="#10B981"
                />
                <StatCard
                    title="Commandes en attente"
                    value={stats.pendingCount}
                    icon={Clock}
                    color="#F59E0B"
                />
                <StatCard
                    title="Total produits actifs"
                    value={stats.activeProducts}
                    icon={Package}
                    color="#8B5CF6"
                />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#F9D7DA]">
                <h3 className="font-serif text-[#1C2340] mb-4" style={{ fontSize: '20px', fontWeight: 600 }}>
                    Dernieres commandes
                </h3>

                {recentOrders.length === 0 ? (
                    <p className="font-sans text-[#9CA3AF]" style={{ fontSize: '14px' }}>
                        Aucune commande
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#F9D7DA]">
                                    <th className="text-left font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Numero
                                    </th>
                                    <th className="text-left font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Client
                                    </th>
                                    <th className="text-left font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Total
                                    </th>
                                    <th className="text-left font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Statut
                                    </th>
                                    <th className="text-left font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Wilaya
                                    </th>
                                    <th className="text-left font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-[#F9D7DA] last:border-0 hover:bg-[#FDE8EC] transition-colors">
                                        <td className="font-sans text-[#1C2340] py-3 px-2" style={{ fontSize: '14px' }}>
                                            {order.order_number}
                                        </td>
                                        <td className="font-sans text-[#1C2340] py-3 px-2" style={{ fontSize: '14px' }}>
                                            {order.customer_name}
                                        </td>
                                        <td className="font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '14px' }}>
                                            {parseFloat(order.total).toLocaleString('fr-DZ')} DZD
                                        </td>
                                        <td className="py-3 px-2">
                                            <OrderStatusBadge status={order.status} />
                                        </td>
                                        <td className="font-sans text-[#5A6080] py-3 px-2" style={{ fontSize: '14px' }}>
                                            {order.wilaya}
                                        </td>
                                        <td className="font-sans text-[#5A6080] py-3 px-2" style={{ fontSize: '14px' }}>
                                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
