import { useEffect, useState, useCallback } from 'react';
import { websocketService } from '../services/websocketService';

/**
 * CUSTOM_HOOK: USE_WEBSOCKET
 * Low-latency interface for Hub telemetry data.
 * @param {string} topic - Channel to subscribe to (e.g. 'thing_update', 'device_status')
 * @param {function} onMessage - Callback for incoming packet
 * @returns {object} - { status, message, lastUpdate }
 */
export const useWebSocket = (topic, onMessage) => {
  const [socketState, setSocketState] = useState({ 
    status: 'DISCONNECTED', 
    code: 'IDLE', 
    timestamp: null 
  });

  // Maintain stable reference to onMessage to avoid re-subscription loop
  const stableCallback = useCallback((data) => {
    if (onMessage) onMessage(data);
  }, [onMessage]);

  useEffect(() => {
    // Monitor global status change
    const unsubStatus = websocketService.onStatusChange((update) => {
      setSocketState(update);
    });

    // Handle topic subscription
    let unsubTopic = null;
    if (topic) {
      unsubTopic = websocketService.subscribe(topic, stableCallback);
    }

    return () => {
      unsubStatus();
      if (unsubTopic) unsubTopic();
    };
  }, [topic, stableCallback]);

  return socketState;
};

export default useWebSocket;
