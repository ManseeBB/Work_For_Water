import os

pages = [
    {"id": "practice", "title": "Practice", "img": "Assests/1st.jpg", "desc": "Applied architectural and urban design in the real world."},
    {"id": "research", "title": "Research", "img": "Assests/2nd.jpg", "desc": "Exploring the depths of urban design and architecture."},
    {"id": "teaching", "title": "Teaching", "img": "Assests/3rd.jpg", "desc": "Educating the next generation of architects and planners."},
    {"id": "purpose", "title": "Purpose", "img": "Assests/4th.jpg", "desc": "The core mission driving my endeavors."},
    {"id": "response", "title": "Response", "img": "Assests/5th.jpg", "desc": "Reactions and impacts in the architectural space."},
    {"id": "talks", "title": "Talks", "img": "Assests/6th.jpg", "desc": "Speaking engagements and public discourses."},
    {"id": "people", "title": "People", "img": "Assests/7th.jpg", "desc": "Collaborations and community building."},
    {"id": "resume", "title": "Resume", "img": "Assests/8th.jpg", "desc": "Professional journey and qualifications."},
    {"id": "travel", "title": "Travel", "img": "Assests/9th.jpg", "desc": "Global perspectives shaping urban understanding."},
    {"id": "contact", "title": "Contact", "img": "Assests/8th.jpg", "desc": "Get in touch for collaborations and inquiries."}
]

template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | Mansee Bal Bhargava</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Outfit:wght@300;500;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav class="navbar">
        <a href="index.html" class="logo" style="text-decoration: none; color: inherit;">MBB.</a>
        <div class="nav-links">
            <a href="index.html#portfolio">Portfolio</a>
            <a href="contact.html">Contact</a>
        </div>
    </nav>

    <header class="inner-hero" style="background-image: linear-gradient(to bottom, rgba(3,7,18,0.7), rgba(3,7,18,1)), url('{img}');">
        <div class="hero-content">
            <h1 class="reveal-text">{title}</h1>
            <p class="subtitle reveal-text delay-1">{desc}</p>
        </div>
    </header>

    <section class="page-content">
        <div class="content-wrapper">
            <h2>About {title}</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
    </section>

    <footer>
        <div class="footer-content">
            <h2 class="footer-logo">MBB.</h2>
            <div class="footer-nav">
                <a href="index.html">Home</a>
                <a href="purpose.html">Passion</a>
                <a href="response.html">Reaction</a>
                <a href="contact.html">Contact</a>
            </div>
            <p>&copy; 2026 Mansee Bal Bhargava. All Rights Reserved.</p>
        </div>
    </footer>
    <script src="script.js"></script>
</body>
</html>"""

for page in pages:
    filename = f"{page['id']}.html"
    content = template.format(**page)
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

print("Pages created successfully.")
