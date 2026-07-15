import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Grid3X3, Map, Rotate3D, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ControlDock } from './ControlDock.jsx';
import { FloorPlan } from './FloorPlan.jsx';
import { GalleryStrip } from './GalleryStrip.jsx';
import { PanoramaViewer } from './PanoramaViewer.jsx';
import { RoomSidebar } from './RoomSidebar.jsx';

export function TourExperience({ tour }) {
  const [activeRoomId, setActiveRoomId] = useState(tour.rooms[0]?.id);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mapExpanded, setMapExpanded] = useState(false);
  const [planMode, setPlanMode] = useState('2d');
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isGyroscopeEnabled, setIsGyroscopeEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomIntent, setZoomIntent] = useState(null);

  const activeRoom = useMemo(
    () => tour.rooms.find((room) => room.id === activeRoomId) ?? tour.rooms[0],
    [activeRoomId, tour.rooms],
  );

  const activeIndex = tour.rooms.findIndex((room) => room.id === activeRoom.id);
  const previousRoom = tour.rooms[(activeIndex - 1 + tour.rooms.length) % tour.rooms.length];
  const nextRoom = tour.rooms[(activeIndex + 1) % tour.rooms.length];

  const setRoom = (id) => {
    setActiveRoomId(id);
    setMapExpanded(false);
  };

  return (
    <section className="widget-application">
      <PanoramaViewer
        room={activeRoom}
        rooms={tour.rooms}
        onRoomChange={setRoom}
        isAutoRotating={isAutoRotating}
        isGyroscopeEnabled={isGyroscopeEnabled}
        zoomIntent={zoomIntent}
        onZoomHandled={() => setZoomIntent(null)}
      />

      <div className="viewer-vignette" />

      <motion.header
        className="tour-header"
        initial={{ y: -14, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      >
        <div>
          <span>Virtual apartment tour</span>
          <strong>{activeRoom.title}</strong>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen((value) => !value)}
          title={sidebarOpen ? 'Hide rooms' : 'Show rooms'}
          aria-label={sidebarOpen ? 'Hide rooms' : 'Show rooms'}
        >
          <Search size={17} />
        </button>
      </motion.header>

      <AnimatePresence>
        {sidebarOpen ? (
          <RoomSidebar
            key="sidebar"
            rooms={tour.rooms}
            activeRoomId={activeRoom.id}
            onRoomChange={setRoom}
            property={tour.property}
          />
        ) : null}
      </AnimatePresence>

      <motion.div
        className={`multimap ${mapExpanded ? 'multimap--expanded' : ''}`}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.12, duration: 0.25 }}
      >
        <FloorPlan
          rooms={tour.rooms}
          activeRoomId={activeRoom.id}
          onRoomChange={setRoom}
          floorPlans={tour.floorPlans}
          mode={planMode}
          onModeChange={setPlanMode}
          expanded={mapExpanded}
        />
        <button
          type="button"
          className="multimap__toggle"
          onClick={() => setMapExpanded((value) => !value)}
          title={mapExpanded ? 'Collapse plan' : 'Expand plan'}
          aria-label={mapExpanded ? 'Collapse plan' : 'Expand plan'}
        >
          <Grid3X3 size={18} />
        </button>
      </motion.div>

      <div className="widget-tab-button-group">
        <button
          type="button"
          className={`widget-tab-button ${planMode === '2d' ? 'widget-tab-button--active' : ''}`}
          onClick={() => {
            setPlanMode('2d');
            setMapExpanded(true);
          }}
          title="2D floor plan"
        >
          <Map size={24} />
        </button>
        <button
          type="button"
          className={`widget-tab-button ${planMode === '3d' ? 'widget-tab-button--active' : ''}`}
          onClick={() => {
            setPlanMode('3d');
            setMapExpanded(true);
          }}
          title="3D floor plan"
        >
          <Grid3X3 size={24} />
        </button>
        <button
          type="button"
          className={`widget-tab-button ${isAutoRotating ? 'widget-tab-button--active' : ''}`}
          onClick={() => setIsAutoRotating((value) => !value)}
          title="Auto rotate"
        >
          <Rotate3D size={24} />
        </button>
      </div>

      <GalleryStrip rooms={tour.rooms} activeRoomId={activeRoom.id} onRoomChange={setRoom} />

      <ControlDock
        isAutoRotating={isAutoRotating}
        isFullscreen={isFullscreen}
        isGyroscopeEnabled={isGyroscopeEnabled}
        onToggleRotate={() => setIsAutoRotating((value) => !value)}
        onToggleGyroscope={() => setIsGyroscopeEnabled((value) => !value)}
        onZoomIn={() => setZoomIntent('in')}
        onZoomOut={() => setZoomIntent('out')}
        onToggleFullscreen={() => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen?.();
            setIsFullscreen(true);
          } else {
            document.exitFullscreen?.();
            setIsFullscreen(false);
          }
        }}
      />

      <div className="room-stepper">
        <button type="button" onClick={() => setRoom(previousRoom.id)} title={previousRoom.title}>
          <ChevronLeft size={18} />
          <span>{previousRoom.title}</span>
        </button>
        <button type="button" onClick={() => setRoom(nextRoom.id)} title={nextRoom.title}>
          <span>{nextRoom.title}</span>
          <ChevronRight size={18} />
        </button>
      </div>

      <motion.div
        className="room-caption"
        key={activeRoom.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
      >
        <span>{activeRoom.level}</span>
        <h1>{activeRoom.title}</h1>
        <p>{activeRoom.description}</p>
      </motion.div>
    </section>
  );
}
