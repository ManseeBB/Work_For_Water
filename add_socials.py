import os
import glob

socials_html = """
    <!-- Floating Socials -->
    <div class="floating-socials">
        <a href="https://www.instagram.com/manseebal/" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram"></i></a>
        <a href="https://twitter.com/manseebal" aria-label="Twitter / X" target="_blank" rel="noopener noreferrer"><i class="fab fa-twitter"></i></a>
        <a href="https://www.linkedin.com/in/mansee-bal-bhargava-6583a915/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><i class="fab fa-linkedin-in"></i></a>
        <a href="https://www.facebook.com/bal.mansee/" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><i class="fab fa-facebook-f"></i></a>
        <a href="https://tinyurl.com/4s7st69h" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><i class="fab fa-youtube"></i></a>
    </div>
"""

for filepath in glob.glob("*.html"):
    if filepath == "index.html":
        continue
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "floating-socials" not in content:
        # Insert before <nav class="navbar">
        content = content.replace('<nav class="navbar">', socials_html + '    <nav class="navbar">')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")
