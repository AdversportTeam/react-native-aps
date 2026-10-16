/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export interface AdLoaderOptions {
  /**
   * The slotUUID of the ad slot.
   */
  slotUUID: string;
  /**
   * The optional custom targeting key value pairs for the bid request.
   */
  customTargeting?: { [key: string]: string };
  /**
   * The public web URL of the content the user is currently viewing.
   *
   * Amazon DSP requires in-app bid requests to carry it so that AmazonAdBot can
   * crawl the page and verify the content surrounding the ad. Inventory it
   * cannot verify progressively loses eligibility with Amazon advertisers.
   *
   * It must be the web URL matching the in-app content — not a deep link, not a
   * store URL, not the app home page — and it must be publicly reachable.
   *
   * iOS only: the Android APS SDK exposes no equivalent, where the value is
   * ignored. See the README for the current status of that limitation.
   */
  contentUrl?: string;
}

export interface BannerAdLoaderOptions extends AdLoaderOptions {
  /**
   * The size of the banner ad slot. Required for banner ad slots.
   */
  size?: string;

  /**
   * Whether the banner ad to be automatically refreshed. Defaults to `false`.
   */
  autoRefresh?: boolean;

  /**
   * The time interval in seconds between refreshes. Defaults to `60` seconds if autoRefresh enabled. The minimum auto-refresh time supported is `20` seconds.
   */
  refreshInterval?: number;
}

const sizeRegex = /([0-9]+)x([0-9]+)/;

export function validateAdLoaderOptions(adLoaderOptions: AdLoaderOptions) {
  if (typeof adLoaderOptions !== 'object') {
    throw new Error("'adLoaderOptions' expected an object value");
  }
  if (typeof adLoaderOptions.slotUUID !== 'string') {
    throw new Error("'adLoaderOptions.slotUUID' expected a string value");
  }
  if (
    adLoaderOptions.contentUrl !== undefined &&
    typeof adLoaderOptions.contentUrl !== 'string'
  ) {
    throw new Error("'adLoaderOptions.contentUrl' expected a string value");
  }
}

export function validateBannerAdLoaderOptions(
  adLoaderOptions: BannerAdLoaderOptions
) {
  validateAdLoaderOptions(adLoaderOptions);
  if (!adLoaderOptions.size || !sizeRegex.test(adLoaderOptions.size)) {
    throw new Error("'adLoaderOptions.size' expected a valid size string");
  }
}
