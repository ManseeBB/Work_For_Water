document.addEventListener("DOMContentLoaded", () => {
    
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
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#portfolio') {
                gsap.killTweensOf(".bento-card");
                gsap.set(".bento-card", { y: 0, opacity: 1, clearProps: "transform,opacity" });
                document.querySelectorAll(".bento-card").forEach(el => el.classList.add('hover-ready'));
            } else if (targetId === '#about') {
                gsap.killTweensOf(".about-glass-panel");
                gsap.set(".about-glass-panel", { y: 0, opacity: 1 });
            }
        });
    });
});
