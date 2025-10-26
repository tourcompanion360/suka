// React 18 Scheduler Fix
// This fixes the "unstable_scheduleCallback" error that causes blank screens

// Polyfill for React 18 scheduler
if (typeof window !== 'undefined') {
  const reactGlobal = (window as any).React;
  // Create a mock scheduler if it doesn't exist
  if (!reactGlobal || !reactGlobal.unstable_scheduleCallback) {
    console.log('Applying React 18 scheduler fix...');
    
    // Mock the scheduler functions
    const mockScheduler = {
      unstable_scheduleCallback: (priority: any, callback: any, options?: any) => {
        // Use setTimeout as a fallback
        return setTimeout(callback, 0);
      },
      unstable_cancelCallback: (callbackId: any) => {
        clearTimeout(callbackId);
      },
      unstable_now: () => performance.now(),
      unstable_getCurrentPriorityLevel: () => 0,
      unstable_shouldYield: () => false,
      unstable_requestPaint: () => {},
      unstable_runWithPriority: (priority: any, callback: any) => {
        return callback();
      },
      unstable_wrapCallback: (callback: any) => callback,
      unstable_getFirstCallbackNode: () => null,
      unstable_pauseExecution: () => {},
      unstable_continueExecution: () => {},
      unstable_forceFrameRate: () => {},
    };

    // Make it globally available
    (window as any).ReactScheduler = mockScheduler;
    // If the scheduler package is available in the bundle, prefer attaching
    // the real scheduler to window so vendor code that expects it finds it.
    try {
      import('scheduler').then((sch) => {
        if (sch) {
          (window as any).ReactScheduler = sch;
          // Mirror expected API onto window.React if present
          try {
            const r = (window as any).React || {};
            if (!r.unstable_scheduleCallback && sch.unstable_scheduleCallback) {
              r.unstable_scheduleCallback = sch.unstable_scheduleCallback;
              r.unstable_cancelCallback = sch.unstable_cancelCallback;
              r.unstable_now = sch.unstable_now;
              r.unstable_getCurrentPriorityLevel = sch.unstable_getCurrentPriorityLevel;
              r.unstable_shouldYield = sch.unstable_shouldYield;
              r.unstable_requestPaint = sch.unstable_requestPaint;
              r.unstable_runWithPriority = sch.unstable_runWithPriority;
              r.unstable_wrapCallback = sch.unstable_wrapCallback;
              r.unstable_getFirstCallbackNode = sch.unstable_getFirstCallbackNode;
            }
          } catch (e) {
            // noop
          }
        }
      }).catch(() => {});
    } catch (e) {}
  }
}

// Alternative fix: Use React 17 compatibility mode
export const enableReact17Compatibility = () => {
  if (typeof window !== 'undefined') {
    const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;

    if (hook && typeof hook === 'object') {
      hook.supportsFiber = true;
      hook.inject = hook.inject || (() => {});
      hook.onCommitFiberRoot = hook.onCommitFiberRoot || (() => {});
      hook.onCommitFiberUnmount = hook.onCommitFiberUnmount || (() => {});
    } else if (!hook) {
      try {
        Object.defineProperty(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
          value: {
            supportsFiber: true,
            inject: () => {},
            onCommitFiberRoot: () => {},
            onCommitFiberUnmount: () => {},
          },
          configurable: true,
          writable: true,
        });
      } catch (error) {
        console.warn('React devtools hook patch skipped:', error);
      }
    }
  }
};

// Initialize the fix
enableReact17Compatibility();
