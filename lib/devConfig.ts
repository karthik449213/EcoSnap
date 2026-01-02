
// Enable all console logs in development
if (__DEV__) {
  console.log('🚀 [DevConfig] Development mode enabled');
  console.log('🚀 [DevConfig] Console logging active');
  
  // Optionally disable specific warnings (not errors)
  // LogBox.ignoreLogs(['Warning: ...']);
}

// Override console to ensure visibility in Expo
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = (...args) => {
  originalLog(...args);
  if (global.HermesInternal) {
    originalLog('[Hermes]', ...args);
  }
};

console.error = (...args) => {
  originalError(...args);
  if (global.HermesInternal) {
    originalError('[Hermes ERROR]', ...args);
  }
};

console.warn = (...args) => {
  originalWarn(...args);
  if (global.HermesInternal) {
    originalWarn('[Hermes WARN]', ...args);
  }
};

export { };

