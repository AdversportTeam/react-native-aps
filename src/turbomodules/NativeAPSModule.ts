import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface APSModuleSpec extends TurboModule {
  getConstants: () => {};
}

export default TurboModuleRegistry.get<APSModuleSpec>('RNAPSModule');
