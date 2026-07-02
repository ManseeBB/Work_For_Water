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

// ==========================================================================
// SECURE VIEWER IMPLEMENTATION (NO DOWNLOAD / ONLY VIEW MODE)
// ==========================================================================

let pdfjsLibLoaded = false;
let currentPdfDoc = null;
let currentPdfPage = 1;
let currentPdfScale = 1.25;
let pdfRenderingInProgress = false;
let currentMediaIsPdf = false;
let currentImageUrl = '';
let currentImageScale = 1.0;

// Dynamic loader for PDF.js library from cdnjs
function loadPdfJsLib(callback) {
    if (pdfjsLibLoaded || typeof pdfjsLib !== 'undefined') {
        if (callback) callback();
        return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js';
    script.onload = () => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        pdfjsLibLoaded = true;
        if (callback) callback();
    };
    script.onerror = () => {
        console.error("Failed to load PDF.js library.");
        alert("Failed to load document viewer components.");
    };
    document.head.appendChild(script);
}

// Inject secure viewer markup into document body
function injectSecureViewerModal() {
    if (document.getElementById('secure-viewer-modal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'secure-viewer-modal';
    modal.className = 'secure-viewer-modal no-select';
    modal.innerHTML = `
        <div id="secure-viewer-cors-notice" class="cors-fallback-notice" style="display: none;">
            <i class="fas fa-exclamation-triangle"></i>
            <span>Notice: Cross-origin security policies (CORS) restricted direct reading. Loading in secure sandbox view mode.</span>
        </div>
        <div class="secure-viewer-header">
            <div class="secure-viewer-title" id="secure-viewer-title-el">
                <i class="fas fa-shield-alt"></i> Protected Viewer
            </div>
            <div class="secure-viewer-controls">
                <button class="viewer-control-btn" id="secure-viewer-prev" disabled title="Previous Page">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <span class="viewer-page-indicator" id="secure-viewer-page-num" style="display: none;">Page 1 / 1</span>
                <button class="viewer-control-btn" id="secure-viewer-next" disabled title="Next Page">
                    <i class="fas fa-chevron-right"></i>
                </button>
                <button class="viewer-control-btn" id="secure-viewer-zoom-out" title="Zoom Out">
                    <i class="fas fa-search-minus"></i>
                </button>
                <button class="viewer-control-btn" id="secure-viewer-zoom-in" title="Zoom In">
                    <i class="fas fa-search-plus"></i>
                </button>
                <button class="viewer-control-btn viewer-close-btn" id="secure-viewer-close" title="Close Viewer">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="secure-viewer-body" id="secure-viewer-body-el">
            <div class="secure-viewer-loader" id="secure-viewer-loader-el" style="display: none;">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Loading securely...</span>
            </div>
            <div class="secure-media-wrapper" id="secure-viewer-content-wrapper">
                <div class="secure-click-shield"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Bind control buttons
    document.getElementById('secure-viewer-close').onclick = closeSecureViewer;
    document.getElementById('secure-viewer-zoom-in').onclick = secureViewerZoomIn;
    document.getElementById('secure-viewer-zoom-out').onclick = secureViewerZoomOut;
    
    document.getElementById('secure-viewer-prev').onclick = () => {
        if (currentPdfPage > 1) {
            currentPdfPage--;
            renderPdfPage(currentPdfPage);
        }
    };
    document.getElementById('secure-viewer-next').onclick = () => {
        if (currentPdfDoc && currentPdfPage < currentPdfDoc.numPages) {
            currentPdfPage++;
            renderPdfPage(currentPdfPage);
        }
    };

    // Prevent dragging / selection / contextmenu inside modal
    modal.addEventListener('selectstart', e => e.preventDefault());
    modal.addEventListener('dragstart', e => e.preventDefault());
    modal.addEventListener('contextmenu', e => e.preventDefault());
}

// Render a single PDF page onto canvas
function renderPdfPage(pageNum) {
    if (!currentPdfDoc || pdfRenderingInProgress) return;
    pdfRenderingInProgress = true;
    
    const container = document.getElementById('secure-viewer-content-wrapper');
    const loader = document.getElementById('secure-viewer-loader-el');
    loader.style.display = 'flex';
    
    currentPdfDoc.getPage(pageNum).then(page => {
        let canvas = document.getElementById('secure-pdf-canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'secure-pdf-canvas';
            canvas.className = 'secure-viewer-canvas no-select no-drag';
            // Insert canvas before shielding overlay
            container.insertBefore(canvas, container.querySelector('.secure-click-shield'));
        }
        
        const viewport = page.getViewport({ scale: currentPdfScale });
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        
        page.render(renderContext).promise.then(() => {
            pdfRenderingInProgress = false;
            loader.style.display = 'none';
            
            // Sync navigation controls
            document.getElementById('secure-viewer-page-num').textContent = `Page ${pageNum} / ${currentPdfDoc.numPages}`;
            document.getElementById('secure-viewer-prev').disabled = (pageNum <= 1);
            document.getElementById('secure-viewer-next').disabled = (pageNum >= currentPdfDoc.numPages);
        });
    }).catch(err => {
        console.error("Error rendering page:", err);
        pdfRenderingInProgress = false;
        loader.style.display = 'none';
    });
}

// Open secure viewer with resource
function openSecureViewer(url, isPdf) {
    injectSecureViewerModal();
    
    const modal = document.getElementById('secure-viewer-modal');
    const container = document.getElementById('secure-viewer-content-wrapper');
    const loader = document.getElementById('secure-viewer-loader-el');
    const titleEl = document.getElementById('secure-viewer-title-el');
    const pageNumIndicator = document.getElementById('secure-viewer-page-num');
    const corsNotice = document.getElementById('secure-viewer-cors-notice');
    
    // Show modal
    modal.style.display = 'flex';
    requestAnimationFrame(() => modal.classList.add('active'));
    document.body.style.overflow = 'hidden'; // Lock main scroll
    
    // Clear previous dynamic viewer elements (like canvas, img, or iframe)
    const oldCanvas = document.getElementById('secure-pdf-canvas');
    if (oldCanvas) oldCanvas.remove();
    const oldImg = document.getElementById('secure-img');
    if (oldImg) oldImg.remove();
    const oldIframe = document.getElementById('secure-iframe');
    if (oldIframe) oldIframe.remove();
    
    loader.style.display = 'flex';
    corsNotice.style.display = 'none';
    
    currentMediaIsPdf = isPdf;
    
    // Extract file name for title
    const filename = url.split('/').pop().split('?')[0];
    titleEl.innerHTML = `<i class="fas ${isPdf ? 'fa-file-pdf' : 'fa-file-image'}"></i> ${decodeURIComponent(filename)}`;

    if (isPdf) {
        pageNumIndicator.style.display = 'inline-block';
        document.getElementById('secure-viewer-prev').style.display = 'inline-block';
        document.getElementById('secure-viewer-next').style.display = 'inline-block';
        
        currentPdfScale = 1.25;
        currentPdfPage = 1;
        
        // CORS and Fetch checking
        const isRelative = !url.startsWith('http://') && !url.startsWith('https://');
        const isSameOrigin = url.startsWith(window.location.origin);
        
        if (isRelative || isSameOrigin) {
            // Safe to fetch locally
            loadPdfJsLib(() => {
                pdfjsLib.getDocument(url).promise.then(pdf => {
                    currentPdfDoc = pdf;
                    renderPdfPage(1);
                }).catch(err => {
                    console.error("PDF.js loading failed on local file:", err);
                    loadIframeFallback(url);
                });
            });
        } else {
            // External file: Check CORS availability
            fetch(url, { method: 'HEAD', mode: 'cors' })
                .then(res => {
                    // CORS pre-flight passed or domain supports access
                    loadPdfJsLib(() => {
                        pdfjsLib.getDocument(url).promise.then(pdf => {
                            currentPdfDoc = pdf;
                            renderPdfPage(1);
                        }).catch(err => {
                            console.error("PDF.js external loading failed:", err);
                            loadIframeFallback(url);
                        });
                    });
                })
                .catch(err => {
                    // CORS check failed
                    console.warn("CORS restriction detected. Switching to sandboxed iframe view.");
                    loadIframeFallback(url);
                });
        }
    } else {
        // Image rendering
        pageNumIndicator.style.display = 'none';
        document.getElementById('secure-viewer-prev').style.display = 'none';
        document.getElementById('secure-viewer-next').style.display = 'none';
        currentImageScale = 1.0;
        currentImageUrl = url;
        
        const img = document.createElement('img');
        img.id = 'secure-img';
        img.className = 'secure-viewer-img no-select no-drag';
        img.src = url;
        img.onload = () => {
            loader.style.display = 'none';
        };
        img.onerror = () => {
            loader.style.display = 'none';
            alert("Error loading image.");
        };
        // Insert image before overlay shield
        container.insertBefore(img, container.querySelector('.secure-click-shield'));
    }
}

// Load sandboxed iframe for CORS restricted PDFs
function loadIframeFallback(url) {
    const container = document.getElementById('secure-viewer-content-wrapper');
    const loader = document.getElementById('secure-viewer-loader-el');
    const corsNotice = document.getElementById('secure-viewer-cors-notice');
    
    // Hide native PDF paging controls
    document.getElementById('secure-viewer-page-num').style.display = 'none';
    document.getElementById('secure-viewer-prev').style.display = 'none';
    document.getElementById('secure-viewer-next').style.display = 'none';
    
    corsNotice.style.display = 'flex';
    
    // Resolve absolute URL for Google Docs Viewer
    let absoluteUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        absoluteUrl = new URL(url, window.location.href).href;
    }
    
    const iframe = document.createElement('iframe');
    iframe.id = 'secure-iframe';
    iframe.className = 'secure-viewer-iframe';
    iframe.sandbox = 'allow-scripts allow-same-origin';
    iframe.src = `https://docs.google.com/gview?url=${encodeURIComponent(absoluteUrl)}&embedded=true`;
    
    iframe.onload = () => {
        loader.style.display = 'none';
    };
    
    container.insertBefore(iframe, container.querySelector('.secure-click-shield'));
}

// Close secure viewer modal
function closeSecureViewer() {
    const modal = document.getElementById('secure-viewer-modal');
    if (!modal) return;
    
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
        
        // Remove dynamic nodes
        const oldCanvas = document.getElementById('secure-pdf-canvas');
        if (oldCanvas) oldCanvas.remove();
        const oldImg = document.getElementById('secure-img');
        if (oldImg) oldImg.remove();
        const oldIframe = document.getElementById('secure-iframe');
        if (oldIframe) oldIframe.remove();
        
        currentPdfDoc = null;
        pdfRenderingInProgress = false;
    }, 300);
    
    document.body.style.overflow = ''; // Restore main scroll
}

