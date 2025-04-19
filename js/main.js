/**
 * Maui Hostels - Main JavaScript
 * Contains functionality for mobile menu toggle, language switching, and other interactive elements
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    /**
     * Set body padding to accommodate fixed header
     */
    function adjustBodyPadding() {
        const headerHeight = document.querySelector('header').offsetHeight;
        document.body.style.paddingTop = headerHeight + 'px';
    }
    
    // Initial adjustment
    adjustBodyPadding();
    
    // Adjust padding on window resize
    window.addEventListener('resize', adjustBodyPadding);
    
    /**
     * Language Toggle
     * Switches between English and Spanish content
     */
    const langEN = document.getElementById('lang-en');
    const langES = document.getElementById('lang-es');
    
    // Initialize language from localStorage or default to English
    let currentLang = localStorage.getItem('mauiHostelsLang') || 'en';
    
    // Apply initial language state
    applyLanguage(currentLang);
    
    if (langEN && langES) {
        // English button click
        langEN.addEventListener('click', function() {
            if (currentLang !== 'en') {
                currentLang = 'en';
                localStorage.setItem('mauiHostelsLang', 'en');
                applyLanguage('en');
            }
        });
        
        // Spanish button click
        langES.addEventListener('click', function() {
            if (currentLang !== 'es') {
                currentLang = 'es';
                localStorage.setItem('mauiHostelsLang', 'es');
                applyLanguage('es');
            }
        });
    }
    
    /**
     * Apply the selected language throughout the site
     * This implements dynamic text replacement using the translations object
     */
    function applyLanguage(lang) {
        // Update button styles for language toggle
        if (langEN && langES) {
            if (lang === 'en') {
                langEN.classList.add('bg-accent');
                langEN.classList.remove('bg-dark', 'hover:bg-accent');
                langES.classList.add('bg-dark', 'hover:bg-accent');
                langES.classList.remove('bg-accent');
            } else {
                langES.classList.add('bg-accent');
                langES.classList.remove('bg-dark', 'hover:bg-accent');
                langEN.classList.add('bg-dark', 'hover:bg-accent');
                langEN.classList.remove('bg-accent');
            }
        }
        
        // Set the document's lang attribute for accessibility
        document.documentElement.setAttribute('lang', lang);
        
        try {
            // Check if translations object is available
            if (typeof window.translations !== 'undefined') {
                // 1. Apply translations to elements with data-translate attribute
                document.querySelectorAll('[data-translate]').forEach(element => {
                    const section = element.getAttribute('data-translate');
                    const key = element.getAttribute('data-key');
                    
                    if (section && key && 
                        window.translations[section] && 
                        window.translations[section][lang] && 
                        window.translations[section][lang][key]) {
                        // Replace the element's text with the translation
                        element.textContent = window.translations[section][lang][key];
                    }
                });
                
                // 2. Apply translations to attributes (like placeholders)
                document.querySelectorAll('[data-translate-attr]').forEach(element => {
                    const attrMap = element.getAttribute('data-translate-attr');
                    
                    // Format: "attribute:section.key"
                    // Example: "placeholder:footer.emailPlaceholder"
                    if (attrMap) {
                        const [attribute, path] = attrMap.split(':');
                        if (attribute && path) {
                            const [section, key] = path.split('.');
                            
                            if (section && key && 
                                window.translations[section] && 
                                window.translations[section][lang] && 
                                window.translations[section][lang][key]) {
                                // Apply the translation to the specified attribute
                                element.setAttribute(attribute, window.translations[section][lang][key]);
                            }
                        }
                    }
                });
                
                // Log success
                console.log(`Language switched to ${lang}`);
            } else {
                console.warn('Translations object not available. Make sure language-data.js is loaded before main.js');
            }
        } catch (error) {
            console.error('Error applying translations:', error);
        }
    }
    
    /**
     * Mobile Menu Toggle
     * Opens and closes the mobile menu when the hamburger icon is clicked
     */
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    /**
     * Hero Video Controls
     * Control playback, volume, and overlay visibility for the hero video
     */
    const heroVideo = document.getElementById('hero-video');
    const videoOverlay = document.getElementById('video-overlay');
    const toggleOverlayBtn = document.getElementById('toggle-overlay-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const volumeBtn = document.getElementById('volume-btn');
    
    // Only initialize if all elements exist
    if (heroVideo && videoOverlay && toggleOverlayBtn && playPauseBtn && volumeBtn) {
        // Toggle overlay visibility
        toggleOverlayBtn.addEventListener('click', function() {
            videoOverlay.classList.toggle('hidden');
            
            // Update button icon
            if (videoOverlay.classList.contains('hidden')) {
                // Show "show overlay" icon (eye with slash)
                toggleOverlayBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                `;
            } else {
                // Show "hide overlay" icon (eye)
                toggleOverlayBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                `;
            }
        });
        
        // Play/Pause video
        playPauseBtn.addEventListener('click', function() {
            if (heroVideo.paused) {
                heroVideo.play();
                
                // Show pause icon
                playPauseBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                `;
            } else {
                heroVideo.pause();
                
                // Show play icon
                playPauseBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                `;
            }
        });
        
        // Toggle volume
        volumeBtn.addEventListener('click', function() {
            heroVideo.muted = !heroVideo.muted;
            
            // Update button icon based on mute state
            if (heroVideo.muted) {
                // Show muted icon
                volumeBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                `;
            } else {
                // Show volume-on icon
                volumeBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                `;
            }
        });

        // Set initial UI states
        // Initially the video is paused and muted
        if (heroVideo.paused) {
            playPauseBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            `;
        }
    }
    
    /**
     * Video Fallback
     * Checks if the hero video can play, otherwise shows the poster image
     */
    if (heroVideo) {
        heroVideo.addEventListener('error', function() {
            console.log('Video error occurred, fallback to poster image');
            // The poster attribute already serves as a fallback
        });
    }
    
    /**
     * Smooth Scrolling for Anchor Links
     * Makes page scroll smoothly when clicking on navigation links
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Only apply to anchors that point to elements on this page
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    
                    // Get header height for offset
                    const headerHeight = document.querySelector('header').offsetHeight;
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - headerHeight, // Offset for fixed header
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    /**
     * Newsletter Form Validation
     * Simple validation for the newsletter signup form
     */
    const newsletterForm = document.querySelector('footer form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email || !isValidEmail(email)) {
                // Use language-appropriate alert message
                const message = currentLang === 'en' ? 
                    'Please enter a valid email address' : 
                    'Por favor, introduce una dirección de correo electrónico válida';
                
                alert(message);
                return;
            }
            
            // Here you would typically send the data to your server
            // For now, just show a success message
            const successMessage = currentLang === 'en' ? 
                'Thanks for subscribing to our newsletter!' : 
                '¡Gracias por suscribirte a nuestro boletín!';
            
            alert(successMessage);
            emailInput.value = '';
        });
    }
    
    /**
     * Helper function to validate email format
     */
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Carousel Functionality for Hostel Photos
     */
    // Initialize all carousels
    initCarousels();
    
    // Function to initialize all carousels on the page
    function initCarousels() {
        // Find all carousel containers
        const carousels = document.querySelectorAll('.carousel-container');
        
        carousels.forEach(carousel => {
            const slides = carousel.querySelector('.carousel-slides');
            const prevBtn = carousel.querySelector('.carousel-prev');
            const nextBtn = carousel.querySelector('.carousel-next');
            const indicators = carousel.querySelectorAll('.carousel-indicator');
            const totalSlides = carousel.querySelectorAll('.carousel-slide').length;
            
            // Current slide index
            let currentIndex = 0;
            
            // Set up event listeners
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    goToSlide((currentIndex + 1) % totalSlides);
                });
            }
            
            // Set up indicator buttons
            indicators.forEach(indicator => {
                indicator.addEventListener('click', () => {
                    const slideIndex = parseInt(indicator.getAttribute('data-index'), 10);
                    goToSlide(slideIndex);
                });
            });
            
            // Function to go to a specific slide
            function goToSlide(index) {
                // Update current index
                currentIndex = index;
                
                // Move the slides
                slides.style.transform = `translateX(-${currentIndex * 100}%)`;
                
                // Update indicators
                indicators.forEach((indicator, i) => {
                    if (i === currentIndex) {
                        indicator.classList.add('active');
                        indicator.style.backgroundColor = 'rgba(255, 255, 255, 1)';
                        indicator.style.width = '3px'; // Make active indicator slightly larger
                        indicator.style.height = '3px';
                    } else {
                        indicator.classList.remove('active');
                        indicator.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
                        indicator.style.width = '2px';
                        indicator.style.height = '2px';
                    }
                });
            }
            
            // Set up touch/swipe support
            let touchStartX = 0;
            let touchEndX = 0;
            
            slides.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            slides.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });
            
            function handleSwipe() {
                const swipeThreshold = 50; // Minimum swipe distance in pixels
                
                if (touchEndX < touchStartX - swipeThreshold) {
                    // Swipe left - go to next slide
                    goToSlide((currentIndex + 1) % totalSlides);
                } else if (touchEndX > touchStartX + swipeThreshold) {
                    // Swipe right - go to previous slide
                    goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
                }
            }
            
            // Optional: Auto-rotation
            let autoplayInterval;
            
            function startAutoplay() {
                autoplayInterval = setInterval(() => {
                    goToSlide((currentIndex + 1) % totalSlides);
                }, 5000); // Change slide every 5 seconds
            }
            
            function stopAutoplay() {
                clearInterval(autoplayInterval);
            }
            
            // Start autoplay
            startAutoplay();
            
            // Pause autoplay on hover
            carousel.addEventListener('mouseenter', stopAutoplay);
            carousel.addEventListener('mouseleave', startAutoplay);
            
            // Initial slide setup
            goToSlide(0);
        });
    }
    
    /**
     * Testimonials Tab Functionality
     * Handles switching between Tulum and Playa del Carmen reviews
     */
    function initTestimonialTabs() {
        // Get references to tab elements
        const tulumTab = document.getElementById('tulum-reviews-tab');
        const playaTab = document.getElementById('playa-reviews-tab');
        const tulumReviews = document.getElementById('tulum-reviews');
        const playaReviews = document.getElementById('playa-reviews');
        const viewMoreTulum = document.getElementById('view-more-tulum');
        const viewMorePlaya = document.getElementById('view-more-playa');
        
        // Skip if elements don't exist
        if (!tulumTab || !playaTab || !tulumReviews || !playaReviews) {
            console.log('Testimonials tabs: Required elements not found');
            return;
        }
        
        console.log('Testimonials tabs: Initializing');
        
        // Handle Tulum tab click
        tulumTab.addEventListener('click', function() {
            console.log('Tulum tab clicked');
            
            // Update tab styles
            tulumTab.classList.add('bg-accent');
            tulumTab.classList.remove('bg-dark', 'hover:bg-accent');
            playaTab.classList.add('bg-dark', 'hover:bg-accent');
            playaTab.classList.remove('bg-accent');
            
            // Show Tulum reviews, hide Playa reviews
            tulumReviews.classList.remove('hidden');
            playaReviews.classList.add('hidden');
            
            // Show the correct "View more" link
            if (viewMoreTulum) viewMoreTulum.classList.remove('hidden');
            if (viewMorePlaya) viewMorePlaya.classList.add('hidden');
        });
        
        // Handle Playa tab click
        playaTab.addEventListener('click', function() {
            console.log('Playa tab clicked');
            
            // Update tab styles
            playaTab.classList.add('bg-accent');
            playaTab.classList.remove('bg-dark', 'hover:bg-accent');
            tulumTab.classList.add('bg-dark', 'hover:bg-accent');
            tulumTab.classList.remove('bg-accent');
            
            // Show Playa reviews, hide Tulum reviews
            playaReviews.classList.remove('hidden');
            tulumReviews.classList.add('hidden');
            
            // Show the correct "View more" link
            if (viewMorePlaya) viewMorePlaya.classList.remove('hidden');
            if (viewMoreTulum) viewMoreTulum.classList.add('hidden');
        });
        
        console.log('Testimonials tabs: Initialized successfully');
    }

    // Initialize testimonial tabs
    initTestimonialTabs();

    /**
     * FAQ Accordion Functionality
     * Handles the opening and closing of FAQ items
     */
    function initFaqAccordion() {
        const faqToggles = document.querySelectorAll('.faq-toggle');
        
        faqToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                // Get the content panel
                const content = this.nextElementSibling;
                const icon = this.querySelector('i');
                
                // Toggle visibility
                content.classList.toggle('hidden');
                
                // Rotate icon when open
                if (!content.classList.contains('hidden')) {
                    icon.style.transform = 'rotate(180deg)';
                } else {
                    icon.style.transform = 'rotate(0)';
                }
            });
        });
    }

    // Initialize FAQ accordion
    initFaqAccordion();



    /**
     * Gallery functionality
     * Handles lightbox, filtering, and other gallery-related features
     */

    // Check if we're on the gallery page
    const isGalleryPage = document.getElementById('lightbox') !== null;

    if (isGalleryPage) {
        initGalleryTabs();
        initLightbox();
        initRoomGalleries();
        initLoadMoreButton();
    }

    /**
     * Initialize gallery tab functionality
     */
    function initGalleryTabs() {
        const allTabs = document.querySelectorAll('.gallery-tab');
        const allGalleryItems = document.querySelectorAll('.gallery-item');
        
        if (!allTabs.length || !allGalleryItems.length) return;
        
        allTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Update active tab styling
                allTabs.forEach(t => {
                    t.classList.remove('bg-primary', 'text-white');
                    t.classList.add('bg-white', 'text-primary');
                });
                
                this.classList.remove('bg-white', 'text-primary');
                this.classList.add('bg-primary', 'text-white');
                
                // Filter items
                const category = this.id.replace('-tab', '');
                
                allGalleryItems.forEach(item => {
                    if (category === 'all' || item.dataset.category === category) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
        
        // Set initial active tab
        const allTab = document.getElementById('all-tab');
        if (allTab) allTab.click();
    }

    /**
     * Initialize lightbox functionality
     */
    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('#lightbox .close');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        if (!lightbox || !lightboxImg) return;
        
        // Get all gallery items for navigation
        const galleryItems = document.querySelectorAll('.gallery-item');
        let currentIndex = 0;
        
        // Open lightbox function
        function openLightbox(index) {
            if (index >= 0 && index < galleryItems.length) {
                currentIndex = index;
                const img = galleryItems[currentIndex].querySelector('img');
                
                if (img) {
                    lightboxImg.src = img.src;
                    lightbox.classList.remove('hidden');
                    lightbox.classList.add('flex');
                    document.body.style.overflow = 'hidden';
                }
            }
        }
        
        // Close lightbox function
        function closeLightbox() {
            lightbox.classList.remove('flex');
            lightbox.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }
        
        // Navigate to next/previous image
        function navigate(direction) {
            currentIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;
            const img = galleryItems[currentIndex].querySelector('img');
            if (img) lightboxImg.src = img.src;
        }
        
        // Add click events to gallery items
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });
        
        // Close button event
        if (closeBtn) {
            closeBtn.addEventListener('click', closeLightbox);
        }
        
        // Click outside image to close
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) closeLightbox();
        });
        
        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                navigate(-1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                navigate(1);
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('flex')) return;
            
            switch(e.key) {
                case 'Escape': closeLightbox(); break;
                case 'ArrowLeft': navigate(-1); break;
                case 'ArrowRight': navigate(1); break;
            }
        });
    }

    /**
     * Initialize room gallery buttons
     */
    function initRoomGalleries() {
        const viewGalleryButtons = document.querySelectorAll('.view-gallery');
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        
        if (!viewGalleryButtons.length || !lightbox || !lightboxImg) return;
        
        viewGalleryButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const roomCard = this.closest('.overflow-hidden');
                const roomImage = roomCard.querySelector('img');
                
                if (roomImage) {
                    lightboxImg.src = roomImage.src;
                    lightbox.classList.remove('hidden');
                    lightbox.classList.add('flex');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    }

    /**
     * Initialize load more button
     */
    function initLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more');
        if (!loadMoreBtn) return;
        
        loadMoreBtn.addEventListener('click', function() {
            // Show loading state
            this.innerHTML = '<span>Loading...</span><i class="fa-solid fa-spinner fa-spin ml-2"></i>';
            
            const galleryContainer = document.querySelector('.grid');
            const existingItems = document.querySelectorAll('.gallery-item');
            
            setTimeout(() => {
                // Clone some existing items for demo
                for (let i = 0; i < Math.min(4, existingItems.length); i++) {
                    const clone = existingItems[i].cloneNode(true);
                    const categories = ['tulum', 'playa', 'amenities'];
                    clone.dataset.category = categories[Math.floor(Math.random() * categories.length)];
                    galleryContainer.appendChild(clone);
                }
                
                // Re-initialize lightbox for new items
                initLightbox();
                
                // Re-apply current filter
                const activeTab = document.querySelector('.gallery-tab.bg-primary');
                if (activeTab) {
                    const category = activeTab.id.replace('-tab', '');
                    const allItems = document.querySelectorAll('.gallery-item');
                    
                    allItems.forEach(item => {
                        if (category === 'all' || item.dataset.category === category) {
                            item.classList.remove('hidden');
                        } else {
                            item.classList.add('hidden');
                        }
                    });
                }
                
                // Reset button text
                this.innerHTML = '<span data-translate="gallery" data-key="loadMore">Load More</span><i class="fa-solid fa-circle-plus ml-2"></i>';
            }, 1000);
        });
    }
});

