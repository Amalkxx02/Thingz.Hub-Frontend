import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { thingService } from '../../services/thingService';
import { useTheme, useToast } from '../../context';
import ThingCard from './Things/Cards/ThingCard';
import ThingRegistrationModal from './Things/ThingRegistrationModal';

const HomeManager = () => {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [allThings, setAllThings] = useState([]);
  const [devices, setDevices] = useState([]);
  const [editingThing, setEditingThing] = useState(null);

  const fetchThings = useCallback(async (force = false) => {
    try {
      setLoading(true);
      const data = await thingService.getThingzWithMeta(force);
      setAllThings(data);
      
      const cache = localStorage.getItem('hub_node_inventory');
      setDevices(cache ? JSON.parse(cache) : []);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchThings();
  }, [fetchThings]);

  // Grouping Logic: Built from the Perspective of Mapped Entities
  const groupedThings = useMemo(() => {
    const groups = {};
    const inventory = devices || [];

    allThings.forEach(t => {
      const devId = t.device_id || t.deviceId || 'ORPHAN_NODE';
      
      if (!groups[devId]) {
        const device = inventory.find(d => d.id === devId);
        groups[devId] = { 
          device: device || { id: devId, name: t.meta?.device_label || 'VIRTUAL_HOST' }, 
          things: [] 
        };
      }
      groups[devId].things.push(t);
    });

    // Return sorted groups that contain at least one mapped intelligence card
    return Object.values(groups).sort((a, b) => a.device.name.localeCompare(b.device.name));
  }, [allThings, devices]);

  const handleStatusToggle = async (id, nextStatus) => {
    try {
      await thingService.updateMeta(id, { is_active: nextStatus });
      fetchThings();
    } catch (err) {
      showToast('Fault_Command_Packet', 'error');
    }
  };

  const renderWidget = (thing) => {
    return (
      <div key={thing.id} className="aspect-square transition-all duration-500">
        <ThingCard 
            thing={thing} 
            theme={theme} 
            onEdit={() => setEditingThing(thing)}
            onToggle={(next) => handleStatusToggle(thing.id, next)}
        />
      </div>
    );
  };

  return (
    <div className="space-y-16 pb-32">

      {/* Grouped Intelligence Grid */}
      <div className="space-y-24">
        {groupedThings.length > 0 ? (
          groupedThings.map(group => (
            <div 
              key={group.device.id} 
              id={`device-${group.device.id}`}
              className="space-y-8 scroll-mt-24 pt-4"
            >
              {/* Group Header */}
              <div className="flex items-center gap-6 group">
                <div className="flex flex-col">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-hub-accent animate-pulse shadow-[0_0_10px_var(--hub-accent)]" />
                    <h3 className="text-xl font-black uppercase tracking-tighter transition-all group-hover:text-hub-accent">
                      {group.device.name}
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono opacity-20 uppercase tracking-widest mt-1 ml-5">
                    LINK_ID::{group.device.id}
                  </span>
                </div>
                <div className="flex-grow h-[1px] bg-hub-border" />
                <span className="text-[10px] font-mono opacity-15 uppercase tracking-widest">
                  OBJECTS::{group.things.length}
                </span>
              </div>

              {/* Grid for this specific device with Automatic Sizing */}
              <div 
                className="grid gap-6 grid-flow-dense" 
                style={{ 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gridAutoRows: '220px'
                }}
              >
                {group.things.map(thing => renderWidget(thing))}
              </div>
            </div>
          ))
        ) : (
          !loading && (
            <div className="h-80 flex flex-col items-center justify-center opacity-10 border-2 border-dashed border-hub-border rounded-[3rem]">
              <div className="text-6xl mb-6">◈</div>
              <p className="text-[10px] font-mono uppercase tracking-[0.5em]">No_Mapped_Inteligence_Found</p>
            </div>
          )
        )}
      </div>

      {editingThing && (
        <ThingRegistrationModal
          isOpen={true}
          editThing={editingThing}
          onClose={() => setEditingThing(null)}
          theme={theme}
          onRegister={() => fetchThings(true)}
        />
      )}
    </div>
  );
};

export default HomeManager;
