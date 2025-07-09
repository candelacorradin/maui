// Preloader JavaScript
(function() {
    'use strict';
    
    // Minimum loading time (in milliseconds) - optional
    const MINIMUM_LOADING_TIME = 1500;
    
    // Track loading state
    let startTime = Date.now();
    let isContentLoaded = false;
    let isMinTimeElapsed = false;
    
    // Function to hide preloader
    function hidePreloader() {
        if (isContentLoaded && isMinTimeElapsed) {
            const preloader = document.getElementById('preloader');
            const body = document.body;
            
            // Add fade out class
            preloader.classList.add('fade-out');
            
            // Remove loading class from body (this shows content)
            body.classList.remove('loading');
            
            // Remove preloader from DOM after animation
            setTimeout(() => {
                if (preloader && preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 600);
        }
    }
    
    // Check if minimum time has elapsed
    function checkMinTime() {
        const elapsed = Date.now() - startTime;
        if (elapsed >= MINIMUM_LOADING_TIME) {
            isMinTimeElapsed = true;
            hidePreloader();
        } else {
            setTimeout(checkMinTime, MINIMUM_LOADING_TIME - elapsed);
        }
    }
    
    // When DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        checkMinTime();
    });
    
    // When everything is fully loaded (images, etc.)
    window.addEventListener('load', function() {
        isContentLoaded = true;
        hidePreloader();
    });
    
    // Fallback: force hide after maximum time
    setTimeout(function() {
        isContentLoaded = true;
        isMinTimeElapsed = true;
        hidePreloader();
    }, 8000); // 8 seconds maximum
    
})();