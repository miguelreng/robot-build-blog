import React from 'react';

interface MetricCardProps {
    value: string | number; // e.g. "1.7M"
    label: string;          // e.g. "Tasks completed"
    description?: string;   // e.g. "In 2025"
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    legend?: string;
}

export default function MetricCard({ value, label, description, legend }: MetricCardProps) {
    return (
        <div className="flex flex-col gap-4">
            <div
                className="bg-white rounded-[24px] p-6 flex flex-col justify-between border border-brand-gray-90/5 min-h-[180px]"
            >
                <div className="mb-auto">
                    <h2 className="text-[17px] font-bold text-brand-gray-90 leading-tight m-0">
                        {label}
                    </h2>
                </div>

                <div className="flex flex-col gap-0">
                    {description && (
                        <p className="text-brand-gray-90/30 text-[13px] font-semibold m-0 leading-none mb-1">
                            {description}
                        </p>
                    )}
                    <div className="text-[34px] font-bold text-brand-gray-90 leading-none">
                        {value}
                    </div>
                </div>
            </div>

            {legend && (
                <div className="flex items-center gap-3 px-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-black/30" />
                    <p className="text-[11px] font-bold text-brand-black font-mono uppercase">
                        {legend}
                    </p>
                </div>
            )}
        </div>
    );
}
