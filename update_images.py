import os
import re
import glob

theme_dir = r"c:\Users\manas\Desktop\mansee-preview\Mansee_Custom_Theme"
files = glob.glob(os.path.join(theme_dir, "*.html")) + glob.glob(os.path.join(theme_dir, "*.php"))

def repl_href(match):
    val = match.group(1)
    if "<?php" in val or val.startswith("http") or val.startswith("/") or val.startswith("#") or val.startswith("data:"):
        return match.group(0) # unchanged
    return f'href="<?php echo get_template_directory_uri(); ?>/{val}"'

def repl_src(match):
    val = match.group(1)
    if "<?php" in val or val.startswith("http") or val.startswith("/") or val.startswith("#") or val.startswith("data:"):
        return match.group(0) # unchanged
    return f'src="<?php echo get_template_directory_uri(); ?>/{val}"'

for filepath in files:
    if os.path.basename(filepath) in ["source.html", "research_source.html", "Theme.zip"]:
        continue
    
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace href="relative" for images
    content = re.sub(r'href="([^"]+\.(?:jpg|jpeg|png|svg|webp|gif))"', repl_href, content)
    # Replace src="relative" for images
    content = re.sub(r'src="([^"]+\.(?:jpg|jpeg|png|svg|webp|gif))"', repl_src, content)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Updated image links.")