// Zoom In logic
function secureViewerZoomIn() {
    if (currentMediaIsPdf) {
        if (currentPdfScale < 3.0) {
            currentPdfScale += 0.25;
            renderPdfPage(currentPdfPage);
        }
    } else {
        const img = document.getElementById('secure-img');
        if (img && currentImageScale < 3.0) {
            currentImageScale += 0.25;
            img.style.transform = `scale(${currentImageScale})`;
            img.style.transition = 'transform 0.2s ease';
        }
    }
}

// Zoom Out logic
function secureViewerZoomOut() {
    if (currentMediaIsPdf) {
        if (currentPdfScale > 0.5) {
            currentPdfScale -= 0.25;
            renderPdfPage(currentPdfPage);
        }
    } else {
        const img = document.getElementById('secure-img');
        if (img && currentImageScale > 0.5) {
            currentImageScale -= 0.25;
            img.style.transform = `scale(${currentImageScale})`;
            img.style.transition = 'transform 0.2s ease';
        }
    }
}

// Global click event interceptor
function initSecureViewer() {
    injectSecureViewerModal();
    
    document.body.addEventListener('click', e => {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        
        // Check if the link contains .pdf or points to an image
        const isPdf = href.toLowerCase().endsWith('.pdf') || href.toLowerCase().includes('.pdf?');
        const isImg = /\.(jpg|jpeg|png|gif|webp|bmp)(\?|$)/i.test(href.toLowerCase());
        
        // Avoid intercepting logo links, main page redirects, or external non-file websites
        if (!isPdf && !isImg) return;
        
        // Block default downloads or opening in standard tabs
        e.preventDefault();
        e.stopPropagation();
        
        openSecureViewer(href, isPdf);
    }, true); // Use capture phase
    
    // Prevent print screen key notifications or warning block if possible
    window.addEventListener('keyup', e => {
        if (e.key === 'PrintScreen') {
            navigator.clipboard.writeText(''); // Blank the clipboard to protect screenshots
            alert("Screenshots are disabled on this viewer to protect material.");
        }
    });

    // Secure contextual lightbox elements already on the page
    const secureElements = [
        document.getElementById('lightbox-modal'),
        document.getElementById('premium-lightbox')
    ];
    
    secureElements.forEach(el => {
        if (el) {
            el.classList.add('no-select');
            el.addEventListener('contextmenu', e => e.preventDefault());
            el.addEventListener('dragstart', e => e.preventDefault());
            el.addEventListener('selectstart', e => e.preventDefault());
            
            // Find images inside elements and secure them
            el.querySelectorAll('img').forEach(img => {
                img.classList.add('no-drag', 'no-select');
                img.addEventListener('contextmenu', e => e.preventDefault());
                img.addEventListener('dragstart', e => e.preventDefault());
            });
        }
    });
}

// Initialize secure viewer on load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSecureViewer);
} else {
    initSecureViewer();
}

// Global protection events (Ctrl+S, Ctrl+P, Ctrl+C inside viewer)
document.addEventListener('keydown', e => {
    const viewerActive = document.getElementById('secure-viewer-modal')?.classList.contains('active') ||
                         document.getElementById('lightbox-modal')?.classList.contains('active') ||
                         document.getElementById('premium-lightbox')?.classList.contains('active');
    
    const isSave = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's';
    const isPrint = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p';
    const isCopy = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c';
    const isViewSource = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u';
    const isInspect = e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'i');
    
    // Block printing globally across the site
    if (isPrint) {
        e.preventDefault();
        e.stopPropagation();
        alert("Printing is disabled on this site to protect intellectual properties.");
        return false;
    }
    
    // Block save, copy, view-source, inspect strictly inside viewer modal
    if (viewerActive) {
        if (isSave || isCopy || isViewSource || isInspect) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    }
});

