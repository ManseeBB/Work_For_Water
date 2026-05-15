import os
import re
import glob

directories = [
    r"c:\Users\manas\Desktop\mansee-preview",
    r"c:\Users\manas\Desktop\mansee-preview\Mansee_Custom_Theme"
]

files = []
for directory in directories:
    files.extend(glob.glob(os.path.join(directory, "*.html")))
    files.extend(glob.glob(os.path.join(directory, "*.php")))

# The string to remove
php_string = r"<\?php\s+echo\s+get_template_directory_uri\(\);\s*\?>/"

for filepath in files:
    if os.path.basename(filepath) in ["source.html", "research_source.html", "Theme.zip"]:
        continue
    
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Remove the PHP injection from href and src attributes
    content = re.sub(f'href="{php_string}([^"]+)"', r'href="\1"', content)
    content = re.sub(f'src="{php_string}([^"]+)"', r'src="\1"', content)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
        
print("Reverted PHP links back to local static paths.")
