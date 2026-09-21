package com.adversport.rnaps;

/*
 * Copyright (c) 2022-present Adversport & Contributors
 *
 * This file is part of react-native-aps.
 *
 * react-native-aps is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, version 3 of the License.
 *
 * react-native-aps is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Foobar. If not, see <https://www.gnu.org/licenses/>.
 */

import android.util.Log;
import java.lang.reflect.Field;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Widens the executor the APS Android SDK runs its bid requests on.
 *
 * <p>The SDK (verified by disassembly on aps-sdk 11.1.1, 12.0.1 and 12.0.2) executes every {@code
 * DTBAdRequest}, blocking HTTP call included, on {@code DtbThreadService}: a process-wide singleton
 * whose executor is {@code Executors.newFixedThreadPool(1)}. Concurrent {@code loadAd()} calls are
 * therefore answered one after another, in call order, and a slot can miss its render deadline
 * while it waits behind off-screen ones. The SDK exposes no API for this, so the executor field is
 * swapped by reflection.
 *
 * <p>Must run before any request is queued: {@link RNAPSAdsModule#initialize} calls it before
 * {@code AdRegistration.getInstance}. The original single thread is shut down gracefully, so
 * anything already queued on it still completes.
 *
 * <p>Failure mode is always "keep the SDK default": any reflection error leaves the single thread
 * in place, is logged, and is reported through {@link #getDetail()} so the JS side can read it.
 */
public final class ApsBidRequestExecutor {

  static final String SERVICE_CLASS = "com.amazon.device.ads.DtbThreadService";
  static final String INSTANCE_FIELD = "threadServiceInstance";
  static final String EXECUTOR_FIELD = "executor";

  /** The SDK default, and the value reported until {@link #widen} succeeds. */
  static final int SDK_DEFAULT_CONCURRENCY = 1;

  private static final String TAG = "RNAPSAdsModule";

  private static int concurrency = SDK_DEFAULT_CONCURRENCY;
  private static boolean widened = false;
  private static String detail = "bidRequestConcurrency not requested, SDK default kept";

  private ApsBidRequestExecutor() {}

  /**
   * Replaces the SDK bid executor with a fixed pool of {@code size} threads. Idempotent: once
   * widened, later calls are ignored, whatever the size.
   *
   * @return true when the pool is widened (by this call or an earlier one).
   */
  public static synchronized boolean widen(int size) {
    if (widened) {
      return true;
    }
    if (size <= SDK_DEFAULT_CONCURRENCY) {
      detail = "bidRequestConcurrency " + size + " is not above the SDK default, nothing to widen";
      return false;
    }
    try {
      Class<?> serviceClass = Class.forName(SERVICE_CLASS);
      Field instanceField = serviceClass.getDeclaredField(INSTANCE_FIELD);
      instanceField.setAccessible(true);
      Object instance = instanceField.get(null);
      if (instance == null) {
        throw new IllegalStateException(INSTANCE_FIELD + " is null");
      }
      Field executorField = serviceClass.getDeclaredField(EXECUTOR_FIELD);
      executorField.setAccessible(true);
      Object previous = executorField.get(instance);
      if (!(previous instanceof ExecutorService)) {
        throw new IllegalStateException(EXECUTOR_FIELD + " has an unexpected type");
      }

      executorField.set(instance, Executors.newFixedThreadPool(size));
      // Graceful: tasks already queued on the single thread still run; the SDK's own
      // shutdown hook re-reads the field, so it will stop the new pool at process exit.
      ((ExecutorService) previous).shutdown();

      concurrency = size;
      widened = true;
      detail = null;
      Log.i(TAG, "APS bid request executor widened to " + size + " threads");
      return true;
    } catch (Throwable t) {
      detail =
          "widening failed, SDK default kept: "
              + t.getClass().getSimpleName()
              + ": "
              + t.getMessage();
      Log.w(TAG, detail);
      return false;
    }
  }

  /** Bid requests the SDK processes concurrently: the SDK default until widened. */
  public static synchronized int getConcurrency() {
    return concurrency;
  }

  public static synchronized boolean isWidened() {
    return widened;
  }

  /** Why the pool is not widened; null once it is. */
  public static synchronized String getDetail() {
    return detail;
  }

  /** Test only: forget a previous widening so the next {@link #widen} runs again. */
  static synchronized void resetForTests() {
    concurrency = SDK_DEFAULT_CONCURRENCY;
    widened = false;
    detail = "bidRequestConcurrency not requested, SDK default kept";
  }
}
