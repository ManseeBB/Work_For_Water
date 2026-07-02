function initMain() {
    
    // Register GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // 1. Buoyancy Physics for "Learn more about me"
        // Elements float up from below with an elastic, water-like wobble
        gsap.set(".about-glass-panel", { y: 120, opacity: 0 }); // Initial submerged state

        ScrollTrigger.create({
            trigger: "#about",
            start: "top 85%", // Triggers when the top of the section hits 85% down the viewport
            onEnter: () => gsap.to(".about-glass-panel", {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power3.out", // Clean slide-in to match the portfolio grid
                overwrite: true
            }),
            onLeaveBack: () => gsap.to(".about-glass-panel", { y: 50, opacity: 0, duration: 0.6, overwrite: true })
        });

        // 2. Buoyancy Physics for the 9-Grid Portfolio Cards
        // Use batch to stagger them naturally as they enter the screen
        gsap.set(".bento-card", { y: 150, opacity: 0 }); // Initial submerged state

        ScrollTrigger.batch(".bento-card", {
            start: "top 90%",
            interval: 0.25, // Adds a distinct delay between each row appearing
            batchMax: 3, // Groups animations into rows (3 cards at a time)
            onEnter: batch => {
                batch.forEach(el => el.classList.remove('hover-ready'));
                gsap.to(batch, {
                    y: 0,
                    opacity: 1,
                    duration: 1.6, // Slowed down from 1.0s to 1.6s for a majestic glide
                    stagger: 0, // Cards within the same row animate simultaneously
                    ease: "power3.out",
                    overwrite: true,
                    onComplete: () => {
                        gsap.set(batch, { clearProps: "transform,opacity" });
                        batch.forEach(el => el.classList.add('hover-ready'));
                    }
                });
            },
            // Gracefully fade them out if you scroll back up
            onLeaveBack: batch => {
                batch.forEach(el => el.classList.remove('hover-ready'));
                gsap.to(batch, { y: 50, opacity: 0, duration: 0.4, stagger: 0, overwrite: true });
            }
        });
    }

    // Water Bubbles Flow Effect
    const bubblesContainer = document.getElementById('bubblesContainer');
    if (bubblesContainer) {
        for (let i = 0; i < 15; i++) {
            let bubble = document.createElement('div');
            bubble.classList.add('bubble');
            let size = Math.random() * 40 + 10;
            bubble.style.width = size + 'px';
            bubble.style.height = size + 'px';
            bubble.style.left = Math.random() * 100 + 'vw';
            bubble.style.animationDuration = (Math.random() * 15 + 12) + 's';
            bubble.style.animationDelay = (Math.random() * 5) + 's';
            bubblesContainer.appendChild(bubble);
        }

        // Flow up faster on scroll down
        window.addEventListener('scroll', () => {
            let scrolled = window.scrollY;
            bubblesContainer.style.transform = `translateY(-${scrolled * 0.15}px)`;
        });
    }

    // Initialize WebGL Fluid Simulation (Ripples)
    if (typeof $ !== 'undefined' && $.fn.ripples) {
        try {
            $('#webgl-water-bg').ripples({
                resolution: 512,
                dropRadius: 20,
                perturbance: 0.04,
            });

            // Add an automatic drop every 3 seconds to show it's alive
            setInterval(function() {
                if (document.hidden) return; // Prevent ripples accumulating
                var $el = $('#webgl-water-bg');
                var x = Math.random() * $el.outerWidth();
                var y = Math.random() * $el.outerHeight();
                var dropRadius = 20;
                var strength = 0.04 + Math.random() * 0.04;
                $el.ripples('drop', x, y, dropRadius, strength);
            }, 3000);
        } catch (e) {
            console.warn("WebGL Ripples failed to load or are unsupported.", e);
        }
    }
    // Handle Floating Socials Visibility
    const floatingSocials = document.querySelector('.floating-socials');
    if (floatingSocials) {
        const hasHero = document.querySelector('.hero') !== null;
        
        if (!hasHero) {
            // On subpages, show immediately
            floatingSocials.classList.add('visible');
        } else {
            // On homepage, show after scrolling past 50%
            window.addEventListener('scroll', () => {
                if (window.scrollY > window.innerHeight * 0.5) {
                    floatingSocials.classList.add('visible');
                } else {
                    floatingSocials.classList.remove('visible');
                }
            });
            // Check once on load
            if (window.scrollY > window.innerHeight * 0.5) {
                floatingSocials.classList.add('visible');
            }
        }
    }

    // Force GSAP to instantly reveal sections if accessed via Navbar
    document.querySelectorAll('.nav-links a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId.includes('#portfolio')) {
                gsap.killTweensOf(".bento-card");
                gsap.set(".bento-card", { y: 0, opacity: 1, clearProps: "transform,opacity" });
                document.querySelectorAll(".bento-card").forEach(el => el.classList.add('hover-ready'));
            } else if (targetId.includes('#about')) {
                gsap.killTweensOf(".about-glass-panel");
                gsap.set(".about-glass-panel", { y: 0, opacity: 1 });
            }
        });
    });

    // Navbar Dropdown Toggle logic for Mobile/Desktop click
    const dropdownToggle = document.querySelector('.nav-dropdown > a');
    const dropdownMenu = document.querySelector('.nav-dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');

    if (dropdownToggle && dropdownMenu && dropdownContent) {
        dropdownToggle.addEventListener('click', function(e) {
            // Check if dropdown is visually visible (either by hover or show class)
            const isVisuallyOpen = window.getComputedStyle(dropdownContent).visibility === 'visible' || dropdownMenu.classList.contains('show');
            
            if (!isVisuallyOpen) {
                // First click: prevent default link behavior and show the dropdown
                e.preventDefault();
                e.stopPropagation();
                dropdownMenu.classList.add('show');
                
                // Add a listener to close dropdown when clicking outside
                document.addEventListener('click', closeDropdownOutside);
            } else {
                // Second click or when already hovered on desktop: allow navigation
                dropdownMenu.classList.remove('show');
            }
        });

        function closeDropdownOutside(event) {
            if (!dropdownMenu.contains(event.target)) {
                dropdownMenu.classList.remove('show');
                document.removeEventListener('click', closeDropdownOutside);
            }
        }
    }

    // Dimensions Navigation Slider Logic
    const dimNav = document.querySelector('.dimensions-nav');
    if (dimNav) {
        const slider = dimNav.querySelector('.nav-slider');
        const links = dimNav.querySelectorAll('.dim-link');
        
        function updateSlider(element) {
            if (!element) return;
            const linkRect = element.getBoundingClientRect();
            const navRect = dimNav.getBoundingClientRect();
            
            // Calculate scroll position of the container if it's overflowing
            const scrollLeft = dimNav.scrollLeft;
            
            slider.style.left = `${linkRect.left - navRect.left + scrollLeft}px`;
            slider.style.width = `${linkRect.width}px`;
        }
        
        // Initial setup
        const activeLink = dimNav.querySelector('.active');
        if (activeLink) {
            setTimeout(() => {
                slider.style.transition = 'none';
                updateSlider(activeLink);
                // Center active item if scrollable
                const linkRect = activeLink.getBoundingClientRect();
                const navRect = dimNav.getBoundingClientRect();
                if (linkRect.right > navRect.right || linkRect.left < navRect.left) {
                    dimNav.scrollLeft = activeLink.offsetLeft - (navRect.width / 2) + (activeLink.offsetWidth / 2);
                }
                
                setTimeout(() => {
                    slider.style.transition = 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
                    // Re-update in case of any layout shifts after fonts loaded
                    updateSlider(activeLink);
                }, 50);
            }, 100);
        }

        // Handle clicks
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.classList.contains('active')) {
                    e.preventDefault();
                    return;
                }
                e.preventDefault();
                const targetHref = this.getAttribute('href');
                
                links.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                updateSlider(this);
                
                setTimeout(() => {
                    window.location.href = targetHref;
                }, 400); // Wait for transition
            });
        });
        
        window.addEventListener('resize', () => {
            const active = dimNav.querySelector('.active');
            if (active) updateSlider(active);
        });
    }

    // Make Connect Cards Entirely Clickable
    document.querySelectorAll('.connect-card').forEach(card => {
        // Skip if it's already an anchor tag (like the academic profiles)
        if (card.tagName.toLowerCase() === 'a') return;
        
        card.addEventListener('click', function(e) {
            // If they clicked on a phone link, don't open the website link
            if (e.target.closest('a[href^="tel"]')) {
                return; 
            }
            
            // Find the main web link inside the card
            const webLink = this.querySelector('a[href^="http"]');
            if (webLink) {
                if (webLink.getAttribute('target') === '_blank') {
                    window.open(webLink.href, '_blank');
                } else {
                    window.location.href = webLink.href;
                }
            }
        });
    });

    // Contact Form Handler
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const statusMsg = document.getElementById('form-status');
        const submitBtn = contactForm.querySelector('.submit-btn');
        const formLoadTime = Date.now(); // Record page/form load time for bot detection

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Reset status message
            statusMsg.className = 'form-status-message';
            statusMsg.textContent = '';
            statusMsg.style.display = 'none';

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            const website = document.getElementById('website').value;

            // Honeypot check for bots (Spam Protection)
            if (website) {
                console.warn('Bot submission intercepted via honeypot.');
                statusMsg.className = 'form-status-message success';
                statusMsg.textContent = 'Thank you! Your message has been sent successfully.';
                contactForm.reset();
                return;
            }

            // Submission speed check (Spam Protection - bots submit instantly)
            const timeElapsed = Date.now() - formLoadTime;
            if (timeElapsed < 3000) {
                console.warn('Bot submission intercepted via fast submission timing:', timeElapsed, 'ms');
                statusMsg.className = 'form-status-message success';
                statusMsg.textContent = 'Thank you! Your message has been sent successfully.';
                contactForm.reset();
                return;
            }

            // Simple validation
            if (!name || !email || !subject || !message) {
                statusMsg.classList.add('error');
                statusMsg.textContent = 'Please fill out all fields.';
                return;
            }

            // Email address regex check (Spam/Error Protection)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                statusMsg.classList.add('error');
                statusMsg.textContent = 'Please enter a valid email address.';
                return;
            }

            // Disable fields and button
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => input.disabled = true);
            submitBtn.disabled = true;
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, subject, message, website }),
                });

                const data = await response.json();

                if (response.ok) {
                    statusMsg.classList.add('success');
                    statusMsg.textContent = data.message || 'Thank you! Your message has been sent successfully.';
                    contactForm.reset();
                } else {
                    statusMsg.classList.add('error');
                    statusMsg.textContent = data.error || 'Failed to send message. Please try again later.';
                }
            } catch (error) {
                console.error('Error submitting contact form:', error);
                statusMsg.classList.add('error');
                statusMsg.textContent = 'A network error occurred. Please check your connection and try again.';
            } finally {
                // Re-enable inputs and reset button text
                inputs.forEach(input => input.disabled = false);
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    // 3D Cylinder Carousel for Teaching Cards (Dynamic Google Sheets CSV Integration)
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-nav-btn.prev');
    const nextBtn = document.querySelector('.carousel-nav-btn.next');
    const viewport = document.querySelector('.carousel-viewport');

    const TEACHING_CSV_URL = "data/teaching_slideshow.csv";

    if (track && typeof gsap !== 'undefined' && typeof Papa !== 'undefined') {
        const cacheBuster = `?t=${new Date().getTime()}`;
        Papa.parse(TEACHING_CSV_URL + cacheBuster, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                renderTeachingCards(results.data);
            },
            error: function(err) {
                console.error("Error loading teaching CSV from Google Sheets:", err);
            }
        });
    }

    function renderTeachingCards(data) {
        if (!data || data.length === 0) return;
        
        // Clear fallback cards
        track.innerHTML = '';
        
        data.forEach(item => {
            if (!item.Title || !item.Title.trim()) return;
            
            const card = document.createElement('div');
            card.className = `teaching-card ${item.Category_Color ? item.Category_Color.trim() : 'c-blue'}`;
            
            const cardBg = document.createElement('div');
            cardBg.className = 'card-bg';
            card.appendChild(cardBg);
            
            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'card-image-wrapper';
            
            const imgName = item.Image_Name ? item.Image_Name.trim() : '';
            const img = document.createElement('img');
            img.src = imgName ? `teaching/${imgName}` : 'Assests/3rd.jpg';
            img.alt = item.Title.trim();
            img.className = 'card-image';
            imgWrapper.appendChild(img);
            card.appendChild(imgWrapper);
            
            const cardContent = document.createElement('div');
            cardContent.className = 'card-content';
            
            const cardIcon = document.createElement('div');
            cardIcon.className = 'card-icon';
            const iconEl = document.createElement('i');
            
            let iconClass = 'fas fa-book';
            if (item.Icon && item.Icon.trim()) {
                iconClass = item.Icon.trim();
            } else {
                const combinedText = `${item.Title || ''} ${item.Description || ''}`.toLowerCase();
                if (combinedText.includes('yog') || combinedText.includes('spa') || combinedText.includes('meditat')) {
                    iconClass = 'fas fa-spa';
                } else if (combinedText.includes('water') || combinedText.includes('lake') || combinedText.includes('river') || combinedText.includes('wetland') || combinedText.includes('drain') || combinedText.includes('waterscape')) {
                    iconClass = 'fas fa-water';
                } else if (combinedText.includes('research') || combinedText.includes('thesis') || combinedText.includes('supervis') || combinedText.includes('method') || combinedText.includes('pedagogy')) {
                    iconClass = 'fas fa-graduation-cap';
                } else if (combinedText.includes('colour') || combinedText.includes('color') || combinedText.includes('palette') || combinedText.includes('paint') || combinedText.includes('rendering') || combinedText.includes('brush')) {
                    iconClass = 'fas fa-palette';
                } else if (combinedText.includes('open space') || combinedText.includes('tree') || combinedText.includes('park') || combinedText.includes('site') || combinedText.includes('pos')) {
                    iconClass = 'fas fa-tree';
                } else if (combinedText.includes('housing') || combinedText.includes('residential') || combinedText.includes('home') || combinedText.includes('house') || combinedText.includes('building')) {
                    iconClass = 'fas fa-home';
                } else if (combinedText.includes('journalism') || combinedText.includes('newspaper') || combinedText.includes('write') || combinedText.includes('document')) {
                    iconClass = 'fas fa-newspaper';
                } else if (combinedText.includes('collective') || combinedText.includes('social') || combinedText.includes('community') || combinedText.includes('people') || combinedText.includes('engineering')) {
                    iconClass = 'fas fa-users';
                }
            }
            iconEl.className = iconClass;
            cardIcon.appendChild(iconEl);
            cardContent.appendChild(cardIcon);
            
            const h3 = document.createElement('h3');
            h3.textContent = item.Title.trim();
            cardContent.appendChild(h3);
            
            const p = document.createElement('p');
            p.textContent = item.Description ? item.Description.trim() : '';
            cardContent.appendChild(p);
            
            const link = item.Link ? item.Link.trim() : '';
            if (link) {
                const a = document.createElement('a');
                a.href = link;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.className = 'course-outline-btn';
                a.innerHTML = `<i class="fas fa-file-pdf"></i> View Outline`;
                cardContent.appendChild(a);
            } else {
                const span = document.createElement('span');
                span.className = 'course-outline-btn';
                span.style.opacity = '0.6';
                span.style.cursor = 'default';
                span.innerHTML = `<i class="fas fa-info-circle"></i> Outline N/A`;
                cardContent.appendChild(span);
            }
            
            card.appendChild(cardContent);
            track.appendChild(card);
        });
        
        // Initialize the GSAP 3D Cylinder Carousel
        initCarousel();
    }

    function initCarousel() {
        const teachingCards = document.querySelectorAll('.teaching-card');
        const N = teachingCards.length;
        if (N === 0) return;
        
        let activeIndex = 0;
        let isAnimating = false;
        const animationDuration = 0.8; // seconds
        const lockDuration = 800; // milliseconds

        // Dynamically generate navigation dots
        const dotsContainer = document.querySelector('.carousel-dots');
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            teachingCards.forEach((card, idx) => {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot';
                dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
                
                // Copy category color class
                const colorClasses = ['c-blue', 'c-purple', 'c-orange', 'c-cyan', 'c-green'];
                colorClasses.forEach(cls => {
                    if (card.classList.contains(cls)) {
                        dot.classList.add(cls);
                    }
                });

                dot.onclick = (e) => {
                    e.stopPropagation();
                    if (idx !== activeIndex) {
                        triggerTransition(idx);
                    }
                };

                dotsContainer.appendChild(dot);
            });
        }

        function updateCarousel(nextIndex) {
            activeIndex = nextIndex;
            const w = window.innerWidth;
            const isMobile = w < 768;
            let radius = 200;
            let angleStep = 38;

            if (w >= 1500) {
                radius = 680;
                angleStep = 32;
            } else if (w >= 1200) {
                radius = 560;
                angleStep = 32;
            } else if (w >= 768) {
                radius = 420;
                angleStep = 32;
            }

            teachingCards.forEach((card, i) => {
                let diff = i - activeIndex;
                const half = Math.floor(N / 2);
                if (diff > half) diff -= N;
                if (diff < -half) diff += N;

                const absDiff = Math.abs(diff);
                const img = card.querySelector('.card-image');
                const content = card.querySelector('.card-content');

                // Toggle side classes for positioning content on inactive cards
                card.classList.remove('side-left', 'side-right');
                if (diff < 0) {
                    card.classList.add('side-left');
                } else if (diff > 0) {
                    card.classList.add('side-right');
                }

                // Enforce proper 3D stacking order to prevent overlapping outlines
                let zIndex = 0;
                if (diff === 0) zIndex = 10;
                else if (absDiff === 1) zIndex = 5;
                
                card.style.zIndex = zIndex;

                if (absDiff > 1) {
                    // Instantly hide card outside active zone to prevent overlapping in the back
                    gsap.to(card, {
                        opacity: 0,
                        x: diff > 0 ? radius * 1.5 : -radius * 1.5,
                        z: -radius * 1.5,
                        rotateY: diff > 0 ? 90 : -90,
                        scale: 0.4,
                        duration: animationDuration,
                        ease: "power2.out",
                        overwrite: "auto"
                    });
                    card.classList.remove('active-card');
                    card.style.filter = 'blur(8px)';

                    // Reset parallax shifts and scale when hidden
                    if (img) gsap.set(img, { x: 0, scale: 1.05 });
                    if (content) gsap.set(content, { clearProps: "x" });
                } else {
                    const angle = diff * angleStep;
                    const angleRad = angle * Math.PI / 180;
                    
                    // Curved wheel math
                    const tx = radius * Math.sin(angleRad);
                    const tz = radius * (Math.cos(angleRad) - 1);
                    
                    let opacity = 0;
                    let scale = 1;
                    let blurVal = 0;
                    let zOffset = 0;

                    if (diff === 0) {
                        opacity = 1;
                        scale = 1.0;
                        blurVal = 0;
                        zOffset = 0;
                        card.classList.add('active-card');
                    } else if (absDiff === 1) {
                        opacity = 0.90; // Solid opacity to show floating category icon box
                        scale = 0.82;
                        blurVal = 0;
                        zOffset = -150; // Setback adjacent cards to prevent 3D outline intersection
                        card.classList.remove('active-card');
                    }

                    // Animate position using GSAP
                    gsap.to(card, {
                        opacity: opacity,
                        x: tx,
                        z: tz + zOffset, // Apply Z-depth setback offset
                        rotateY: angle,
                        scale: scale,
                        duration: animationDuration,
                        ease: "power2.out",
                        overwrite: "auto"
                    });

                    // Horizontal Parallax Shifts inside the card & Subtle Scale-Up Transition
                    if (img) {
                        gsap.to(img, {
                            x: diff * -35, // Image shifts opposite to rotation direction
                            scale: diff === 0 ? 1.25 : 1.05,
                            duration: animationDuration,
                            ease: "power2.out",
                            overwrite: "auto"
                        });
                    }

                    if (content) {
                        // Let CSS transitions handle card content animations for a premium slide-out effect
                        gsap.set(content, { clearProps: "x" });
                    }

                    // Set blur filter
                    card.style.filter = 'none';
                }
            });

            // Update Controls
            const indicator = document.querySelector('.carousel-indicator');
            if (indicator) {
                indicator.textContent = `${activeIndex + 1} / ${N}`;
            }

            const progressFill = document.querySelector('.carousel-progress-fill');
            if (progressFill) {
                const percent = (activeIndex / (N - 1)) * 100;
                progressFill.style.width = `${percent}%`;
            }

            // Sync navigation dots active state
            const dots = document.querySelectorAll('.carousel-dot');
            dots.forEach((dot, idx) => {
                if (idx === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // Action Trigger
        function triggerTransition(targetIndex) {
            if (isAnimating) return;
            isAnimating = true;
            
            updateCarousel(targetIndex);
            
            setTimeout(() => {
                isAnimating = false;
            }, lockDuration);
        }

        // Navigation Clicks
        if (prevBtn) {
            prevBtn.onclick = (e) => {
                e.stopPropagation();
                if (activeIndex > 0) {
                    triggerTransition(activeIndex - 1);
                } else {
                    // Wrap around
                    triggerTransition(N - 1);
                }
            };
        }

        if (nextBtn) {
            nextBtn.onclick = (e) => {
                e.stopPropagation();
                if (activeIndex < N - 1) {
                    triggerTransition(activeIndex + 1);
                } else {
                    // Wrap around
                    triggerTransition(0);
                }
            };
        }

        // Less Sensitive Scroll direction trigger (Mouse Wheel & Trackpad)
        let scrollAccumulator = 0;
        const scrollThreshold = 120; // Lower sensitivity: requires deliberate scrolling
        let scrollTimeout = null;

        if (viewport) {
            viewport.onwheel = (e) => {
                const delta = e.deltaY;
                
                // Accumulate scroll input delta
                scrollAccumulator += delta;
                
                // Reset accumulator after scroll stops (200ms timeout)
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    scrollAccumulator = 0;
                }, 200);

                if (Math.abs(scrollAccumulator) >= scrollThreshold) {
                    const direction = scrollAccumulator > 0 ? 1 : -1;
                    scrollAccumulator = 0; // reset accumulator

                    if (direction > 0) {
                        if (activeIndex < N - 1) {
                            e.preventDefault();
                            triggerTransition(activeIndex + 1);
                        }
                    } else {
                        if (activeIndex > 0) {
                            e.preventDefault();
                            triggerTransition(activeIndex - 1);
                        }
                    }
                } else {
                    // Prevent page scroll while navigating carousel boundaries
                    if ((scrollAccumulator > 0 && activeIndex < N - 1) || 
                        (scrollAccumulator < 0 && activeIndex > 0)) {
                        e.preventDefault();
                    }
                }
            };
        }

        // Mobile Swipe Triggers
        if (viewport) {
            let touchStartY = 0;
            let touchStartX = 0;

            viewport.ontouchstart = (e) => {
                touchStartY = e.touches[0].clientY;
                touchStartX = e.touches[0].clientX;
            };

            viewport.ontouchmove = (e) => {
                if (isAnimating) {
                    e.preventDefault();
                    return;
                }

                const touchEndY = e.touches[0].clientY;
                const touchEndX = e.touches[0].clientX;
                
                const diffY = touchStartY - touchEndY;
                const diffX = touchStartX - touchEndX;

                // We track both vertical and horizontal swipes since it's a horizontal cylinder
                if (Math.abs(diffY) > 40 || Math.abs(diffX) > 40) {
                    // If vertical swipe dominates
                    if (Math.abs(diffY) > Math.abs(diffX)) {
                        if (diffY > 0) {
                            if (activeIndex < N - 1) {
                                e.preventDefault();
                                triggerTransition(activeIndex + 1);
                            }
                        } else {
                            if (activeIndex > 0) {
                                e.preventDefault();
                                triggerTransition(activeIndex - 1);
                            }
                        }
                    } else { // If horizontal swipe dominates
                        if (diffX > 0) {
                            if (activeIndex < N - 1) {
                                e.preventDefault();
                                triggerTransition(activeIndex + 1);
                            }
                        } else {
                            if (activeIndex > 0) {
                                e.preventDefault();
                                triggerTransition(activeIndex - 1);
                            }
                        }
                    }
                    touchStartY = touchEndY;
                    touchStartX = touchEndX;
                }
            };
        }

        // Initialize state
        updateCarousel(0);
        
        // Window resize handler for adjusting radius on the fly
        window.onresize = () => {
            updateCarousel(activeIndex);
        };
    }

    // Dynamic Academic Credentials from Google Sheets
    const CREDENTIALS_CSV_URL = "data/teaching_credentials.csv";

    const tabsTrack = document.querySelector('.teaching-tabs');
    if (tabsTrack && typeof Papa !== 'undefined') {
        const cacheBuster = `?t=${new Date().getTime()}`;
        Papa.parse(CREDENTIALS_CSV_URL + cacheBuster, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                renderCredentials(results.data);
            },
            error: function(err) {
                console.error("Error loading academic credentials CSV from Google Sheets:", err);
            }
        });
    }

    function renderCredentials(data) {
        if (!data || data.length === 0) return;

        // Map Category to pane ID and icon class (normalized keys in lowercase)
        const categoryMap = {
            "jury member": { name: "Jury Member", id: "jury", icon: "fas fa-check-circle" },
            "undergrad theses": { name: "Undergrad Theses", id: "undergrad", icon: "fas fa-book" },
            "postgrad theses": { name: "Postgrad Theses", id: "postgrad", icon: "fas fa-award" },
            "special courses": { name: "Special Courses", id: "special", icon: "fas fa-certificate" }
        };

        const tabsContainer = document.querySelector('.teaching-tabs');
        const tabContentContainer = document.querySelector('.tab-content');

        // Clear existing default lists
        ["jury member", "undergrad theses", "postgrad theses", "special courses"].forEach(key => {
            const cat = categoryMap[key];
            const list = document.querySelector(`#${cat.id} .credentials-list`);
            if (list) list.innerHTML = '';
        });

        // Cleanly remove any dynamically created tab buttons and panes from previous loads
        if (tabsContainer && tabContentContainer) {
            const allPanes = tabContentContainer.querySelectorAll('.tab-pane');
            allPanes.forEach(pane => {
                if (!['jury', 'undergrad', 'postgrad', 'special'].includes(pane.id)) {
                    pane.remove();
                }
            });
            const allBtns = tabsContainer.querySelectorAll('.tab-btn');
            allBtns.forEach(btn => {
                const dataTab = btn.getAttribute('data-tab');
                if (!['jury', 'undergrad', 'postgrad', 'special'].includes(dataTab)) {
                    btn.remove();
                }
            });
        }

        data.forEach(item => {
            let category = item.Category ? item.Category.trim() : '';
            const content = item.Content ? item.Content.trim() : '';
            const link = item.Link ? item.Link.trim() : '';

            if (!content) return; // Skip rows with no content

            if (!category) {
                category = "Category N/A";
            }

            const normKey = category.toLowerCase();

            // Dynamically generate new tab buttons and panes if they don't match the defaults
            if (!categoryMap[normKey]) {
                const sanitizedId = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                
                // Add to map
                categoryMap[normKey] = { name: category, id: sanitizedId, icon: "fas fa-info-circle" };
                
                // Set icon based on category keywords
                const lowerCat = category.toLowerCase();
                if (lowerCat.includes('phd') || lowerCat.includes('advising') || lowerCat.includes('supervis') || lowerCat.includes('teach')) {
                    categoryMap[normKey].icon = "fas fa-graduation-cap";
                } else if (lowerCat.includes('lecture') || lowerCat.includes('talk') || lowerCat.includes('invited') || lowerCat.includes('speak')) {
                    categoryMap[normKey].icon = "fas fa-microphone";
                } else if (lowerCat.includes('award') || lowerCat.includes('honor') || lowerCat.includes('credit')) {
                    categoryMap[normKey].icon = "fas fa-award";
                } else if (lowerCat.includes('publication') || lowerCat.includes('paper') || lowerCat.includes('book')) {
                    categoryMap[normKey].icon = "fas fa-book-open";
                } else if (lowerCat.includes('n/a') || lowerCat.includes('other')) {
                    categoryMap[normKey].icon = "fas fa-folder-open";
                }

                // Append new tab button
                if (tabsContainer) {
                    const newBtn = document.createElement('button');
                    newBtn.className = 'tab-btn';
                    newBtn.setAttribute('data-tab', sanitizedId);
                    newBtn.innerHTML = `<i class="${categoryMap[normKey].icon}"></i> ${category}`;
                    tabsContainer.appendChild(newBtn);
                }

                // Append new tab pane
                if (tabContentContainer) {
                    const newPane = document.createElement('div');
                    newPane.className = 'tab-pane';
                    newPane.id = sanitizedId;
                    
                    const newList = document.createElement('ul');
                    newList.className = 'credentials-list';
                    newPane.appendChild(newList);
                    
                    tabContentContainer.appendChild(newPane);
                }
            }

            const mapConfig = categoryMap[normKey];
            const list = document.querySelector(`#${mapConfig.id} .credentials-list`);
            if (!list) return;

            const li = document.createElement('li');
            
            // Icon
            const icon = document.createElement('i');
            icon.className = mapConfig.icon;
            li.appendChild(icon);

            // Text and Link container span
            const textSpan = document.createElement('span');
            
            // Format Thesis/Advising items (names before the first colon) as bold
            const isThesisCategory = normKey.includes('theses') || normKey.includes('thesis') || normKey.includes('supervision') || normKey.includes('advising') || normKey.includes('phd');
            if (isThesisCategory && content.includes(':')) {
                const colonIndex = content.indexOf(':');
                const namePart = content.substring(0, colonIndex);
                const restPart = content.substring(colonIndex); // Includes the colon itself
                
                const strong = document.createElement('strong');
                strong.textContent = namePart;
                textSpan.appendChild(strong);
                
                const restText = document.createTextNode(restPart);
                textSpan.appendChild(restText);
            } else {
                textSpan.appendChild(document.createTextNode(content));
            }

            // Append "Read More" Link if present
            if (link) {
                const a = document.createElement('a');
                a.href = link;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.style.color = 'var(--accent)';
                a.style.textDecoration = 'none';
                a.style.borderBottom = '1px dashed var(--accent)';
                a.style.marginLeft = '4px';
                a.style.fontWeight = '500';
                a.style.whiteSpace = 'nowrap';
                a.innerHTML = `Read More <i class="fas fa-external-link-alt" style="font-size: 0.7rem; margin-left: 2px;"></i>`;
                textSpan.appendChild(a);
            }

            li.appendChild(textSpan);
            list.appendChild(li);
        });
    }

    // Teaching Credentials Tab Switching (Event Delegation for Dynamic Tabs)
    const tabsContainer = document.querySelector('.teaching-tabs');
    if (tabsContainer) {
        tabsContainer.addEventListener('click', function(e) {
            const btn = e.target.closest('.tab-btn');
            if (!btn) return;
            
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and panes
            const allBtns = tabsContainer.querySelectorAll('.tab-btn');
            const allPanes = document.querySelectorAll('.tab-pane');
            
            allBtns.forEach(b => b.classList.remove('active'));
            allPanes.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    }

    // Initialize Research Page Logic
    initResearch();

}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMain);
} else {
    initMain();
}

