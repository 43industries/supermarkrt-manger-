// Offline Resource Loader - Compatible with Older Browsers
// Loads libraries from local files, falls back to CDN if needed
// Optimized for older machines (IE11+, Chrome 60+, Firefox 55+, Edge 79+)

(function() {
  'use strict';
  
  // Compatible function for older browsers
  function loadScript(src, callback, fallback) {
    var script = document.createElement('script');
    script.src = src;
    script.async = false;
    
    if (callback && typeof callback === 'function') {
      if (script.readyState) {
        // IE support
        script.onreadystatechange = function() {
          if (this.readyState === 'complete' || this.readyState === 'loaded') {
            callback();
          }
        };
      } else {
        script.onload = callback;
      }
    }
    
    script.onerror = function() {
      if (fallback) {
        if (typeof console !== 'undefined' && console.warn) {
          console.warn('⚠️  Local file not found, using CDN fallback for:', src);
        }
        var fallbackScript = document.createElement('script');
        fallbackScript.src = fallback;
        fallbackScript.async = false;
        
        // Set crossOrigin for React libraries
        if (src.indexOf('react') !== -1 || src.indexOf('react-dom') !== -1) {
          try {
            fallbackScript.crossOrigin = 'anonymous';
          } catch(e) {
            // Older browsers may not support crossOrigin
          }
        }
        
        if (callback && typeof callback === 'function') {
          if (fallbackScript.readyState) {
            fallbackScript.onreadystatechange = function() {
              if (this.readyState === 'complete' || this.readyState === 'loaded') {
                callback();
              }
            };
          } else {
            fallbackScript.onload = callback;
          }
        }
        
        document.head.appendChild(fallbackScript);
      } else {
        if (typeof console !== 'undefined' && console.error) {
          console.error('❌ Failed to load:', src);
        }
      }
    };
    
    document.head.appendChild(script);
  }
  
  // Wait for DOM to be ready (compatible with older browsers)
  function domReady(callback) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(callback, 1);
    } else {
      document.addEventListener('DOMContentLoaded', callback);
    }
  }
  
  domReady(function() {
    // Load resources in order with fallbacks
    // Tailwind CSS (load first)
    loadScript('libs/tailwindcss.min.js', null, 'https://cdn.tailwindcss.com');
    
    // React (must load before ReactDOM)
    loadScript('libs/react.production.min.js', function() {
      // ReactDOM (must load after React)
      loadScript('libs/react-dom.production.min.js', function() {
        // Babel (can load after React)
        loadScript('libs/babel.min.js', function() {
          if (typeof console !== 'undefined' && console.log) {
            console.log('✅ All offline resources loaded successfully');
          }
        }, 'https://unpkg.com/@babel/standalone/babel.min.js');
      }, 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js');
    }, 'https://unpkg.com/react@18/umd/react.production.min.js');
  });
  
})();

