<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mansee Bal Bhargava | Urban Design & Architecture</title>
    <meta name="description" content="Portfolio of Mansee Bal Bhargava - Entrepreneur, Researcher, and Educator in Architecture and Urban Design.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Outfit:wght@300;500;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="style.css">
    <!-- GSAP & ScrollTrigger -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <!-- WebGL Ripples Dependencies -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.ripples/0.5.3/jquery.ripples.min.js"></script>
</head>
<body>
    <!-- WebGL Fluid Canvas -->
    <div id="webgl-water-bg" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -2; background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMDAwJyBoZWlnaHQ9JzEwMDAnPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0nZycgY3g9JzUwJScgY3k9JzUwJScgcj0nNTAlJz48c3RvcCBvZmZzZXQ9JzAlJyBzdG9wLWNvbG9yPScjMDYxZTM4Jy8+PHN0b3Agb2Zmc2V0PScxMDAlJyBzdG9wLWNvbG9yPScjMDEwYjE0Jy8+PC9yYWRpYWxHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9JzEwMDAnIGhlaWdodD0nMTAwMCcgZmlsbD0ndXJsKCNnKScvPjwvc3ZnPg=='); background-size: cover; background-position: center;"></div>
    <!-- Water Bubbles -->
    <div class="bubbles-container" id="bubblesContainer"></div>
    <nav class="navbar">
        <a href="index.php" class="logo" style="text-decoration: none; color: inherit;">MBB.</a>
        <div class="nav-links">
            <a href="#portfolio">Portfolio</a>
            <a href="contact.html">Contact</a>
        </div>
    </nav>

    <header class="hero" id="hero-section">
        <div class="hero-bg"></div>
        <div class="hero-content">
            <h1 class="reveal-text">
                <span class="tooltip-container" data-tooltip="Minded Reverence & Adoration">Mansee</span> 
                <span class="tooltip-container" data-tooltip="Strength & Determination">Bal</span> <br>
                <span class="tooltip-container tooltip-side gradient-text" data-tooltip="Vedic Rituals & Ayurved">Bhargava</span>
            </h1>
            <p class="mobile-name-meaning reveal-text delay-1">(Minded Reverence • Strength • Vedic Rituals)</p>
            <p class="subtitle reveal-text delay-1">Entrepreneur • Researcher • Educator</p>
            <div class="fields-pill reveal-text delay-2">
                <span>Architecture</span>
                <span class="dot"></span>
                <span>Urban Design</span>
                <span class="dot"></span>
                <span>Planning</span>
                <span class="dot"></span>
                <span>Management</span>
                <span class="dot"></span>
                <span>Governance</span>
            </div>

            <div class="social-links reveal-text delay-4">
                <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            </div>
        </div>
        <div class="scroll-indicator">
            <div class="mouse">
                <div class="wheel"></div>
            </div>
        </div>
    </header>


    <section id="portfolio" class="grid-section">
        <div class="section-header">
            <h2>Explore Dimensions</h2>
            <p>Discover the facets of my professional journey</p>
        </div>
        <div class="bento-grid">
            <!-- Practice -->
            <a href="practice.html" class="bento-card group">
                <div class="card-bg practice-bg"></div>
                <div class="card-content">
                    <i class="fa-solid fa-pen-nib"></i>
                    <h3>Practice</h3>
                    <p class="hover-text">Applied architectural and urban design in the real world.</p>
                </div>
            </a>
            <!-- Research -->
            <a href="research.html" class="bento-card group">
                <div class="card-bg research-bg"></div>
                <div class="card-content">
                    <i class="fa-solid fa-microscope"></i>
                    <h3>Research</h3>
                </div>
            </a>
            <!-- Teaching -->
            <a href="teaching.html" class="bento-card group">
                <div class="card-bg teaching-bg"></div>
                <div class="card-content">
                    <i class="fa-solid fa-chalkboard-user"></i>
                    <h3>Teaching</h3>
                </div>
            </a>
            <!-- Purpose -->
            <a href="purpose.html" class="bento-card group">
                <div class="card-bg purpose-bg"></div>
                <div class="card-content">
                    <i class="fa-solid fa-bullseye"></i>
                    <h3>Purpose</h3>
                    <p class="hover-text">The core mission driving my endeavors.</p>
                </div>
            </a>
            <!-- Response -->
            <a href="response.html" class="bento-card group">
                <div class="card-bg response-bg"></div>
                <div class="card-content">
                    <i class="fa-solid fa-reply-all"></i>
                    <h3>Response</h3>
                </div>
            </a>
            <!-- Talks -->
            <a href="talks.html" class="bento-card group">
                <div class="card-bg talks-bg"></div>
                <div class="card-content">
                    <i class="fa-solid fa-microphone"></i>
                    <h3>Talks</h3>
                </div>
            </a>
            <!-- People -->
            <a href="people.html" class="bento-card group">
                <div class="card-bg people-bg"></div>
                <div class="card-content">
                    <i class="fa-solid fa-users"></i>
                    <h3>People</h3>
                </div>
            </a>
            <!-- Resume -->
            <a href="resume.html" class="bento-card group">
                <div class="card-bg resume-bg"></div>
                <div class="card-content">
                    <i class="fa-regular fa-file-lines"></i>
                    <h3>Resume</h3>
                </div>
            </a>
            <!-- Travel -->
            <a href="travel.html" class="bento-card group">
                <div class="card-bg travel-bg"></div>
                <div class="card-content">
                    <i class="fa-solid fa-earth-americas"></i>
                    <h3>Travel</h3>
                    <p class="hover-text">Global perspectives shaping urban understanding.</p>
                </div>
            </a>
        </div>
    </section>

    <!-- The About Section -->
    <section id="about" class="about-section">
        <div class="about-container">
            <div class="about-glass-panel">
                <div class="quote-icon"><i class="fas fa-quote-left"></i></div>
                <div class="section-header">
                    <h2>Learn more about me</h2>
                    <div class="header-line"></div>
                </div>
                <p class="about-bio">
                    A trans-disciplinary learner with 25 years of experience in the built environment, dedicated to ecological restoration and mitigating water distress. I view the built environment as a complex socio-ecological system, championing <strong>gender-sensitive governance</strong> to empower civil society.
                </p>
                <p class="about-bio highlight-bio">
                    Driven by humanity and biodiversity, my philosophy is simple: <strong>we must slow down to heal the planet</strong>. At heart, an inquisitive child for whom the value of freedom is immeasurable.
                </p>
            </div>
        </div>
    </section>

    <footer>
        <div class="footer-content">
            <h2 class="footer-logo">MBB.</h2>
            <div class="footer-nav">
                <a href="index.php">Home</a>
                <a href="purpose.html">Passion</a>
                <a href="response.html">Reaction</a>
                <a href="contact.html">Contact</a>
            </div>
            <p>&copy; 2026 Mansee Bal Bhargava. All Rights Reserved.</p>
        </div>
    </footer>
    <script src="script.js"></script>
</body>
</html>