// River Flow Toggle Logic
function toggleReveal(btn, id) {
    const wrapper = document.getElementById(id);
    const isExpanded = wrapper.classList.contains('expanded');
    
    // Close all other wrappers
    document.querySelectorAll('.reveal-wrapper').forEach(el => {
        el.classList.remove('expanded');
    });
    
    // If we clicked a closed one, open it
    if (!isExpanded) {
        wrapper.classList.add('expanded');
        
        // Smooth scroll to position slightly above the button after animation starts
        setTimeout(() => {
            const y = btn.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }, 400);
    }
}

// ---------------------------------------------------------
// DYNAMIC MIND-MAP GENERATION FROM CSV (Google Sheets)
// ---------------------------------------------------------

// Change this URL to your Google Sheets Published CSV link later!
const SPREADSHEET_CSV_URL = "data/projects_database.csv";

const CATEGORY_MAP = {
    "Institutional": { num: "01", icon: "fa-university", color: "c-blue", title: "Institutional<br>& Campus" },
    "Heritage": { num: "02", icon: "fa-vihara", color: "c-green", title: "Heritage<br>Conservation" },
    "Residential": { num: "03", icon: "fa-home", color: "c-orange", title: "Residential<br>& Hospitality" },
    "Environmental": { num: "04", icon: "fa-leaf", color: "c-purple", title: "Environmental<br>Rehab" },
    "Urban": { num: "05", icon: "fa-city", color: "c-cyan", title: "Urban Design<br>& Regional" }
};

