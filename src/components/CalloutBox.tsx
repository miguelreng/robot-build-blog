import React from 'react';

interface CalloutBoxProps {
    type?: 'info' | 'warning' | 'success' | 'insight' | 'important';
    title?: string;
    children: React.ReactNode;
}

export default function CalloutBox({ type = 'info', title, children }: CalloutBoxProps) {
    const isImportant = type === 'important';

    return (
        <div className={`my-6 px-5 py-3 rounded-[24px] border border-brand-gray-90/5 transition-all group ${isImportant ? 'bg-brand-yellow' : 'bg-[#edebe9]'
            }`}>
            <div className="min-w-0">
                {title && (
                    <h4 className="text-[15px] font-bold m-0 mb-1 text-brand-gray-90">
                        {title}
                    </h4>
                )}
                <div className={`text-[15px] leading-relaxed font-semibold whitespace-pre-wrap [&_p]:m-0 ${isImportant ? 'text-brand-gray-90' : 'text-brand-gray-90/60'
                    }`}>
                    {children}
                </div>
            </div>
        </div>
    );
}
