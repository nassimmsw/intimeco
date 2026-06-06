import { useState, useEffect } from 'react';
import { Search, Eye, Printer } from 'lucide-react';
import { fetchOrders, fetchOrderById, updateOrderStatus, updateOrderNotes } from '../../supabase/orders';
import OrderStatusBadge from '../components/OrderStatusBadge';

const WILAYAS = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Bejaia', 'Biskra', 'Bechar',
    'Blida', 'Bouira', 'Tamanrasset', 'Tebessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
    'Djelfa', 'Jijel', 'Setif', 'Saida', 'Skikda', 'Sidi Bel Abbes', 'Annaba', 'Guelma',
    'Constantine', 'Medea', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
    'Illizi', 'Bordj Bou Arreridj', 'Boumerdes', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
    'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Ain Defla', 'Naama', 'Ain Temouchent',
    'Ghardaia', 'Relizane',
];

function OrderDetailModal({ order, onClose, onStatusChange, onNotesChange }) {
    const [status, setStatus] = useState(order.status);
    const [notes, setNotes] = useState(order.notes || '');

    const handleStatusChange = async (newStatus) => {
        try {
            await updateOrderStatus(order.id, newStatus);
            setStatus(newStatus);
            onStatusChange(order.id, newStatus);
        } catch {
            alert('Erreur lors de la mise a jour du statut');
        }
    };

    const handleNotesSave = async () => {
        try {
            await updateOrderNotes(order.id, notes);
            onNotesChange(order.id, notes);
            alert('Notes enregistrees');
        } catch {
            alert('Erreur lors de la sauvegarde des notes');
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
      <html>
        <head>
          <title>Bon de livraison - ${order.order_number}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { font-size: 24px; margin-bottom: 10px; }
            h2 { font-size: 18px; margin: 20px 0 10px; border-bottom: 2px solid #000; padding-bottom: 5px; }
            p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background: #f0f0f0; }
            .total { font-weight: bold; font-size: 16px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>INTIME & CO</h1>
          <p>Bon de livraison</p>
          <p>Commande: ${order.order_number}</p>
          <p>Date: ${new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
          
          <h2>Client</h2>
          <p><strong>Nom:</strong> ${order.customer_name}</p>
          <p><strong>Telephone:</strong> ${order.customer_phone}</p>
          <p><strong>Adresse:</strong> ${order.address}</p>
          <p><strong>Commune:</strong> ${order.commune}</p>
          <p><strong>Wilaya:</strong> ${order.wilaya}</p>
          
          <h2>Articles</h2>
          <table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Taille</th>
                <th>Couleur</th>
                <th>Qte</th>
                <th>Prix unitaire</th>
                <th>Sous-total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((item) => `
                <tr>
                  <td>${item.product_name}</td>
                  <td>${item.size || '-'}</td>
                  <td>${item.color || '-'}</td>
                  <td>${item.quantity}</td>
                  <td>${parseFloat(item.product_price).toLocaleString('fr-DZ')} DZD</td>
                  <td>${parseFloat(item.subtotal).toLocaleString('fr-DZ')} DZD</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <h2>Totaux</h2>
          <p>Sous-total: ${parseFloat(order.subtotal).toLocaleString('fr-DZ')} DZD</p>
          ${order.discount_amount > 0 ? `<p>Reduction: -${parseFloat(order.discount_amount).toLocaleString('fr-DZ')} DZD</p>` : ''}
          <p class="total">Total: ${parseFloat(order.total).toLocaleString('fr-DZ')} DZD</p>
          <p><strong>Mode de paiement:</strong> ${order.payment_method}</p>
          
          <script>window.print(); window.onafterprint = function() { window.close(); };</script>
        </body>
      </html>
    `);
        printWindow.document.close();
    };

    return (
        <>
            <div className="fixed inset-0 z-50 bg-[#1C2340]/40" onClick={onClose} style={{ backdropFilter: 'blur(2px)' }} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-xl my-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-serif text-[#1C2340]" style={{ fontSize: '24px', fontWeight: 600 }}>
                            Commande {order.order_number}
                        </h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#EBB4BB] font-sans text-[#1C2340] hover:bg-[#FDE8EC] transition-colors"
                                style={{ fontSize: '14px' }}
                            >
                                <Printer size={16} strokeWidth={1.8} />
                                Imprimer
                            </button>
                            <button onClick={onClose} className="font-sans text-[#1C2340] underline" style={{ fontSize: '14px' }}>
                                Fermer
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="font-sans font-semibold text-[#1C2340] mb-3" style={{ fontSize: '16px' }}>
                                Statut de la commande
                            </h4>
                            <select
                                value={status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                className="w-full border border-[#EBB4BB] rounded-lg px-4 py-2 font-sans text-[#1C2340] outline-none focus:border-[#1C2340]"
                                style={{ fontSize: '14px' }}
                            >
                                <option value="en_attente">En attente</option>
                                <option value="confirme">Confirme</option>
                                <option value="en_preparation">En preparation</option>
                                <option value="expedie">Expedie</option>
                                <option value="livre">Livre</option>
                                <option value="annule">Annule</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-[#FDE8EC] rounded-lg p-4">
                                <h4 className="font-sans font-semibold text-[#1C2340] mb-2" style={{ fontSize: '14px' }}>
                                    Informations client
                                </h4>
                                <div className="space-y-1 font-sans text-[#5A6080]" style={{ fontSize: '13px' }}>
                                    <p><strong>Nom:</strong> {order.customer_name}</p>
                                    <p><strong>Telephone:</strong> {order.customer_phone}</p>
                                </div>
                            </div>

                            <div className="bg-[#FDE8EC] rounded-lg p-4">
                                <h4 className="font-sans font-semibold text-[#1C2340] mb-2" style={{ fontSize: '14px' }}>
                                    Livraison
                                </h4>
                                <div className="space-y-1 font-sans text-[#5A6080]" style={{ fontSize: '13px' }}>
                                    <p><strong>Adresse:</strong> {order.address}</p>
                                    <p><strong>Commune:</strong> {order.commune}</p>
                                    <p><strong>Wilaya:</strong> {order.wilaya}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-sans font-semibold text-[#1C2340] mb-3" style={{ fontSize: '16px' }}>
                                Articles commandes
                            </h4>
                            <div className="border border-[#F9D7DA] rounded-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-[#FDE8EC]">
                                        <tr>
                                            <th className="text-left font-sans font-semibold text-[#1C2340] py-2 px-3" style={{ fontSize: '13px' }}>
                                                Produit
                                            </th>
                                            <th className="text-left font-sans font-semibold text-[#1C2340] py-2 px-3" style={{ fontSize: '13px' }}>
                                                Taille
                                            </th>
                                            <th className="text-left font-sans font-semibold text-[#1C2340] py-2 px-3" style={{ fontSize: '13px' }}>
                                                Couleur
                                            </th>
                                            <th className="text-left font-sans font-semibold text-[#1C2340] py-2 px-3" style={{ fontSize: '13px' }}>
                                                Qte
                                            </th>
                                            <th className="text-right font-sans font-semibold text-[#1C2340] py-2 px-3" style={{ fontSize: '13px' }}>
                                                Prix
                                            </th>
                                            <th className="text-right font-sans font-semibold text-[#1C2340] py-2 px-3" style={{ fontSize: '13px' }}>
                                                Sous-total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item) => (
                                            <tr key={item.id} className="border-t border-[#F9D7DA]">
                                                <td className="font-sans text-[#1C2340] py-2 px-3" style={{ fontSize: '14px' }}>
                                                    {item.product_name}
                                                </td>
                                                <td className="font-sans text-[#5A6080] py-2 px-3" style={{ fontSize: '14px' }}>
                                                    {item.size || '-'}
                                                </td>
                                                <td className="font-sans text-[#5A6080] py-2 px-3" style={{ fontSize: '14px' }}>
                                                    {item.color || '-'}
                                                </td>
                                                <td className="font-sans text-[#5A6080] py-2 px-3" style={{ fontSize: '14px' }}>
                                                    {item.quantity}
                                                </td>
                                                <td className="font-sans text-right text-[#5A6080] py-2 px-3" style={{ fontSize: '14px' }}>
                                                    {parseFloat(item.product_price).toLocaleString('fr-DZ')} DZD
                                                </td>
                                                <td className="font-sans font-semibold text-right text-[#1C2340] py-2 px-3" style={{ fontSize: '14px' }}>
                                                    {parseFloat(item.subtotal).toLocaleString('fr-DZ')} DZD
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-[#FDE8EC] rounded-lg p-4 space-y-2">
                            <div className="flex justify-between font-sans text-[#5A6080]" style={{ fontSize: '14px' }}>
                                <span>Sous-total</span>
                                <span>{parseFloat(order.subtotal).toLocaleString('fr-DZ')} DZD</span>
                            </div>
                            {order.discount_amount > 0 && (
                                <div className="flex justify-between font-sans text-[#E63946]" style={{ fontSize: '14px' }}>
                                    <span>Reduction ({order.promo_code})</span>
                                    <span>-{parseFloat(order.discount_amount).toLocaleString('fr-DZ')} DZD</span>
                                </div>
                            )}
                            <div className="flex justify-between font-sans font-bold text-[#1C2340] border-t border-[#EBB4BB] pt-2" style={{ fontSize: '18px' }}>
                                <span>Total</span>
                                <span>{parseFloat(order.total).toLocaleString('fr-DZ')} DZD</span>
                            </div>
                            <p className="font-sans text-[#5A6080]" style={{ fontSize: '13px' }}>
                                <strong>Paiement:</strong> {order.payment_method}
                            </p>
                        </div>

                        <div>
                            <h4 className="font-sans font-semibold text-[#1C2340] mb-2" style={{ fontSize: '14px' }}>
                                Notes internes
                            </h4>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                                className="w-full border border-[#EBB4BB] rounded-lg px-4 py-3 font-sans text-[#1C2340] outline-none focus:border-[#1C2340] resize-none"
                                style={{ fontSize: '14px' }}
                                placeholder="Notes pour usage interne..."
                            />
                            <button
                                onClick={handleNotesSave}
                                className="mt-2 px-4 py-2 bg-[#1C2340] text-white font-sans font-semibold rounded-full hover:bg-[#2D375F] transition-colors"
                                style={{ fontSize: '13px' }}
                            >
                                Enregistrer les notes
                            </button>
                        </div>

                        <p className="font-sans text-[#9CA3AF] text-center" style={{ fontSize: '12px' }}>
                            Commande creee le {new Date(order.created_at).toLocaleString('fr-FR')}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('tous');
    const [wilayaFilter, setWilayaFilter] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const loadOrders = async () => {
        try {
            const data = await fetchOrders({
                status: statusFilter,
                wilaya: wilayaFilter || null,
                searchQuery: searchQuery || null,
            });
            setOrders(data.orders);
        } catch (error) {
            console.error('Erreur lors du chargement des commandes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, [statusFilter, wilayaFilter]);

    const handleSearch = (e) => {
        e.preventDefault();
        loadOrders();
    };

    const handleViewOrder = async (orderId) => {
        try {
            const order = await fetchOrderById(orderId);
            setSelectedOrder(order);
        } catch {
            alert('Erreur lors du chargement de la commande');
        }
    };

    const handleStatusChange = (orderId, newStatus) => {
        setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder?.id === orderId) {
            setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
        }
    };

    const handleNotesChange = (orderId, newNotes) => {
        if (selectedOrder?.id === orderId) {
            setSelectedOrder((prev) => ({ ...prev, notes: newNotes }));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="font-serif text-[#1C2340]" style={{ fontSize: '28px', fontWeight: 600 }}>
                    Commandes
                </h2>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#F9D7DA]">
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                                size={18}
                                color="#9CA3AF"
                                strokeWidth={1.8}
                            />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher par numero, nom ou telephone..."
                                className="w-full border border-[#EBB4BB] rounded-full pl-10 pr-4 py-2 font-sans text-[#1C2340] outline-none focus:border-[#1C2340]"
                                style={{ fontSize: '14px' }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#1C2340] text-white font-sans font-semibold rounded-full hover:bg-[#2D375F] transition-colors"
                            style={{ fontSize: '14px' }}
                        >
                            Rechercher
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="flex-1 border border-[#EBB4BB] rounded-lg px-4 py-2 font-sans text-[#1C2340] outline-none focus:border-[#1C2340]"
                            style={{ fontSize: '14px' }}
                        >
                            <option value="tous">Tous les statuts</option>
                            <option value="en_attente">En attente</option>
                            <option value="confirme">Confirme</option>
                            <option value="en_preparation">En preparation</option>
                            <option value="expedie">Expedie</option>
                            <option value="livre">Livre</option>
                            <option value="annule">Annule</option>
                        </select>

                        <select
                            value={wilayaFilter}
                            onChange={(e) => setWilayaFilter(e.target.value)}
                            className="flex-1 border border-[#EBB4BB] rounded-lg px-4 py-2 font-sans text-[#1C2340] outline-none focus:border-[#1C2340]"
                            style={{ fontSize: '14px' }}
                        >
                            <option value="">Toutes les wilayas</option>
                            {WILAYAS.map((w) => (
                                <option key={w} value={w}>
                                    {w}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#F9D7DA]">
                {loading ? (
                    <p className="font-sans text-[#9CA3AF]">Chargement...</p>
                ) : orders.length === 0 ? (
                    <p className="font-sans text-[#9CA3AF]">Aucune commande trouvee</p>
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
                                        Telephone
                                    </th>
                                    <th className="text-left font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Wilaya
                                    </th>
                                    <th className="text-right font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Total
                                    </th>
                                    <th className="text-left font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Paiement
                                    </th>
                                    <th className="text-left font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Statut
                                    </th>
                                    <th className="text-left font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Date
                                    </th>
                                    <th className="text-center font-sans font-semibold text-[#1C2340] py-3 px-2" style={{ fontSize: '13px' }}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="border-b border-[#F9D7DA] last:border-0 hover:bg-[#FDE8EC] transition-colors">
                                        <td className="font-sans text-[#1C2340] py-3 px-2" style={{ fontSize: '14px' }}>
                                            {order.order_number}
                                        </td>
                                        <td className="font-sans text-[#1C2340] py-3 px-2" style={{ fontSize: '14px' }}>
                                            {order.customer_name}
                                        </td>
                                        <td className="font-sans text-[#5A6080] py-3 px-2" style={{ fontSize: '14px' }}>
                                            {order.customer_phone}
                                        </td>
                                        <td className="font-sans text-[#5A6080] py-3 px-2" style={{ fontSize: '14px' }}>
                                            {order.wilaya}
                                        </td>
                                        <td className="font-sans font-semibold text-right text-[#1C2340] py-3 px-2" style={{ fontSize: '14px' }}>
                                            {parseFloat(order.total).toLocaleString('fr-DZ')} DZD
                                        </td>
                                        <td className="font-sans text-[#5A6080] py-3 px-2" style={{ fontSize: '13px' }}>
                                            {order.payment_method}
                                        </td>
                                        <td className="py-3 px-2">
                                            <OrderStatusBadge status={order.status} />
                                        </td>
                                        <td className="font-sans text-[#5A6080] py-3 px-2" style={{ fontSize: '14px' }}>
                                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="text-center py-3 px-2">
                                            <button
                                                onClick={() => handleViewOrder(order.id)}
                                                className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-[#EBB4BB] font-sans text-[#1C2340] hover:bg-[#FDE8EC] transition-colors"
                                                style={{ fontSize: '13px' }}
                                            >
                                                <Eye size={14} strokeWidth={1.8} />
                                                Voir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusChange={handleStatusChange}
                    onNotesChange={handleNotesChange}
                />
            )}
        </div>
    );
}