function initMindMap() {
    const container = document.getElementById("dynamic-mindmap");
    if (!container) return; // Only run on practice.html

    if (typeof Papa !== 'undefined') {
        const cacheBuster = `?t=${new Date().getTime()}`;
        Papa.parse(SPREADSHEET_CSV_URL + cacheBuster, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                renderMindMap(results.data);
                // Draw connections after DOM has rendered
                setTimeout(drawConnections, 100);
            },
            error: function(err) {
                console.error("Error fetching CSV:", err);
                container.innerHTML = "<p style='color:white; text-align:center;'>Error loading projects. Please check the CSV link.</p>";
            }
        });
    }

    window.addEventListener('resize', () => {
        requestAnimationFrame(drawConnections);
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMindMap);
} else {
    initMindMap();
}

function renderMindMap(projects) {
    const container = document.getElementById("dynamic-mindmap");
    container.innerHTML = ""; // Clear existing

    // Group projects by category
    const grouped = {};
    Object.keys(CATEGORY_MAP).forEach(cat => grouped[cat] = []);

    projects.forEach(p => {
        let cat = p.Category ? p.Category.trim() : "";
        if (grouped[cat]) {
            grouped[cat].push(p);
        }
    });

    const categoryKeys = Object.keys(grouped);

    categoryKeys.forEach((catKey, index) => {
        const catProjects = grouped[catKey];
        if (catProjects.length === 0) return; // Skip empty categories

        const meta = CATEGORY_MAP[catKey];
        const isLast = index === categoryKeys.length - 1;

        // Split projects into left and right columns
        const leftProjects = [];
        const rightProjects = [];
        catProjects.forEach((p, i) => {
            if (i % 2 === 0) leftProjects.push(p);
            else rightProjects.push(p);
        });

        // Build HTML string
        let html = `<div class="flow-row ${meta.color}">`;

        // LEFT COLUMN
        html += `<div class="projects-column left-projects">`;
        leftProjects.forEach(p => {
            html += `
                <div class="floating-project">
                    <img src="${p.ImageName && p.ImageName.startsWith('http') ? p.ImageName : 'Assests/' + (p.ImageName || 'default.jpg')}" class="proj-thumb" alt="${p.Title}">
                    <div class="proj-text">
                        <h4>${p.Title}</h4>
                        <p>${p.Description} ${p.Link ? `<br><a href="${p.Link}" target="_blank" class="external-link" style="margin-top:5px; display:inline-block; color:var(--accent);">Visit Link ➔</a>` : ''}</p>
                        <a href="#" class="toggle-details">View Details ➔</a>
                    </div>
                </div>
            `;
        });
        html += `</div>`;

        // LEFT CONNECTION SVG
        html += `
            <div class="connection-area">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="conn-svg left-svg"></svg>
            </div>
        `;

        // CENTER COLUMN
        html += `
            <div class="center-column">
                <div class="vertical-line top-line" style="${index === 0 ? 'background: transparent; border: none;' : ''}"></div>
                <div class="node-circle">
                    <span class="node-num">${meta.num}</span>
                    <i class="fas ${meta.icon}"></i>
                    <span class="node-title">${meta.title}</span>
                </div>
                ${!isLast ? '<div class="vertical-line bottom-arrow"></div>' : '<div class="vertical-line" style="background: transparent; border: none;"></div>'}
            </div>
        `;

        // RIGHT CONNECTION SVG
        html += `
            <div class="connection-area">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" class="conn-svg right-svg"></svg>
            </div>
        `;

        // RIGHT COLUMN
        html += `<div class="projects-column right-projects">`;
        rightProjects.forEach(p => {
            html += `
                <div class="floating-project">
                    <img src="${p.ImageName && p.ImageName.startsWith('http') ? p.ImageName : 'Assests/' + (p.ImageName || 'default.jpg')}" class="proj-thumb" alt="${p.Title}">
                    <div class="proj-text">
                        <h4>${p.Title}</h4>
                        <p>${p.Description} ${p.Link ? `<br><a href="${p.Link}" target="_blank" class="external-link" style="margin-top:5px; display:inline-block; color:var(--accent);">Visit Link ➔</a>` : ''}</p>
                        <a href="#" class="toggle-details">View Details ➔</a>
                    </div>
                </div>
            `;
        });
        html += `</div>`;

        html += `</div>`; // End flow-row
        container.insertAdjacentHTML('beforeend', html);
    });
}

