import React, { useState, useEffect, useCallback } from 'react';
import { thingService } from '../../services/thingService';
import { useTheme, useToast } from '../../context';
import ThingRegistrationModal from './Things/ThingRegistrationModal';
import ThingRow from './Things/ThingRow';

const ThingsManager = () => {
  const { theme } = useTheme();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [isDefining, setIsDefining] = useState(false);
  const [editingThing, setEditingThing] = useState(null);
  const [mappedThings, setMappedThings] = useState([]);
  
  const fetchThings = useCallback(async (force = false) => {
    try {
      setLoading(true);
      const data = await thingService.getThingzWithMeta(force);
      setMappedThings(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchThings();
  }, [fetchThings]);

  const handleDefine = () => {
    fetchThings(true);
  };

  const handleDelete = async (id) => {
    try {
      await thingService.deleteThing(id);
      const filtered = mappedThings.filter(t => t.id !== id);
      setMappedThings(filtered);
      localStorage.setItem('hub_meta_inventory', JSON.stringify(filtered));
      showToast('ENTITY_PURGE_SUCCESSFUL', 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1.5">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase leading-none">Thing_Repository</h2>
          <p className="text-[10px] font-mono opacity-20 uppercase tracking-[0.2em]">
            ACTIVE_VIRTUAL_MESH: {mappedThings.length}
          </p>
        </div>

        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
          <button
            onClick={() => fetchThings(true)}
            className={`h-11 w-11 md:h-12 md:w-12 flex items-center justify-center shrink-0 rounded-xl border border-neutral-500/10 hover:border-emerald-500/30 transition-all font-mono text-lg ${loading ? 'opacity-50' : ''}`}
          >
            <span className={loading ? 'animate-spin' : ''}>⟳</span>
          </button>
          <button
            onClick={() => setIsDefining(true)}
            className="h-11 md:h-12 flex-grow md:w-52 flex items-center justify-center bg-emerald-500 text-black text-[10px] md:text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-400 transition-all shadow-lg active:scale-95"
          >
            Define_Thing
          </button>
        </div>
      </header>

      {/* List-Based Repository View */}
      <div className="space-y-2">
        {mappedThings.length > 0 ? (
          mappedThings.map(thing => (
            <ThingRow 
              key={thing.id} 
              thing={thing} 
              theme={theme} 
              onDelete={() => handleDelete(thing.id)} 
              onEdit={() => setEditingThing(thing)}
            />
          ))
        ) : (
          !loading && (
            <div className="py-40 flex flex-col items-center justify-center opacity-20 border-2 border-dashed border-neutral-500/10 rounded-[3rem]">
              <div className="text-5xl mb-6">◈</div>
              <p className="text-[10px] font-mono uppercase tracking-[0.4em]">Repository_Inventory_Is_Null</p>
            </div>
          )
        )}
      </div>

      {(isDefining || editingThing) && (
        <ThingRegistrationModal
          isOpen={true}
          editThing={editingThing}
          onClose={() => {
            setIsDefining(false);
            setEditingThing(null);
          }}
          theme={theme}
          onRegister={handleDefine}
        />
      )}
    </div>
  );
};

export default ThingsManager;
