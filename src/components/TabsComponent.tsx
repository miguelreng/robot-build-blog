import React, { useState } from 'react';

interface Tab {
    id: string;
    label: string;
    content: React.ReactNode;
}

interface TabsComponentProps {
    tabs: Tab[];
    defaultTab?: string;
    legend?: string;
}

export default function TabsComponent({ tabs, defaultTab, legend }: TabsComponentProps) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

    return (
        <div className="my-6 w-full">
            {/* Tab Headers */}
            <div className="flex gap-2 border-b border-brand-gray-90/10 mb-4 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-3 text-[14px] font-bold tracking-normal transition-all whitespace-nowrap uppercase ${activeTab === tab.id
                            ? 'text-brand-gray-90 border-b-2 border-brand-gray-90'
                            : 'text-brand-gray-90/50 hover:text-brand-gray-90/70'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div>
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={`${activeTab === tab.id ? 'block' : 'hidden'} animate-fadeIn`}
                    >
                        {tab.content}
                    </div>
                ))}
            </div>

            {legend && (
                <div className="mt-6 flex items-center gap-3 px-2 border-t border-brand-gray-90/5 pt-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gray-90/20" />
                    <p className="text-[13px] tracking-normal font-bold text-brand-black">
                        {legend}
                    </p>
                </div>
            )}
        </div>
    );
}