function drawConnections() {
    document.querySelectorAll('.flow-row').forEach(row => {
        const leftArea = row.querySelector('.left-svg');
        const rightArea = row.querySelector('.right-svg');
        const centerNode = row.querySelector('.node-circle');
        
        if (!centerNode) return;
        const centerRect = centerNode.getBoundingClientRect();

        // Draw Left Connections
        if (leftArea) {
            const leftProjects = row.querySelectorAll('.left-projects .floating-project');
            const svgRect = leftArea.getBoundingClientRect();
            let leftPaths = '';
            
            leftProjects.forEach(proj => {
                const projRect = proj.getBoundingClientRect();
                
                // Map screen coordinates to SVG viewBox (0-100)
                const projCenterY = (projRect.top + projRect.height/2) - svgRect.top;
                const svgY = (projCenterY / svgRect.height) * 100;
                
                const centerCenterY = (centerRect.top + centerRect.height/2) - svgRect.top;
                const svgCenterY = (centerCenterY / svgRect.height) * 100;
                
                leftPaths += `<path d="M100,${svgCenterY} C50,${svgCenterY} 50,${svgY} 0,${svgY}" class="conn-line" />`;
            });
            leftArea.innerHTML = leftPaths;
        }

        // Draw Right Connections
        if (rightArea) {
            const rightProjects = row.querySelectorAll('.right-projects .floating-project');
            const svgRect = rightArea.getBoundingClientRect();
            let rightPaths = '';
            
            rightProjects.forEach(proj => {
                const projRect = proj.getBoundingClientRect();
                
                // Map screen coordinates to SVG viewBox (0-100)
                const projCenterY = (projRect.top + projRect.height/2) - svgRect.top;
                const svgY = (projCenterY / svgRect.height) * 100;
                
                const centerCenterY = (centerRect.top + centerRect.height/2) - svgRect.top;
                const svgCenterY = (centerCenterY / svgRect.height) * 100;
                
                rightPaths += `<path d="M0,${svgCenterY} C50,${svgCenterY} 50,${svgY} 100,${svgY}" class="conn-line" />`;
            });
            rightArea.innerHTML = rightPaths;
        }
    });
}

