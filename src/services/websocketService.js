const WS_BASE_URL = 'ws://localhost:8000/api/v1/ws/client';
import { authService } from './authService';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map(); // topic -> Set<callback>
    this.binaryListeners = new Map(); // BigInt (128-bit ID) -> Set<callback>
    this.statusListeners = new Set();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectInterval = 3000;
    this.status = 'DISCONNECTED'; // DISCONNECTED, CONNECTING, CONNECTED, RECONECTING, ERROR
  }

  /**
   * INITIATE_STREAM_HANDSHAKE
   * Establishes link with the Hub WebSocket endpoint.
   */
  async connect() {
    let token = localStorage.getItem('access_token');
    
    // Proactive refresh if token is missing
    if (!token) {
      try {
        console.log('[WEBSOCKET]: AUTH_TOKEN_MISSING, ATTEMPTING_REFRESH');
        token = await authService.refresh();
      } catch (err) {
        this._updateStatus('ERROR', 'AUTH_SEQUENCE_FAILED');
        return;
      }
    }

    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this._updateStatus('CONNECTING', 'INITIATING_STREAM_HANDSHAKE');

    try {
      // Supporting token via query param is standard for browser WebSocket API
      this.socket = new WebSocket(`${WS_BASE_URL}?token=${token}`);
      this.socket.binaryType = 'arraybuffer';

      this.socket.onopen = () => {
        this.reconnectAttempts = 0;
        this._updateStatus('CONNECTED', 'STREAM_STABILIZED');
        console.log('[WEBSOCKET]: LINK_ESTABLISHED');
      };

      this.socket.onmessage = (event) => {
        try {
          if (event.data instanceof ArrayBuffer) {
            this._handleBinaryMessage(event.data);
          } else {
            const packet = JSON.parse(event.data);

            // Handle server-side auth error message
            if (packet.error === 'unauthorized' || packet.error === 'TOKEN_EXPIRED' || packet.status === 401) {
              console.warn('[WEBSOCKET]: AUTH_ERROR_PACKET_RECEIVED', packet.error);
              this._handleUnauthorized();
              return;
            }

            const { topic, payload } = packet;
            this._handleMessage(topic || 'broadcast', payload || packet);
          }
        } catch (err) {
          console.warn('[WEBSOCKET]: PACKET_CORRUPTION_DETECTED', err);
        }
      };

      this.socket.onclose = async (event) => {
        if (event.wasClean) {
          this._updateStatus('DISCONNECTED', 'STREAM_TERMINATED_CLEANLY');
        } else {
          // Handle 401/Unauthorized via specific close codes (4001 is custom, 1008 is policy violation)
          if (event.code === 4001 || event.code === 1008 || event.code === 3000) {
            console.warn(`[WEBSOCKET]: AUTH_FAILURE_DETECTED (${event.code}), REFRESHING_TOKEN`);
            this._handleUnauthorized();
            return;
          }

          this._updateStatus('ERROR', 'STREAM_INTERRUPTED');
          this._attemptReconnect();
        }
      };

      this.socket.onerror = () => {
        this._updateStatus('ERROR', 'HARDWARE_LINK_FAILURE');
      };
    } catch (err) {
      this._updateStatus('ERROR', 'ENGINE_CRITICAL_FAILURE');
      console.error('[WEBSOCKET]: CRITICAL_FAULT', err);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this._updateStatus('DISCONNECTED', 'MANUAL_DEPROVISION');
  }

  /**
   * SUBSCRIBE_TO_TOPIC
   * @param {string} topic - The channel to listen for
   * @param {function} callback - Execution block on message
   */
  subscribe(topic, callback) {
    if (!this.listeners.has(topic)) {
      this.listeners.set(topic, new Set());
    }
    this.listeners.get(topic).add(callback);
    
    // Auto-connect if closed (Lazy Initialization)
    if (this.status === 'DISCONNECTED') {
      this.connect();
    }
    
    return () => {
      const suite = this.listeners.get(topic);
      if (suite) {
        suite.delete(callback);
        if (suite.size === 0) this.listeners.delete(topic);
      }
    };
  }

  /**
   * SUBSCRIBE_BINARY
   * Direct BigInt subscription for zero-allocation high-speed matching.
   * @param {BigInt} binaryKey - The 128-bit key derived from UUID
   * @param {function} callback - Execution block
   */
  subscribeBinary(binaryKey, callback) {
    if (!this.binaryListeners.has(binaryKey)) {
      this.binaryListeners.set(binaryKey, new Set());
    }
    this.binaryListeners.get(binaryKey).add(callback);

    if (this.status === 'DISCONNECTED') {
      this.connect();
    }

    return () => {
      const suite = this.binaryListeners.get(binaryKey);
      if (suite) {
        suite.delete(callback);
        if (suite.size === 0) this.binaryListeners.delete(binaryKey);
      }
    };
  }

  /**
   * MONITOR_LINK_STATUS
   * @param {function} callback - Execution block on status change
   */
  onStatusChange(callback) {
    this.statusListeners.add(callback);
    // Push current state immediately
    callback({ status: this.status, code: 'INITIAL_STATE_PULL', timestamp: new Date().toISOString() });
    return () => this.statusListeners.delete(callback);
  }

  _handleBinaryMessage(buffer) {
    // UUID (16 bytes) + Value (usually 4 or 8 bytes)
    if (buffer.byteLength < 16) return;

    const view = new DataView(buffer);
    
    // Extract 128-bit ID (16 bytes) as a single BigInt (Network Byte Order)
    const high = view.getBigUint64(0);
    const low = view.getBigUint64(8);
    const binaryKey = (high << 64n) | low;
    
    // Extract 'the rest' as the value. 
    // Most IoT protocols use Network Byte Order (Big Endian).
    let value;
    const remaining = buffer.byteLength - 16;

    if (remaining >= 8) {
      value = view.getFloat64(16, false); // Big Endian
    } else if (remaining >= 4) {
      value = view.getFloat32(16, false); // Big Endian
    } else if (remaining === 2) {
      value = view.getInt16(16, false);   // Big Endian
    } else if (remaining === 1) {
      value = view.getUint8(16);
    } else {
      value = 0;
    }

    console.debug(`[WEBSOCKET]: BINARY_RECEIVE ID=${binaryKey.toString(16).padStart(32, '0')} VALUE=${value}`);

    // Dispatch to binary listeners
    if (this.binaryListeners.has(binaryKey)) {
      this.binaryListeners.get(binaryKey).forEach(cb => cb(value));
    }

    // Also dispatch to string-based listeners (thing:<hex_uuid>)
    const thing_hex = binaryKey.toString(16).padStart(32, '0');
    this._handleMessage(`thing:${thing_hex}`, value);
  }

  _handleMessage(topic, payload) {
    // Exact topic match
    if (this.listeners.has(topic)) {
      this.listeners.get(topic).forEach(cb => cb(payload));
    }
    
    // Wildcard match (System-wide monitoring)
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(cb => cb({ topic, payload }));
    }
  }

  _updateStatus(status, code) {
    this.status = status;
    const update = { status, code, timestamp: new Date().toISOString() };
    this.statusListeners.forEach(cb => cb(update));
  }

  async _handleUnauthorized() {
    this.disconnect();
    this._updateStatus('RECONNECTING', 'REFRESHING_AUTH_CREDENTIALS');
    
    try {
      await authService.refresh();
      this.reconnectAttempts = 0; // Reset backoff on successful refresh
      this.connect();
    } catch (err) {
      console.error('[WEBSOCKET]: AUTH_REFRESH_FAILED', err);
      this._updateStatus('ERROR', 'SESSION_EXPIRED');
      // Redirect is usually handled by authService.refresh, but as a fallback:
      if (!localStorage.getItem('refresh_token')) {
        window.location.href = '/auth?expired=true';
      }
    }
  }

  _attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this._updateStatus('ERROR', 'MAX_RETRY_SEQUENCE_REACHED');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectInterval * Math.pow(1.5, this.reconnectAttempts - 1);
    
    this._updateStatus('RECONNECTING', `RETRY_SEQUENCE_${this.reconnectAttempts}_IN_${Math.round(delay/1000)}S`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }
}

export const websocketService = new WebSocketService();
