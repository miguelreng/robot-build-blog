import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Builder {
    name: string;
    role: string;
    github?: string;
    department: string;
}

interface TeamTooltipProps {
    teamName: string;
    builders: Builder[];
}

export const TeamTooltip: React.FC<TeamTooltipProps> = ({ teamName, builders }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="text-[14px] font-medium text-brand-gray-90 cursor-help border-b border-dotted border-brand-gray-90/20 hover:border-brand-gray-90/40 transition-colors w-fit">
                {teamName}
            </div>

            <AnimatePresence>
                {isHovered && builders.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute z-[100] bottom-full left-1/2 -translate-x-1/2 mb-3 min-w-[140px] w-fit whitespace-nowrap bg-white/95 backdrop-blur-xl border border-brand-gray-90/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-3 overflow-hidden"
                    >
                        <div className="flex flex-col gap-2">
                            {builders.map((builder, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="text-sm font-semibold text-brand-gray-90/70 truncate hover:text-brand-gray-90 transition-colors"
                                >
                                    {builder.name}
                                </motion.div>
                            ))}
                        </div>
                        {/* Soft decorative element */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-yellow/5 rounded-full -mr-12 -mt-12 blur-2xl pointer-events-none"></div>

                        {/* Arrow */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/95 rotate-45 border-r border-b border-brand-gray-90/10 shadow-[2px_2px_5px_rgba(0,0,0,0.02)]"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
