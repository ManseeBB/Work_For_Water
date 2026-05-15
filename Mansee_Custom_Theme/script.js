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
                duration: 1.8,
                ease: "elastic.out(1, 0.6)", // The "Buoyancy" wobble
                overwrite: true
            }),
            onLeaveBack: () => gsap.set(".about-glass-panel", { y: 120, opacity: 0, overwrite: true })
        });

        // 2. Buoyancy Physics for the 9-Grid Portfolio Cards
        // Use batch to stagger them naturally as they enter the screen
        gsap.set(".bento-card", { y: 150, opacity: 0 }); // Initial submerged state

        ScrollTrigger.batch(".bento-card", {
            start: "top 90%",
            onEnter: batch => {
                batch.forEach(el => el.classList.remove('hover-ready'));
                gsap.to(batch, {
                    y: 0,
                    opacity: 1,
                    duration: 1.8,
                    stagger: 0.1,
                    ease: "elastic.out(1, 0.75)", // Slightly tighter wobble for cards
                    overwrite: true,
                    onComplete: () => {
                        gsap.set(batch, { clearProps: "transform,opacity" });
                        batch.forEach(el => el.classList.add('hover-ready'));
                    }
                });
            },
            // Reset them if you scroll back up
            onLeaveBack: batch => {
                batch.forEach(el => el.classList.remove('hover-ready'));
                gsap.set(batch, { y: 150, opacity: 0, overwrite: true });
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

    // GSAP ScrollTrigger - Removed as per user request
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
});
