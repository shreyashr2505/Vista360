import { motion } from 'framer-motion';
import { Maximize2 } from 'lucide-react';

export function FloorPlan({
  rooms,
  activeRoomId,
  onRoomChange,
  floorPlans,
  mode,
  onModeChange,
  expanded = false,
}) {
  const activeRoom = rooms.find((room) => room.id === activeRoomId);
  const image = mode === '3d' ? floorPlans.threeD : floorPlans.twoD;

  return (
    <motion.div
      className={`map-card ${expanded ? 'map-card--expanded' : ''}`}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <div className="map-card__tabs">
        <button
          type="button"
          className={mode === '2d' ? 'is-active' : ''}
          onClick={() => onModeChange('2d')}
        >
          2D
        </button>
        <button
          type="button"
          className={mode === '3d' ? 'is-active' : ''}
          onClick={() => onModeChange('3d')}
        >
          3D
        </button>
      </div>

      <div className="map-card__stage">
        <img src={image} alt={mode === '3d' ? '3D floor plan' : '2D floor plan'} />

        {mode === '2d'
          ? rooms.map((room) => {
              const isActive = room.id === activeRoomId;
              return (
                <button
                  key={room.id}
                  type="button"
                  className={`map-hotspot ${isActive ? 'map-hotspot--active' : ''}`}
                  style={{ left: `${room.position.x}%`, top: `${room.position.y}%` }}
                  onClick={() => onRoomChange(room.id)}
                  title={room.title}
                  aria-label={`Open ${room.title}`}
                >
                  <span />
                </button>
              );
            })
          : null}
      </div>

      <div className="map-card__footer">
        <span>{mode === '2d' ? activeRoom?.title : '3D overview'}</span>
        <Maximize2 size={14} />
      </div>
    </motion.div>
  );
}
