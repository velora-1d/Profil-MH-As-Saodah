'use client';

import { motion } from 'framer-motion';

interface SectionHeadingProps {
    badge?: string;
    title: string;
    subtitle?: string;
    center?: boolean;
    light?: boolean;
}

export default function SectionHeading({ badge, title, subtitle, center = true, light = false }: SectionHeadingProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
            className={`max-w-2xl ${center ? 'mx-auto text-center' : ''} mb-12`}
        >
            {badge && (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 uppercase tracking-widest mb-4">
                    {badge}
                </span>
            )}
            <h2 className={`text-3xl lg:text-4xl font-black tracking-tight leading-tight ${light ? 'text-white' : 'text-slate-900'}`}>
                {title}
            </h2>
            {subtitle && (
                <p className={`mt-4 text-base leading-relaxed ${light ? 'text-white/70' : 'text-slate-500'}`}>
                    {subtitle}
                </p>
            )}
        </motion.div>
    );
}
