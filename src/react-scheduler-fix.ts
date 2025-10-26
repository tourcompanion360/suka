// React 18 Scheduler Fix
// This fixes the "unstable_scheduleCallback" error that causes blank screens

// Initialize scheduler implementation as early as possible
function initScheduler() {
  if (typeof window === 'undefined') return;

  console.log('[Scheduler] Initializing implementation...');
  
  // Create scheduler implementation
  const scheduler = {
    unstable_scheduleCallback: (priority: any, callback: any) => setTimeout(callback, 0),
    unstable_cancelCallback: (id: any) => clearTimeout(id),
    unstable_now: () => performance.now(),
    unstable_getCurrentPriorityLevel: () => 0,
    unstable_shouldYield: () => false,
    unstable_requestPaint: () => {},
    unstable_runWithPriority: (_: any, cb: any) => cb(),
    unstable_wrapCallback: (cb: any) => cb,
    unstable_getFirstCallbackNode: () => null,
    unstable_pauseExecution: () => {},
    unstable_continueExecution: () => {},
    unstable_forceFrameRate: () => {},
  };

  try {
    // Initialize window.React if needed
    if (!(window as any).React) {
      (window as any).React = {};
      console.log('[Scheduler] Created window.React object');
    }
    const scheduler = {
      unstable_scheduleCallback: (priority: any, callback: any) => setTimeout(callback, 0),
      unstable_cancelCallback: (id: any) => clearTimeout(id),
      unstable_now: () => performance.now(),
      unstable_getCurrentPriorityLevel: () => 0,
      unstable_shouldYield: () => false,
      unstable_requestPaint: () => {},
      unstable_runWithPriority: (_: any, cb: any) => cb(),
      unstable_wrapCallback: (cb: any) => cb,
      unstable_getFirstCallbackNode: () => null,
      unstable_pauseExecution: () => {},
      unstable_continueExecution: () => {},
      unstable_forceFrameRate: () => {},
    };

    // Attach directly to window.React
    // Attach to window.React
    const react = (window as any).React;
    Object.keys(scheduler).forEach(key => {
      react[key] = scheduler[key];
    });
    console.log('[Scheduler] Attached scheduler API to window.React');

    // Also make available as window.ReactScheduler
    (window as any).ReactScheduler = scheduler;
    console.log('[Scheduler] Attached scheduler to window.ReactScheduler');

  } catch (e) {
    console.error('[Scheduler] Failed to initialize:', e);
  }
}

// Run initialization immediately
initScheduler();
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
