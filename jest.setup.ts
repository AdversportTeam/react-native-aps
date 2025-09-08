// Jest setup for React Native library testing

// Mock only performance object to fix Jest + React Native conflict
if (!(global as any).performance) {
  Object.defineProperty(global, 'performance', {
    writable: true,
    enumerable: true,
    configurable: true,
    value: {
      now: () => Date.now(),
      mark: () => {},
      measure: () => {},
    },
  });
}

// Minimal React Native mock - let individual tests override as needed
// Create a shared event emitter instance for all tests
const listeners = new Map<string, any[]>();

const mockEventEmitter = {
  addListener: jest.fn((eventName: string, listener: any) => {
    if (!listeners.has(eventName)) {
      listeners.set(eventName, []);
    }
    listeners.get(eventName)!.push(listener);
    return { remove: jest.fn() };
  }),
  removeAllListeners: jest.fn(),
  emit: jest.fn((eventName: string, payload: any) => {
    const eventListeners = listeners.get(eventName) || [];
    eventListeners.forEach((listener: any) => listener(payload));
  }),
};

jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
    select: jest.fn(),
  },
  NativeEventEmitter: jest.fn(() => mockEventEmitter),
  NativeModules: {},
}));