// Event Delegation for Accordion Toggle
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('toggle-details')) {
        e.preventDefault();
        const project = e.target.closest('.floating-project');
        project.classList.toggle('expanded');
        if (project.classList.contains('expanded')) {
            e.target.innerText = 'Close Details ➔';
        } else {
            e.target.innerText = 'View Details ➔';
        }
        // Redraw connections immediately and also after transition completes
        drawConnections();
        setTimeout(drawConnections, 400);
    }
});

// ---------------------------------------------------------
// DYNAMIC RESEARCH PAGE 3D SEPTAGON TUNNEL & REAL-TIME SEARCH
// ---------------------------------------------------------

const RESEARCH_CSV_URL = "data/research.csv";
const RESEARCH_CACHE_KEY = "mbb_publications_data";

// Map category names from CSV to sidebar navigation buttons and details panels
const RESEARCH_CATEGORIES = [
    { name: "Books", icon: "fa-book" },
    { name: "Articles", icon: "fa-newspaper" },
    { name: "Book Chapters", icon: "fa-bookmark" },
    { name: "Published Essays and Reports", icon: "fa-file-alt" },
    { name: "Thesis", icon: "fa-graduation-cap" },
    { name: "Professional Reports (Team Member)", icon: "fa-users-cog" },
    { name: "Papers, Presentations & Participations in Conferences, Seminars, Workshops, Symposia", icon: "fa-comments" }
];

