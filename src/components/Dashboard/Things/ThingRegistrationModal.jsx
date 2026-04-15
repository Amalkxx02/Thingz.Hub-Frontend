import React, { useState, useEffect, useMemo } from 'react';
import ThingModal from './ThingModal';
import { thingService } from '../../../services/thingService';

const ThingRegistrationModal = ({ isOpen, onClose, theme, onRegister, editThing = null }) => {
  const [step, setStep] = useState(editThing ? 2 : 1);
  const [devices, setDevices] = useState([]);
  const [things, setThings] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(editThing?.device_id || editThing?.deviceId || '');
  const [selectedThingId, setSelectedThingId] = useState(editThing?.id || '');
  const [loadingThings, setLoadingThings] = useState(false);

  // Configuration for Step 2
  const [config, setConfig] = useState({
    label: editThing?.meta?.label || '',
    unit: editThing?.meta?.unit || '',
    widget: editThing?.meta?.widget || '',
    size: editThing?.meta?.size || '1:1',
    variation_id: editThing?.meta?.variation_id || 'default'
  });

  // Data Types & Thing Types Enums
  const DataType = { INT: 0, FLOAT: 1, BOOL: 2, VECTOR3: 3 };
  const ThingType = { SENSOR: 0, ACTUATOR: 1, HYBRID: 2 };

  const selectedThing = useMemo(() => 
    editThing || things.find(t => t.id === selectedThingId), 
    [things, selectedThingId, editThing]
  );

  // Initial load
  useEffect(() => {
    if (isOpen) {
      if (editThing) {
        setStep(2);
        setSelectedDeviceId(editThing.device_id || editThing.deviceId);
        setSelectedThingId(editThing.id);
        setConfig({
          label: editThing.meta?.label || editThing.slug || '',
          unit: editThing.meta?.unit || '',
          widget: editThing.meta?.widget || '',
          size: editThing.meta?.size || '1:1',
          variation_id: editThing.meta?.variation_id || 'default'
        });
      } else {
        const cache = localStorage.getItem('hub_node_inventory');
        const parsed = cache ? JSON.parse(cache) : [];
        setDevices(parsed);
        if (parsed.length > 0 && !selectedDeviceId) setSelectedDeviceId(parsed[0].id);
        setStep(1);
      }
    }
  }, [isOpen, editThing]);

  // Fetch things on device select
  useEffect(() => {
    if (selectedDeviceId && step === 1 && !editThing) {
      const fetchThings = async () => {
        try {
          setLoadingThings(true);
          const data = await thingService.getThingsByDevice(selectedDeviceId);
          setThings(data);
          if (data.length > 0) setSelectedThingId(data[0].id);
        } catch (err) {
          setThings([]);
        } finally {
          setLoadingThings(false);
        }
      };
      fetchThings();
    }
  }, [selectedDeviceId, step, editThing]);

  // Update default label when thing changes (only if not editing)
  useEffect(() => {
    if (selectedThing && !editThing && step === 1) {
      setConfig(prev => ({ ...prev, label: selectedThing.slug || selectedThing.id }));
    }
  }, [selectedThing, editThing, step]);

  const availableWidgets = useMemo(() => {
    if (!selectedThing) return [];
    const { thing_type, data_type } = selectedThing;
    
    let widgets = [];
    
    // Logic for Sensors
    if (thing_type === ThingType.SENSOR || thing_type === ThingType.HYBRID) {
      if (data_type === DataType.INT || data_type === DataType.FLOAT) {
        widgets.push({ id: 'GAUGE_RADIAL', name: 'Radial Gauge' });
        widgets.push({ id: 'GLANCE_NUMERIC', name: 'Numerical Glance' });
        widgets.push({ id: 'TREND_MINI', name: 'Micro Trend' });
      }
      if (data_type === DataType.BOOL) {
        widgets.push({ id: 'STATUS_BINARY', name: 'Pulse Status' });
        widgets.push({ id: 'DISPLAY_BINARY', name: 'Solid Digital' });
      }
    }
    
    // Logic for Actuators
    if (thing_type === ThingType.ACTUATOR || thing_type === ThingType.HYBRID) {
      if (data_type === DataType.BOOL) {
        widgets.push({ id: 'TOGGLE_SLIM', name: 'Command Toggle' });
        widgets.push({ id: 'BUTTON_MOMENTARY', name: 'Momentary Push' });
      }
      if (data_type === DataType.INT || data_type === DataType.FLOAT) {
        widgets.push({ id: 'SLIDER_LINEAR', name: 'Linear Scrubber' });
        widgets.push({ id: 'SLIDER_RADIAL', name: 'Dial Knob' });
      }
    }

    if (data_type === DataType.VECTOR3) {
      widgets.push({ id: 'VECTOR_VIEW', name: '3D Vector Plot' });
    }

    return widgets;
  }, [selectedThing, DataType, ThingType]);

  useEffect(() => {
    if (availableWidgets.length > 0 && !config.widget) {
      setConfig(prev => ({ ...prev, widget: availableWidgets[0].id }));
    }
  }, [availableWidgets, config.widget]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    
    const metaData = {
      label: config.label,
      unit: config.unit,
      widget: config.widget,
      size: config.size,
      variation_id: config.variation_id,
      device_id: selectedDeviceId,
      thing_id: selectedThingId
    };

    try {
      setLoadingThings(true);
      await thingService.updateMeta(selectedThingId, metaData);
      
      onRegister(); // Parent refresh trigger
      onClose();
    } catch (err) {
      // Toast handled by service/parent
    } finally {
      setLoadingThings(false);
    }
  };

  return (
    <ThingModal isOpen={isOpen} onClose={onClose} theme={theme}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className="text-xl font-black uppercase tracking-tighter">
          {editThing ? 'Redefine_Intelligence' : (step === 1 ? 'Mapping_Step_01' : 'Configuration_Step_02')}
        </h3>

        {step === 1 ? (
          <>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase opacity-20 tracking-widest ml-2">Select_Hardware_Node</label>
              <select 
                className={`w-full p-4 rounded-xl border outline-none font-mono text-xs uppercase appearance-none cursor-pointer ${theme === 'dark' ? 'bg-white/5 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
              >
                {devices.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase opacity-20 tracking-widest ml-2">Target_Virtual_Entity</label>
              <select 
                className={`w-full p-4 rounded-xl border outline-none font-mono text-xs uppercase appearance-none cursor-pointer ${theme === 'dark' ? 'bg-white/5 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}
                value={selectedThingId}
                onChange={(e) => setSelectedThingId(e.target.value)}
                disabled={loadingThings}
              >
                <option value="" disabled>{loadingThings ? 'SYNCING...' : 'CHOOSE_THING'}</option>
                {things.map(t => <option key={t.id} value={t.id}>{t.slug || t.id.substring(0,8)}</option>)}
              </select>
            </div>

            <button 
              type="submit"
              disabled={!selectedThingId || loadingThings}
              className="w-full py-4 bg-emerald-500 text-black rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-95 disabled:opacity-50"
            >
              Next_Phasor →
            </button>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase opacity-20 tracking-widest ml-2">Display_Label</label>
                <input 
                  className={`w-full p-4 rounded-xl border outline-none font-mono text-xs uppercase ${theme === 'dark' ? 'bg-white/5 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}
                  value={config.label}
                  onChange={(e) => setConfig({...config, label: e.target.value})}
                  placeholder="ENTITY_LABEL"
                />
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase opacity-20 tracking-widest ml-2">Unit_Of_Measure</label>
                 <input 
                    className={`w-full p-4 rounded-xl border outline-none font-mono text-xs uppercase ${theme === 'dark' ? 'bg-white/5 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}
                    value={config.unit}
                    onChange={(e) => setConfig({...config, unit: e.target.value})}
                     placeholder="E.G. °C"
                  />
               </div>

               {selectedThing?.thing_type === 0 && selectedThing?.data_type === 1 && (
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase opacity-20 tracking-widest ml-2">Hardware_Combination</label>
                   <div className="relative">
                    <select 
                      className={`w-full p-4 rounded-xl border outline-none font-mono text-xs uppercase appearance-none cursor-pointer ${theme === 'dark' ? 'bg-white/5 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}`}
                      value={config.variation_id}
                      onChange={(e) => setConfig({...config, variation_id: e.target.value})}
                    >
                      <option value="default">Standard_Logic</option>
                      <option value="water">Hydro_Fluid_Static</option>
                      <option value="air">Atmospheric_Aero</option>
                      <option value="gas">Molecular_Gas_Prop</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 text-[8px]">▼</div>
                   </div>
                 </div>
               )}
            </div>

            <div className="flex gap-4">
              {!editThing && (
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-grow py-4 border border-neutral-500/10 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
                >
                  Back
                </button>
              )}
              <button 
                type="submit"
                className="flex-grow py-4 bg-emerald-500 text-black rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg active:scale-95"
              >
                {editThing ? 'Update_Configuration' : 'Finalize_Mapping'}
              </button>
            </div>
          </>
        )}
      </form>
    </ThingModal>
  );
};

export default ThingRegistrationModal;
