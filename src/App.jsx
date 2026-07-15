import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { TourExperience } from './components/TourExperience.jsx';
import { LoadingOverlay } from './components/LoadingOverlay.jsx';

export default function App() {
  const [tour, setTour] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    fetch('/tour-config.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Unable to load tour configuration.');
        }
        return response.json();
      })
      .then((data) => {
        if (isMounted) {
          setTour(data);
        }
      })
      .catch((configError) => {
        if (isMounted) {
          setError(configError.message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-ink text-white">
      <AnimatePresence mode="wait">
        {!tour && !error ? (
          <LoadingOverlay key="loading" label="Preparing private tour" />
        ) : null}
      </AnimatePresence>

      {error ? (
        <motion.section
          className="grid min-h-screen place-items-center px-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="max-w-md rounded-lg border border-white/10 bg-white/8 p-8 shadow-glass backdrop-blur-2xl">
            <p className="text-xs uppercase tracking-[0.34em] text-brass">Vista360</p>
            <h1 className="mt-4 font-display text-4xl">Tour unavailable</h1>
            <p className="mt-3 text-sm leading-6 text-white/68">{error}</p>
          </div>
        </motion.section>
      ) : null}

      {tour ? <TourExperience tour={tour} /> : null}
    </main>
  );
}
