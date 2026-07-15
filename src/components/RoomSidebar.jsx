import { motion } from 'framer-motion';
import { Bath, BedDouble, DoorOpen, Home, Search, Sofa, Trees, UtensilsCrossed } from 'lucide-react';
import { useMemo, useState } from 'react';

const iconMap = {
  entrance: DoorOpen,
  hallway: Home,
  'living-room': Sofa,
  kitchen: UtensilsCrossed,
  'bedroom-1': BedDouble,
  'bedroom-2': BedDouble,
  bathroom: Bath,
  terrace: Trees,
};

export function RoomSidebar({ rooms, activeRoomId, onRoomChange, property }) {
  const [query, setQuery] = useState('');
  const filteredRooms = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return rooms;
    return rooms.filter((room) => room.title.toLowerCase().includes(normalized));
  }, [query, rooms]);

  return (
    <motion.aside
      className="room-sidebar"
      initial={{ x: -18, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -18, opacity: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <div className="room-sidebar__brand">
        <span>{property.price}</span>
        <strong>{property.name}</strong>
        <p>{property.area} · {property.rooms}</p>
      </div>

      <label className="room-search">
        <Search size={15} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search room"
          aria-label="Search room"
        />
      </label>

      <div className="room-list">
        {filteredRooms.map((room) => {
          const Icon = iconMap[room.id] ?? Home;
          const isActive = room.id === activeRoomId;

          return (
            <button
              key={room.id}
              type="button"
              className={`room-card ${isActive ? 'room-card--active' : ''}`}
              onClick={() => onRoomChange(room.id)}
            >
              <img src={room.thumbnail} alt="" loading="lazy" />
              <span className="room-card__icon">
                <Icon size={16} />
              </span>
              <span>
                <small>{room.level}</small>
                <strong>{room.title}</strong>
              </span>
            </button>
          );
        })}
      </div>
    </motion.aside>
  );
}