let allPublications = [];
let currentCategoryIndex = 0;

function initResearch() {
    const gridSection = document.getElementById("publications-grid-section");
    if (!gridSection) return; // Only run on research.html
    
    const searchInput = document.getElementById("grid-search-input");
    const resultsCount = document.getElementById("grid-results-count");
    const clearBtn = document.getElementById("grid-search-clear");
    const navButtons = document.querySelectorAll(".category-card");
    const loadingWrapper = document.getElementById("research-loading-wrapper");
    
    // Set up navigation menu click handlers
    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const index = parseInt(btn.getAttribute("data-index"));
            setActiveCategory(index);
        });
    });

    // Lightbox Modal Interaction Setup
    const lightboxModal = document.getElementById("premium-lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxCaption = document.getElementById("lightbox-caption");
    const lightboxCloseBtn = document.querySelector(".lightbox-close");
    const marqueeCards = document.querySelectorAll(".marquee-img-card");

    if (lightboxModal && lightboxImg && lightboxCaption) {
        // Open lightbox when clicking on marquee image cards
        marqueeCards.forEach(card => {
            card.addEventListener("click", () => {
                const fullSrc = card.getAttribute("data-full");
                const captionText = card.getAttribute("data-caption");
                
                lightboxImg.src = fullSrc;
                lightboxCaption.textContent = captionText || "";
                
                // Show modal display flex
                lightboxModal.style.display = "flex";
                
                // Trigger transition in the next animation frame
                requestAnimationFrame(() => {
                    lightboxModal.classList.add("active");
                });
                
                // Disable background body scrolling
                document.body.style.overflow = "hidden";
            });
        });

        // Function to close lightbox with fade-out animation
        const closeLightbox = () => {
            lightboxModal.classList.remove("active");
            
            // Wait for transition to complete before setting display to none
            setTimeout(() => {
                lightboxModal.style.display = "none";
                lightboxImg.src = "";
                lightboxCaption.textContent = "";
            }, 400); // Matches CSS transition duration (0.4s)
            
            // Restore background body scrolling
            document.body.style.overflow = "";
        };

        // Close on clicking the X button
        if (lightboxCloseBtn) {
            lightboxCloseBtn.addEventListener("click", closeLightbox);
        }

        // Close on clicking outside the image container (the dark overlay backdrop)
        lightboxModal.addEventListener("click", (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });

        // Close on pressing Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && lightboxModal.classList.contains("active")) {
                closeLightbox();
            }
        });
    }

    // Load from cache first for instant load in memory
    const cachedData = localStorage.getItem(RESEARCH_CACHE_KEY);
    if (cachedData) {
        try {
            allPublications = JSON.parse(cachedData);
            renderShowcase(allPublications, currentCategoryIndex);
        } catch (e) {
            console.warn("Failed to parse cached publications data", e);
        }
    }

    // Always show loading spinner on initial load to avoid layout flashes or stale content flashes
    if (loadingWrapper) loadingWrapper.style.display = "flex";
    if (gridSection) gridSection.style.display = "none";
    
    // Fetch fresh data from CSV
    if (typeof Papa !== 'undefined') {
        const cacheBuster = `?t=${new Date().getTime()}`;
        Papa.parse(RESEARCH_CSV_URL + cacheBuster, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                const freshData = results.data;
                
                if (freshData && freshData.length > 0) {
                    const serializedFresh = JSON.stringify(freshData);
                    if (serializedFresh !== cachedData) {
                        localStorage.setItem(RESEARCH_CACHE_KEY, serializedFresh);
                    }
                    allPublications = freshData;
                    renderShowcase(allPublications, currentCategoryIndex);
                }

                // Hide loader and show content now that everything is loaded correctly
                const latestLoadingWrapper = document.getElementById("research-loading-wrapper");
                const latestGridSection = document.getElementById("publications-grid-section");
                if (latestLoadingWrapper) latestLoadingWrapper.style.display = "none";
                if (latestGridSection) latestGridSection.style.display = "block";

                // Re-trigger search filter if there is active search term
                if (searchInput && searchInput.value.trim()) {
                    handleSearch(searchInput.value, allPublications, resultsCount, clearBtn);
                } else {
                    if (resultsCount) {
                        const items = allPublications.filter(p => p.Category === RESEARCH_CATEGORIES[currentCategoryIndex].name);
                        resultsCount.textContent = `${items.length} entries`;
                    }
                }
            },
            error: function(err) {
                console.error("Error fetching publications CSV:", err);
                
                // Fallback to cache if we have cached data parsed in memory
                if (allPublications && allPublications.length > 0) {
                    const latestLoadingWrapper = document.getElementById("research-loading-wrapper");
                    const latestGridSection = document.getElementById("publications-grid-section");
                    if (latestLoadingWrapper) latestLoadingWrapper.style.display = "none";
                    if (latestGridSection) latestGridSection.style.display = "block";
                    return;
                }

                const latestLoadingWrapper = document.getElementById("research-loading-wrapper");
                if (latestLoadingWrapper) {
                    latestLoadingWrapper.innerHTML = `
                        <i class="fas fa-exclamation-triangle" style="font-size: 2.5rem; color: #ff5a5f; margin-bottom: 1rem;"></i>
                        <p style="color: rgba(255,255,255,0.6); font-family: var(--font-heading);">Failed to load publications database.</p>
                    `;
                }
                if (!allPublications.length && resultsCount) {
                    resultsCount.textContent = "Error loading publications.";
                }
            }
        });
    }

    // Set up search event listeners
    if (searchInput) {
        searchInput.addEventListener("input", function() {
            handleSearch(this.value, allPublications, resultsCount, clearBtn);
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener("click", function() {
            if (searchInput) searchInput.value = "";
            handleSearch("", allPublications, resultsCount, clearBtn);
            if (searchInput) searchInput.focus();
        });
    }

    // Initialize category
    setActiveCategory(0, true);
}

function setActiveCategory(index, isInit = false) {
    if (index < 0 || index >= RESEARCH_CATEGORIES.length) return;
    currentCategoryIndex = index;
    
    const navButtons = document.querySelectorAll(".category-card");
    
    // Update active nav button
    navButtons.forEach(btn => {
        const btnIndex = parseInt(btn.getAttribute("data-index"));
        if (btnIndex === index) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    // Clear search input when switching categories
    const searchInput = document.getElementById("grid-search-input");
    const clearBtn = document.getElementById("grid-search-clear");
    if (searchInput) searchInput.value = "";
    if (clearBtn) clearBtn.style.display = "none";
    
    // Load category publications in grid
    if (allPublications.length > 0) {
        loadCategoryPublications(allPublications, index);
    }
}

function loadCategoryPublications(publications, catIndex, searchQuery = "") {
    const categoryMeta = RESEARCH_CATEGORIES[catIndex];
    const gridContainer = document.getElementById("publications-grid");
    const resultsCount = document.getElementById("grid-results-count");
    
    if (!gridContainer) return;
    
    // Filter publications by active category name
    let items = publications.filter(p => p.Category === categoryMeta.name);
    
    // Apply search filter if searchQuery exists
    const query = searchQuery.trim().toLowerCase();
    const keywords = query.split(/\s+/).filter(k => k.length > 0);
    
    if (keywords.length > 0) {
        items = items.filter(item => {
            const titleText = (item.Title || "").toLowerCase();
            const descText = (item.Description || "").toLowerCase();
            const typeText = (item.Type || "").toLowerCase();
            const combinedText = `${titleText} ${descText} ${typeText}`;
            return keywords.every(kw => combinedText.includes(kw));
        });
    }
    
    // Update results count
    if (resultsCount) {
        resultsCount.textContent = `${items.length} entry${items.length === 1 ? '' : 'ies'}`;
    }

    if (items.length === 0) {
        if (keywords.length > 0) {
            gridContainer.innerHTML = `
                <div style="grid-column: 1 / -1; padding: 4rem 1rem; text-align: center; color: rgba(255,255,255,0.4);">
                    <i class="fas fa-search-minus" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--accent); opacity: 0.6;"></i>
                    <p style="font-size: 1.1rem; margin: 0;">No matching entries found in this category.</p>
                </div>`;
        } else {
            gridContainer.innerHTML = `
                <div style="grid-column: 1 / -1; padding: 4rem 1rem; text-align: center; color: rgba(255,255,255,0.4);">
                    No publications found in this category.
                </div>`;
        }
        return;
    }

    let html = "";
    items.forEach((item) => {
        const tags = getTags(item);
        
        // Extract first tag (Type) and remaining tags
        const typeTag = tags[0] || item.Type || "Publication";
        const otherTags = tags.slice(1);
        
        // Highlight search keywords if active
        let titleHTML = item.Title || "";
        let descHTML = item.Description || "";
        
        if (keywords.length > 0) {
            titleHTML = highlightText(titleHTML, keywords);
            descHTML = highlightText(descHTML, keywords);
        } else {
            titleHTML = escapeHtml(titleHTML);
            descHTML = escapeHtml(descHTML);
        }

        const titleTag = item.Link ? 
            `<a href="${item.Link}" target="_blank" rel="noopener noreferrer" class="pub-card-title-link">${titleHTML} <i class="fas fa-external-link-alt"></i></a>` :
            titleHTML;

        // Custom category colors for borders/text matching our CSS vars
        const catColor = getCategoryColor(catIndex);

        html += `
            <div class="pub-card" style="--cat-color: ${catColor};">
                <span class="pub-card-cat">${escapeHtml(categoryMeta.name.split(' in ')[0])}</span>
                <h4 class="pub-card-title">${titleTag}</h4>
                ${item.Description ? `<p class="pub-card-desc">${descHTML}</p>` : ''}
                <div class="pub-card-tags">
                    <span class="pub-card-tag tag-type">${escapeHtml(typeTag)}</span>
                    ${otherTags.map(tag => `<span class="pub-card-tag">${escapeHtml(tag)}</span>`).join('')}
                </div>
            </div>
        `;
    });
    gridContainer.innerHTML = html;
}

function renderShowcase(publications, activeIndex) {
    // Dynamically calculate category counts for category cards
    RESEARCH_CATEGORIES.forEach((catMeta, idx) => {
        const items = publications.filter(p => p.Category === catMeta.name);
        const card = document.querySelector(`.category-card[data-index="${idx}"]`);
        if (card) {
            const countEl = card.querySelector('.cat-count');
            if (countEl) {
                countEl.textContent = items.length;
            }
        }
    });

    loadCategoryPublications(publications, activeIndex);
}

function handleSearch(query, publications, countEl, clearBtn) {
    const trimmed = query.trim();
    const gridContainer = document.getElementById("publications-grid");
    
    if (trimmed) {
        if (clearBtn) clearBtn.style.display = "flex";
    } else {
        if (clearBtn) clearBtn.style.display = "none";
        
        loadCategoryPublications(publications, currentCategoryIndex);
        return;
    }

    const keywords = trimmed.toLowerCase().split(/\s+/).filter(k => k.length > 0);
    let totalMatches = 0;
    let html = "";

    publications.forEach((item) => {
        const titleText = item.Title || "";
        const descText = item.Description || "";
        const typeText = item.Type || "";
        
        const searchContent = `${titleText} ${descText} ${typeText} ${item.Category}`.toLowerCase();
        const matchesAll = keywords.every(kw => searchContent.includes(kw));

        if (matchesAll) {
            totalMatches++;
            const highlightedTitleText = highlightText(titleText, keywords);
            const highlightedDescText = highlightText(descText, keywords);
            
            const titleHTML = item.Link ? 
                `<a href="${item.Link}" target="_blank" rel="noopener noreferrer" class="pub-card-title-link">${highlightedTitleText} <i class="fas fa-external-link-alt"></i></a>` :
                highlightedTitleText;

            const catIdx = RESEARCH_CATEGORIES.findIndex(c => c.name === item.Category);
            const catColor = getCategoryColor(catIdx !== -1 ? catIdx : 0);
            const catName = item.Category.split(' in ')[0];

            const tags = getTags(item);
            const typeTag = tags[0] || item.Type || "Publication";
            const otherTags = tags.slice(1);

            html += `
                <div class="pub-card" style="--cat-color: ${catColor};">
                    <span class="pub-card-cat">${escapeHtml(catName)}</span>
                    <h4 class="pub-card-title">${titleHTML}</h4>
                    ${item.Description ? `<p class="pub-card-desc">${highlightedDescText}</p>` : ''}
                    <div class="pub-card-tags">
                        <span class="pub-card-tag tag-type">${escapeHtml(typeTag)}</span>
                        ${otherTags.map(tag => `<span class="pub-card-tag">${escapeHtml(tag)}</span>`).join('')}
                    </div>
                </div>
            `;
        }
    });

    if (gridContainer) {
        if (totalMatches > 0) {
            gridContainer.innerHTML = html;
        } else {
            gridContainer.innerHTML = `
                <div style="grid-column: 1 / -1; padding: 4rem 1rem; text-align: center; color: rgba(255,255,255,0.4);">
                    <i class="fas fa-search-minus" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--accent); opacity: 0.6;"></i>
                    <p style="font-size: 1.1rem; margin: 0;">No results found matching your search.</p>
                    <p style="font-size: 0.9rem; color: rgba(255,255,255,0.35); margin-top: 0.25rem;">Try checking your spelling or searching for different keywords.</p>
                </div>
            `;
        }
    }

    if (countEl) {
        countEl.textContent = `Found ${totalMatches} matching entry${totalMatches === 1 ? '' : 'ies'}`;
    }
}

function getCategoryColor(index) {
    const colors = [
        "#9d4edd", // Books: Purple
        "#00b4d8", // Articles: Teal
        "#2ec4b6", // Chapters: Emerald Green
        "#ff9f1c", // Essays: Amber Orange
        "#ffd166", // Thesis: Gold Yellow
        "#ff5a5f", // Prof. Reports: Coral Red
        "#ff007f"  // Presentations: Pink
    ];
    return colors[index % colors.length];
}

function getTags(item) {
    const tags = [];
    
    // 1. Add Type as a tag
    if (item.Type && item.Type.trim()) {
        tags.push(item.Type.trim());
    }
    
    // 2. Extract Year
    const descText = item.Description || "";
    const titleText = item.Title || "";
    const combinedText = `${titleText} ${descText}`.toLowerCase();
    
    const yearMatch = combinedText.match(/\b(19\d{2}|20\d{2})\b/);
    if (yearMatch) {
        tags.push(yearMatch[0]);
    }
    
    // 3. Add thematic tags based on keywords
    if (combinedText.includes("lake") || combinedText.includes("water") || combinedText.includes("river") || combinedText.includes("drain") || combinedText.includes("wetland") || combinedText.includes("common")) {
        tags.push("Water Commons");
    }
    if (combinedText.includes("governance") || combinedText.includes("policy") || combinedText.includes("institution") || combinedText.includes("framework") || combinedText.includes("ostrom")) {
        tags.push("Governance");
    }
    if (combinedText.includes("urban") || combinedText.includes("city") || combinedText.includes("metropolitan") || combinedText.includes("planning") || combinedText.includes("space") || combinedText.includes("street")) {
        tags.push("Urban Design");
    }
    if (combinedText.includes("sustain") || combinedText.includes("resilien") || combinedText.includes("environment") || combinedText.includes("climate") || combinedText.includes("ecological")) {
        tags.push("Sustainability");
    }
    if (combinedText.includes("heritage") || combinedText.includes("culture") || combinedText.includes("traditional") || combinedText.includes("history")) {
        tags.push("Heritage");
    }
    if (combinedText.includes("gender") || combinedText.includes("women")) {
        tags.push("Gender");
    }
    
    // Return unique tags, max 4 tags
    return [...new Set(tags)].slice(0, 4);
}

function highlightText(text, keywords) {
    if (!text || !keywords || keywords.length === 0) return escapeHtml(text);
    
    let safeText = escapeHtml(text);
    let tempText = safeText;
    const sorted = [...keywords].sort((a, b) => b.length - a.length);
    
    sorted.forEach((kw, index) => {
        if (!kw) return;
        const escaped = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`(${escaped})`, 'gi');
        tempText = tempText.replace(regex, (match) => `\x00${index}\x01${match}\x02`);
    });
    
    tempText = tempText.replace(/\x00\d+\x01/g, '<span class="match-highlight">');
    tempText = tempText.replace(/\x02/g, '</span>');
    
    return tempText;
}

function escapeHtml(unsafe) {
    if (!unsafe) return "";
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

