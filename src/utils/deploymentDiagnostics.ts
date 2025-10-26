/**
 * Deployment Diagnostics Tool
 * Helps identify differences between local and deployed environments
 */

export const runDeploymentDiagnostics = () => {
  const diagnostics = {
    environment: {
      isLocal: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
      isProduction: import.meta.env.PROD,
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      port: window.location.port,
      pathname: window.location.pathname,
    },
    assets: {
      basePath: import.meta.env.BASE_URL,
      viteEnv: import.meta.env.MODE,
    },
    supabase: {
      url: import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing',
      key: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing',
    },
    errors: [] as string[],
    warnings: [] as string[],
  };

  // Check for common deployment issues
  console.log('🔍 Running deployment diagnostics...');
  console.log('Environment:', diagnostics.environment);
  console.log('Assets:', diagnostics.assets);
  console.log('Supabase:', diagnostics.supabase);

  // Check if we're in a subdirectory
  if (diagnostics.environment.pathname !== '/' && !diagnostics.environment.isLocal) {
    diagnostics.warnings.push('App is running in a subdirectory - check base path configuration');
  }

  // Check for HTTPS in production
  if (diagnostics.environment.isProduction && diagnostics.environment.protocol !== 'https:') {
    diagnostics.warnings.push('Production app is not using HTTPS');
  }

  // Check Supabase configuration
  if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    diagnostics.errors.push('Supabase environment variables are missing');
  }

  if (import.meta.env.PROD) {
    const moduleScripts = Array.from(document.querySelectorAll<HTMLScriptElement>('script[type="module"]'));
    const hasBundledScript = moduleScripts.some((script) => script.src.includes('/assets/'));

    if (hasBundledScript) {
      console.log('✅ Main application script detected');
    } else {
      diagnostics.errors.push('Unable to locate bundled application script tag');
    }

    const styleSheets = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'));
    const hasStyles = styleSheets.some((link) => link.href.includes('/assets/'));

    if (hasStyles) {
      console.log('✅ Main CSS file detected');
    } else {
      diagnostics.errors.push('Unable to locate bundled stylesheet link tag');
    }
  } else {
    console.log('ℹ️ Skipping asset presence checks in development mode');
  }

  // Log results
  if (diagnostics.errors.length > 0) {
    console.error('❌ Deployment errors found:', diagnostics.errors);
  }
  if (diagnostics.warnings.length > 0) {
    console.warn('⚠️ Deployment warnings:', diagnostics.warnings);
  }

  return diagnostics;
};

// Auto-run diagnostics in development
if (import.meta.env.DEV) {
  console.log('🔧 Development mode - running diagnostics...');
  setTimeout(runDeploymentDiagnostics, 1000);
}
