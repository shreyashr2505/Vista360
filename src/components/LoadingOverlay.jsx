import { motion } from 'framer-motion';

export function LoadingOverlay({ label, compact = false }) {
  return (
    <motion.div
      className={`pointer-events-none absolute inset-0 z-50 grid place-items-center bg-ink/76 backdrop-blur-xl ${compact ? '' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <div className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-white/12 bg-white/8 shadow-glass">
          <motion.span
            className="block h-9 w-9 rounded-full border-2 border-white/18 border-t-brass"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.85, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.34em] text-white/62">{label}</p>
      </div>
    </motion.div>
  );
}
