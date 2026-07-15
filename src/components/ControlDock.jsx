import { Compass, Expand, Minus, Pause, Play, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export function ControlDock({
  isAutoRotating,
  isFullscreen,
  isGyroscopeEnabled,
  onToggleRotate,
  onToggleGyroscope,
  onZoomIn,
  onZoomOut,
  onToggleFullscreen,
}) {
  const controls = [
    { label: 'Zoom in', icon: Plus, action: onZoomIn },
    { label: 'Zoom out', icon: Minus, action: onZoomOut },
    { label: isAutoRotating ? 'Pause auto rotate' : 'Start auto rotate', icon: isAutoRotating ? Pause : Play, action: onToggleRotate },
    { label: isGyroscopeEnabled ? 'Disable gyroscope' : 'Enable gyroscope', icon: Compass, action: onToggleGyroscope },
    { label: isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen', icon: Expand, action: onToggleFullscreen },
  ];

  return (
    <motion.div
      className="float-controls"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.16, duration: 0.25 }}
    >
      {controls.map((control) => {
        const Icon = control.icon;
        return (
          <button
            key={control.label}
            type="button"
            onClick={control.action}
            aria-label={control.label}
            title={control.label}
          >
            <Icon size={20} />
          </button>
        );
      })}
    </motion.div>
  );
}
