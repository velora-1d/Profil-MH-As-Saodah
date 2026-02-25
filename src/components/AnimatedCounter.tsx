'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedCounterProps {
    end: number;
    suffix?: string;
    duration?: number;
    label: string;
    icon?: React.ReactNode;
}

export default function AnimatedCounter({ end, suffix = '', duration = 2, label, icon }: AnimatedCounterProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        let startTime: number;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            // easeOutExpo for smooth deceleration
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [isInView, end, duration]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="group relative text-center p-6"
        >
            {icon && (
                <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                    {icon}
                </div>
            )}
            <p className="text-4xl lg:text-5xl font-black text-gradient-primary tracking-tight">
                {count}{suffix}
            </p>
            <p className="mt-1.5 text-xs font-bold text-slate-500 uppercase tracking-[0.15em]">
                {label}
            </p>
        </motion.div>
    );
}
