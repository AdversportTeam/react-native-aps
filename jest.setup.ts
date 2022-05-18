import * as ReactNative from 'react-native';

jest.mock(
  './node_modules/react-native/Libraries/EventEmitter/NativeEventEmitter'
);

jest.doMock('react-native', () => {
  return Object.setPrototypeOf(
    {
      Platform: {
        OS: 'android',
        select: () => {},
      },
    },
    ReactNative
  );
});
