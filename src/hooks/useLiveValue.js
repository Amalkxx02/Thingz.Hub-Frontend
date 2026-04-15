import { useState, useEffect } from 'react';
import { websocketService } from '../services/websocketService';

/**
 * useLiveValue
 * Hooks into the Global Stream to provide real-time updates for a specific entity.
 * @param {object} thing - The thing object containing ids
 */
export const useLiveValue = (thing) => {
  const [value, setValue] = useState(thing?.last_value);

  useEffect(() => {
    // Sync local state if initialValue changes (from parent fetches)
    setValue(thing?.last_value);
  }, [thing?.last_value]);

  useEffect(() => {
    if (!thing?.id) return;

    // 1. Calculate the 128-bit BigInt key once (instead of every packet)
    const idHex = thing.id_hex || thing.id.replace(/-/g, '').toLowerCase();
    const binaryKey = BigInt(`0x${idHex}`);
    
    // 2. Subscribe using the raw numeric key for zero-allocation matching
    const unsubscribe = websocketService.subscribeBinary(binaryKey, (liveValue) => {
      setValue(liveValue);
    });

    return () => unsubscribe();
  }, [thing?.id, thing?.id_hex]);

  return value;
};
