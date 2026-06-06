
const STATUS_CONFIG = {
    en_attente: { label: 'En attente', color: '#F59E0B', bg: '#FEF3C7' },
    confirme: { label: 'Confirme', color: '#3B82F6', bg: '#DBEAFE' },
    en_preparation: { label: 'En preparation', color: '#8B5CF6', bg: '#EDE9FE' },
    expedie: { label: 'Expedie', color: '#F97316', bg: '#FFEDD5' },
    livre: { label: 'Livre', color: '#10B981', bg: '#D1FAE5' },
    annule: { label: 'Annule', color: '#EF4444', bg: '#FEE2E2' },
};

export default function OrderStatusBadge({ status }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.en_attente;

    return (
        <span
            className="inline-block px-3 py-1 rounded-full font-sans font-semibold"
            style={{
                fontSize: '12px',
                color: config.color,
                background: config.bg,
            }}
        >
            {config.label}
        </span>
    );
}
