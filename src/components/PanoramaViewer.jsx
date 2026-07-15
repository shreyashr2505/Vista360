import { AutorotatePlugin } from '@photo-sphere-viewer/autorotate-plugin';
import { Viewer } from '@photo-sphere-viewer/core';
import { GyroscopePlugin } from '@photo-sphere-viewer/gyroscope-plugin';
import { AnimatePresence, motion } from 'framer-motion';
import { MoveUpRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LoadingOverlay } from './LoadingOverlay.jsx';

export function PanoramaViewer({
  room,
  rooms,
  onRoomChange,
  isAutoRotating,
  isGyroscopeEnabled,
  zoomIntent,
  onZoomHandled,
}) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const autorotateRef = useRef(null);
  const gyroscopeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const roomMap = useMemo(() => new Map(rooms.map((item) => [item.id, item])), [rooms]);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    setIsLoading(true);
    setHasError(false);

    const viewer = new Viewer({
      container: containerRef.current,
      panorama: room.image,
      caption: room.title,
      navbar: false,
      defaultYaw: room.yaw ?? 0,
      defaultPitch: 0,
      defaultZoomLvl: 34,
      minFov: 35,
      maxFov: 95,
      mousewheelCtrlKey: false,
      touchmoveTwoFingers: false,
      loadingImg: null,
      moveSpeed: 1.15,
      zoomSpeed: 1.2,
      plugins: [
        [
          AutorotatePlugin,
          {
            autostartDelay: 1200,
            autorotateSpeed: '0.55rpm',
          },
        ],
        [GyroscopePlugin],
      ],
    });

    viewerRef.current = viewer;
    autorotateRef.current = viewer.getPlugin(AutorotatePlugin);
    gyroscopeRef.current = viewer.getPlugin(GyroscopePlugin);

    const handleReady = () => {
      setIsLoading(false);
    };

    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    viewer.addEventListener('ready', handleReady, { once: true });
    viewer.addEventListener('panorama-error', handleError);
    const loadingFallback = window.setTimeout(() => setIsLoading(false), 1800);

    const resizeObserver = new ResizeObserver(() => viewer.autoSize());
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      window.clearTimeout(loadingFallback);
      viewer.destroy();
      viewerRef.current = null;
      autorotateRef.current = null;
      gyroscopeRef.current = null;
    };
  }, [room.id, room.image, room.title, room.yaw]);

  useEffect(() => {
    if (!autorotateRef.current) {
      return;
    }

    if (isAutoRotating) {
      autorotateRef.current.start();
    } else {
      autorotateRef.current.stop();
    }
  }, [isAutoRotating, room.id]);

  useEffect(() => {
    if (!gyroscopeRef.current) {
      return;
    }

    if (isGyroscopeEnabled) {
      gyroscopeRef.current.start().catch(() => {});
    } else {
      gyroscopeRef.current.stop();
    }
  }, [isGyroscopeEnabled, room.id]);

  useEffect(() => {
    if (!zoomIntent || !viewerRef.current) {
      return;
    }

    const currentZoom = viewerRef.current.getZoomLevel();
    viewerRef.current.zoom(Math.max(0, Math.min(100, currentZoom + (zoomIntent === 'in' ? 10 : -10))));
    onZoomHandled();
  }, [zoomIntent, onZoomHandled]);

  return (
    <div className="panorama-shell">
      <motion.div
        key={room.id}
        ref={containerRef}
        className={`panorama-stage ${isLoading ? 'panorama-stage--loading' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.28 }}
      />

      <AnimatePresence>
        {isLoading ? <LoadingOverlay key="viewer-loading" label={`Loading ${room.title}`} compact /> : null}
      </AnimatePresence>

      {hasError ? (
        <div className="viewer-error">
          <p>Panorama unavailable</p>
          <span>{room.title}</span>
        </div>
      ) : null}

      <div className="connection-dock">
        {room.connections.map((id) => {
          const target = roomMap.get(id);
          if (!target) return null;
          return (
            <motion.button
              key={id}
              type="button"
              onClick={() => onRoomChange(id)}
              whileTap={{ scale: 0.96 }}
              title={target.title}
            >
              <MoveUpRight size={15} />
              <span>{target.title}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
