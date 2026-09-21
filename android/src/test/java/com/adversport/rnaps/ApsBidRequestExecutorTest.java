package com.adversport.rnaps;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

/**
 * Runs against the exact aps-sdk Gradle resolves for this module. ApsBidRequestExecutor relies on
 * private SDK members; an SDK bump that renames them must fail here rather than silently keep the
 * single thread in production (the runtime failure mode is deliberately quiet).
 */
public class ApsBidRequestExecutorTest {

  private Class<?> serviceClass;
  private Object service;
  private Field executorField;

  @Before
  public void lookUpTheSdkService() throws Exception {
    serviceClass = Class.forName(ApsBidRequestExecutor.SERVICE_CLASS);
    Field instanceField = serviceClass.getDeclaredField(ApsBidRequestExecutor.INSTANCE_FIELD);
    instanceField.setAccessible(true);
    assertTrue(
        "expected a static singleton field", Modifier.isStatic(instanceField.getModifiers()));
    service = instanceField.get(null);
    assertNotNull("the SDK builds its singleton in a static initializer", service);
    executorField = serviceClass.getDeclaredField(ApsBidRequestExecutor.EXECUTOR_FIELD);
    executorField.setAccessible(true);
    assertFalse("expected an instance field", Modifier.isStatic(executorField.getModifiers()));
    ApsBidRequestExecutor.resetForTests();
  }

  @After
  public void restoreTheSdkDefault() throws Exception {
    ExecutorService current = (ExecutorService) executorField.get(service);
    executorField.set(service, Executors.newFixedThreadPool(1));
    current.shutdownNow();
    ApsBidRequestExecutor.resetForTests();
  }

  @Test
  public void theSdkDefaultIsStillASingleThreadPool() throws Exception {
    Object executor = executorField.get(service);
    assertTrue(
        "expected a ThreadPoolExecutor, got " + executor.getClass().getName(),
        executor instanceof ThreadPoolExecutor);
    // "1" is the assumption behind the whole feature: if Amazon ever ships a wider pool,
    // re-derive what widening should do instead of just re-pinning this value.
    assertEquals(1, ((ThreadPoolExecutor) executor).getCorePoolSize());
    assertEquals(1, ApsBidRequestExecutor.getConcurrency());
    assertFalse(ApsBidRequestExecutor.isWidened());
    assertNotNull(ApsBidRequestExecutor.getDetail());
  }

  @Test
  public void widenInstallsAPoolOfTheRequestedSize() throws Exception {
    assertTrue(ApsBidRequestExecutor.widen(3));

    Object executor = executorField.get(service);
    assertTrue(executor instanceof ThreadPoolExecutor);
    assertEquals(3, ((ThreadPoolExecutor) executor).getCorePoolSize());
    assertEquals(3, ApsBidRequestExecutor.getConcurrency());
    assertTrue(ApsBidRequestExecutor.isWidened());
    assertNull(ApsBidRequestExecutor.getDetail());
  }

  /** The point of the feature: three tasks submitted through the SDK entry point run at once. */
  @Test
  public void theSdkEntryPointRunsRequestsConcurrentlyOnceWidened() throws Exception {
    assertTrue(ApsBidRequestExecutor.widen(3));
    Method execute = serviceClass.getDeclaredMethod("execute", Runnable.class);
    execute.setAccessible(true);

    CountDownLatch allStarted = new CountDownLatch(3);
    CountDownLatch release = new CountDownLatch(1);
    for (int i = 0; i < 3; i++) {
      execute.invoke(
          service,
          (Runnable)
              () -> {
                allStarted.countDown();
                try {
                  release.await(5, TimeUnit.SECONDS);
                } catch (InterruptedException ignored) {
                  Thread.currentThread().interrupt();
                }
              });
    }
    // On the SDK default a second task cannot start before the first one returns.
    boolean concurrent = allStarted.await(2, TimeUnit.SECONDS);
    release.countDown();
    assertTrue("the three tasks did not run concurrently", concurrent);
  }

  @Test
  public void widenIsIdempotentAndIgnoresLaterSizes() throws Exception {
    assertTrue(ApsBidRequestExecutor.widen(3));
    Object first = executorField.get(service);
    assertTrue(ApsBidRequestExecutor.widen(5));
    assertTrue(
        "a second call must not replace the pool again", first == executorField.get(service));
    assertEquals(3, ApsBidRequestExecutor.getConcurrency());
  }

  @Test
  public void aSizeAtOrBelowTheSdkDefaultKeepsTheSdkExecutor() throws Exception {
    Object before = executorField.get(service);
    assertFalse(ApsBidRequestExecutor.widen(1));
    assertFalse(ApsBidRequestExecutor.widen(0));
    assertTrue(before == executorField.get(service));
    assertFalse(ApsBidRequestExecutor.isWidened());
    assertEquals(1, ApsBidRequestExecutor.getConcurrency());
    assertNotNull(ApsBidRequestExecutor.getDetail());
  }
}
