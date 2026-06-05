import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = '#1C2340' }) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#F9D7DA]">
            <div className="flex items-center justify-between mb-3">
                <p className="font-sans text-[#9CA3AF]" style={{ fontSize: '14px' }}>
                    {title}
                </p>
                {Icon && <Icon size={20} color={color} strokeWidth={1.8} />}
            </div>
            <p className="font-serif font-bold text-[#1C2340]" style={{ fontSize: '32px' }}>
                {value}
            </p>
        </div>
    );
}
