import type { AdLoaderEvent } from './AdLoaderEvent';
import type { AdError } from '../AdError';

export type AdLoaderListener<E extends AdLoaderEvent> = (
  payload: E extends typeof AdLoaderEvent.SUCCESS
    ? { [key: string]: string }
    : E extends typeof AdLoaderEvent.FAILURE
    ? AdError
    : never
) => void;
