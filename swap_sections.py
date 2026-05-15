import os

files_to_update = [
    r"c:\Users\manas\Desktop\mansee-preview\index.html",
    r"c:\Users\manas\Desktop\mansee-preview\Mansee_Custom_Theme\index.php"
]

for filepath in files_to_update:
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    about_start = -1
    about_end = -1
    portfolio_start = -1
    portfolio_end = -1
    
    for i, line in enumerate(lines):
        if '<!-- The About Section -->' in line:
            about_start = i
        elif '<section id="about"' in line and about_start == -1:
            about_start = i
            
        if '</section>' in line and about_start != -1 and about_end == -1:
            about_end = i
            
        if '<section id="portfolio"' in line:
            portfolio_start = i
            
        if '</section>' in line and portfolio_start != -1 and portfolio_end == -1:
            portfolio_end = i
            
    if about_start != -1 and about_end != -1 and portfolio_start != -1 and portfolio_end != -1:
        # Check if portfolio comes after about
        if about_start < portfolio_start:
            # Swap them
            about_block = lines[about_start:about_end+1]
            # include the blank line before portfolio if it exists
            portfolio_block_start = portfolio_start
            if lines[portfolio_start-1].strip() == '':
                portfolio_block_start -= 1
            portfolio_block = lines[portfolio_block_start:portfolio_end+1]
            
            # Reconstruct
            new_lines = lines[:about_start] + portfolio_block + ["\n"] + about_block + lines[portfolio_end+1:]
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.writelines(new_lines)
            print(f"Swapped sections in {filepath}")
        else:
            print(f"Sections already swapped in {filepath}")

# Now fix the script.js
js_files = [
    r"c:\Users\manas\Desktop\mansee-preview\script.js",
    r"c:\Users\manas\Desktop\mansee-preview\Mansee_Custom_Theme\script.js"
]

for js_path in js_files:
    if not os.path.exists(js_path):
        continue
        
    with open(js_path, 'r', encoding='utf-8') as f:
        js_content = f.read()
        
    if "if (document.hidden) return;" not in js_content:
        js_content = js_content.replace(
            "setInterval(function() {\n                var $el",
            "setInterval(function() {\n                if (document.hidden) return; // Prevent ripples accumulating\n                var $el"
        )
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(js_content)
        print(f"Fixed JS in {js_path}")
    else:
        print(f"JS already fixed in {js_path}")
