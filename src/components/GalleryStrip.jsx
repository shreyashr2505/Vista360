import { motion } from 'framer-motion';

export function GalleryStrip({ rooms, activeRoomId, onRoomChange }) {
  return (
    <motion.div
      className="thumbnail-rail"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.18, duration: 0.25 }}
    >
      {rooms.map((room) => (
        <button
          key={room.id}
          type="button"
          className={room.id === activeRoomId ? 'is-active' : ''}
          onClick={() => onRoomChange(room.id)}
          title={room.title}
        >
          <img src={room.thumbnail} alt="" loading="lazy" />
          <span>{room.title}</span>
        </button>
      ))}
    </motion.div>
  );
}
