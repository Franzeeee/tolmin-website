import React from 'react';
import { motion } from 'framer-motion';

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-[180px]">
            <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="mb-4"
            >
            <i className="fas fa-futbol fa-2x text-red-600" aria-label="Loading" />
            </motion.div>
            <motion.span
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="text-lg font-semibold text-red-600 tracking-wide"
            >
            Prosimo Počakajte...
            </motion.span>
        </div>
    )
}