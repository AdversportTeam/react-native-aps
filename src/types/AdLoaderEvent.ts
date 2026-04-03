/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export const AdLoaderEvent = {
  SUCCESS: 'onSuccess',
  FAILURE: 'onFailure',
} as const;

export type AdLoaderEvent = typeof AdLoaderEvent[keyof typeof AdLoaderEvent];

export function isAdLoaderEvent(value: any): value is AdLoaderEvent {
  return Object.values(AdLoaderEvent).includes(value);
}
