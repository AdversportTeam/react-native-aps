/**
 * This file is not in use until the TurboModule becomes stable and support typescript officially.
 */
import { TurboModule, TurboModuleRegistry } from 'react-native';

export interface APSModuleSpec extends TurboModule {
  getConstants: () => {};
}

export default TurboModuleRegistry.get<APSModuleSpec>('RNAPSModule');
