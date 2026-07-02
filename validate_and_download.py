import urllib.request
import csv
import io
import os
import sys
import shutil
import re

CONFIGS = [
    {
        "name": "projects_database",
        "url": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTz8DEv50SYuwwCTd_vxL7NzsWt0Ir_4y1QWS7qSevFm2N7iiUb5k0pICmCvhvCpS3Jgk8Fc59ovWfz/pub?output=csv",
        "dest": "data/projects_database.csv",
        "required_headers": ["Category", "Title", "Description", "ImageName", "Link"],
        "validators": {
            "Category": lambda val: val.strip() in ["Institutional", "Heritage", "Residential", "Environmental", "Urban"],
            "Title": lambda val: len(val.strip()) > 0
        },
        "image_column": "ImageName",
        "image_dest_dir": "Assests"
    },
    {
        "name": "people",
        "url": "https://docs.google.com/spreadsheets/d/e/2PACX-1vTYkcq2-Y9OhZsOz8u8VWe0pcjyqQkdl-97ABd1Ddt2rTNX_waZK11S2gh4twljl4YzOOQF1k7nvVfj/pub?output=csv",
        "dest": "data/people.csv",
        "required_headers": ["name", "details", "link", "tags", "isHub"],
        "validators": {
            "name": lambda val: len(val.strip()) > 0,
            "isHub": lambda val: val.strip().lower() in ["", "true", "false"]
        }
    },
    {
        "name": "teaching_slideshow",
        "url": "https://docs.google.com/spreadsheets/d/e/2PACX-1vRSppB_DmolzMha_PoBvwvSGkmZLoNBksyGVO63Xjch7n-m__ywR7MNR5P8ZJwrbanYy0KW2fV_afar/pub?gid=1903645478&single=true&output=csv",
        "dest": "data/teaching_slideshow.csv",
        "required_headers": ["Category_Color", "Icon", "Title", "Description", "Link", "Image_Name"],
        "validators": {
            "Title": lambda val: len(val.strip()) > 0
        },
        "image_column": "Image_Name",
        "image_dest_dir": "teaching"
    },
    {
        "name": "teaching_credentials",
        "url": "https://docs.google.com/spreadsheets/d/e/2PACX-1vT5Lxb9oeEHUnQ0wrUcUDlfWR3izrn_zr3La_vRBegvgLOuIMEWeNn6MB7pZhWCROHudg_g5eaKjJJW/pub?gid=566631475&single=true&output=csv",
        "dest": "data/teaching_credentials.csv",
        "required_headers": ["Category", "Content", "Link"],
        "validators": {
            "Category": lambda val: len(val.strip()) > 0,
            "Content": lambda val: len(val.strip()) > 0
        }
    },
    {
        "name": "travel_database",
        "url": "https://docs.google.com/spreadsheets/d/e/2PACX-1vRe_Apew1QOi1mLUa91ZO8G0NpKX7S2c1puCQRI4IXe4Qdp01tGzM82e0DKTbDneNQpJydAwmZzGJuJ/pub?gid=0&single=true&output=csv",
        "dest": "data/travel_database.csv",
        "required_headers": ["Type", "City", "Country", "Year", "Institution", "Title", "Description", "Link", "Latitude", "Longitude"],
        "validators": {
            "City": lambda val: len(val.strip()) > 0,
            "Country": lambda val: len(val.strip()) > 0,
            "Latitude": lambda val: float(val.strip()) is not None,
            "Longitude": lambda val: float(val.strip()) is not None
        }
    },
    {
        "name": "research",
        "url": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQysLY9yKZ4NEaFbuDBDosAPlth1YzoKEH1Wj7O-VGLarH5_QRz93Onu7QH88vUnLJow8DX0eOVuj7T/pub?output=csv",
        "dest": "data/research.csv",
        "required_headers": ["Category", "Title", "Description", "Type", "Link"],
        "validators": {
            "Category": lambda val: val.strip() in [
                "Books", "Articles", "Book Chapters", "Published Essays and Reports", 
                "Thesis", "Professional Reports (Team Member)", 
                "Papers, Presentations & Participations in Conferences, Seminars, Workshops, Symposia"
            ],
            "Title": lambda val: len(val.strip()) > 0
        }
    },
    {
        "name": "flyers_database",
        "url": "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmBa0BcQPRRis1cGpm8de0H7kFv_IxGO_o6OksYQabmRhpfyEKiBsq9wusmtUq_WGgxG2NWIoWtAyA/pub?gid=197107346&single=true&output=csv",
        "dest": "data/flyers_database.csv",
        "required_headers": ["Title", "Date/Year", "Drive_Link", "Original_File_Name"],
        "validators": {
            "Title": lambda val: len(val.strip()) > 0,
            "Drive_Link": lambda val: len(val.strip()) > 0 and val.strip().startswith("http")
        },
        "image_column": "Drive_Link",
        "image_dest_dir": "Assests/Talks"
    }
]

def download_url(url):
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
    )
    with urllib.request.urlopen(req) as response:
        return response.read(), response.info().get_content_type()

def extract_drive_id(url):
    match = re.search(r'/d/([a-zA-Z0-9_-]+)', url)
    if match:
        return match.group(1)
    match = re.search(r'[?&]id=([a-zA-Z0-9_-]+)', url)
    if match:
        return match.group(1)
    return None

def optimize_image(filepath):
    try:
        from PIL import Image
        img = Image.open(filepath)
        if img.mode in ('RGBA', 'LA') and filepath.endswith(('.jpg', '.jpeg')):
            background = Image.new('RGB', img.size, (255, 255, 255))
            background.paste(img, mask=img.split()[3])
            img = background
            
        ext = os.path.splitext(filepath)[1].lower()
        if ext in ('.jpg', '.jpeg'):
            img.save(filepath, 'JPEG', quality=82, optimize=True)
            print(f"    Pillow optimized image size: {os.path.getsize(filepath)} bytes")
        elif ext == '.png':
            img.save(filepath, 'PNG', optimize=True)
            print(f"    Pillow optimized image size: {os.path.getsize(filepath)} bytes")
    except ImportError:
        pass
    except Exception as e:
        print(f"    Warning: Failed to optimize image {filepath}: {e}")

def html_escape(text):
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;").replace("'", "&#x27;")

def send_error_email(errors):
    api_key = os.environ.get("RESEND_API_KEY")
    if not api_key:
        print("Warning: RESEND_API_KEY not found in environment. Cannot send error email.")
        return
        
    to_email = "manas.p@ahduni.edu.in"
    from_email = os.environ.get("RESEND_FROM_EMAIL", "onboarding@resend.dev")
    subject = "ALERT: Portfolio Website Deployment Failed (Validation Error)"
    
    errors_html = "".join([f"<li style='margin-bottom: 8px; color: #b91c1c;'>{html_escape(err)}</li>" for err in errors])
    
    html_content = f"""
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="background-color: #ef4444; padding: 20px; text-align: center; color: white;">
            <h2 style="margin: 0; font-size: 22px;">Portfolio Deployment Failed</h2>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
            <p style="font-size: 16px; margin-top: 0;">Hello Manas,</p>
            <p>Your portfolio website deployment was <strong>aborted</strong> because one or more Google Sheets failed validation checks. The live site has <strong>NOT</strong> been updated and continues serving the last valid version.</p>
            <div style="background-color: #fef2f2; border: 1px solid #fca5a5; padding: 16px; border-radius: 6px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #991b1b; font-size: 16px;">Validation Error Log:</h3>
                <ul style="padding-left: 20px; margin-bottom: 0;">
                    {errors_html}
                </ul>
            </div>
            <p>Please fix these errors in your Google Sheets and click <strong>Publish Changes</strong> again to redeploy.</p>
            <hr style="border: 0; border-top: 1px solid #e4e4e7; margin: 24px 0;" />
            <p style="font-size: 12px; color: #71717a; text-align: center; margin-bottom: 0;">
                Automated notification from Portfolio Build Pipeline.
            </p>
        </div>
    </div>
    """
    
    import json
    payload = {
        "from": from_email,
        "to": to_email,
        "subject": subject,
        "html": html_content
    }
    
    try:
        req = urllib.request.Request(
            "https://api.resend.com/emails",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            method="POST"
        )
        with urllib.request.urlopen(req) as res:
            res.read()
            print(f"Error notification email successfully sent to {to_email}.")
    except Exception as ex:
        print(f"Failed to send error email via Resend API: {ex}")

def filter_empty_rows_from_csv(csv_text):
    import csv
    import io
    
    f = io.StringIO(csv_text.strip())
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    
    rows = list(reader)
    non_empty_rows = []
    
    for row in rows:
        is_empty = all(val is None or str(val).strip() == "" for val in row.values())
        if not is_empty:
            non_empty_rows.append(row)
            
    out = io.StringIO()
    writer = csv.DictWriter(out, fieldnames=fieldnames, lineterminator='\n')
    writer.writeheader()
    writer.writerows(non_empty_rows)
    return out.getvalue()

def validate_csv(csv_text, name, required_headers, validators, errors_list):
    f = io.StringIO(csv_text.strip())
    reader = csv.DictReader(f)
    
    passed = True
    if not reader.fieldnames:
        msg = "CSV is empty or has no headers."
        print(f"Error validating {name}: {msg}")
        errors_list.append(f"{name}: {msg}")
        return False
        
    fieldnames = [h.strip() for h in reader.fieldnames if h]
    for req_header in required_headers:
        if req_header not in fieldnames:
            msg = f"Missing required column '{req_header}'. Found columns: {fieldnames}"
            print(f"Error validating {name}: {msg}")
            errors_list.append(f"{name}: {msg}")
            passed = False
            
    if not passed:
        return False
            
    row_num = 1
    for row in reader:
        row_num += 1
        # Skip completely empty rows
        if all(val is None or str(val).strip() == "" for val in row.values()):
            continue
        for col, val in row.items():
            if col is None:
                continue
            col_stripped = col.strip()
            if col_stripped in validators:
                try:
                    is_valid = validators[col_stripped](val)
                    if not is_valid:
                        msg = f"Row {row_num}: Column '{col_stripped}' has invalid value: '{val}'"
                        print(f"Error validating {name}: {msg}")
                        errors_list.append(f"{name}: {msg}")
                        passed = False
                except Exception as e:
                    msg = f"Row {row_num}: Column '{col_stripped}' failed validation check. Value: '{val}'. Exception: {e}"
                    print(f"Error validating {name}: {msg}")
                    errors_list.append(f"{name}: {msg}")
                    passed = False
    return passed

def process_images_in_csv(csv_text, image_column, image_dest_dir, name, errors_list):
    f = io.StringIO(csv_text.strip())
    reader = csv.DictReader(f)
    fieldnames = reader.fieldnames
    
    rows = list(reader)
    os.makedirs(image_dest_dir, exist_ok=True)
    
    updated_rows = []
    for idx, row in enumerate(rows):
        row_num = idx + 2
        val = row.get(image_column, "").strip()
        
        # Check if it is a Google Drive URL
        if val.startswith("http") and ("drive.google.com" in val or "docs.google.com" in val):
            file_id = extract_drive_id(val)
            if not file_id:
                msg = f"Row {row_num}: ImageName column has invalid Google Drive URL format: '{val}'"
                print(f"Error in {name}: {msg}")
                errors_list.append(f"{name}: {msg}")
                return None
                
            print(f"  Row {row_num}: Found Google Drive image link. Downloading file ID: {file_id}")
            download_url_str = f"https://drive.google.com/uc?export=download&id={file_id}"
            
            try:
                img_data, content_type = download_url(download_url_str)
                # Map content type to file extension
                ext = ".jpg"
                if "png" in content_type:
                    ext = ".png"
                elif "gif" in content_type:
                    ext = ".gif"
                elif "webp" in content_type:
                    ext = ".webp"
                
                filename = f"gdrive_img_{file_id}{ext}"
                filepath = os.path.join(image_dest_dir, filename)
                
                # Save file
                with open(filepath, "wb") as f_img:
                    f_img.write(img_data)
                print(f"    Saved to {filepath} ({len(img_data)} bytes)")
                
                # Optimize image if Pillow is available
                optimize_image(filepath)
                
                # Rewrite the column value in the CSV to point to the local filename
                row[image_column] = filename
                
            except Exception as e:
                msg = f"Row {row_num}: Failed to download image from Google Drive: {e}"
                print(f"Error in {name}: {msg}")
                errors_list.append(f"{name}: {msg}")
                return None
        
        updated_rows.append(row)
        
    # Reconstruct CSV string
    out = io.StringIO()
    writer = csv.DictWriter(out, fieldnames=fieldnames, lineterminator='\n')
    writer.writeheader()
    writer.writerows(updated_rows)
    return out.getvalue()

def handle_fallback(name, dest):
    print(f"  [WARNING] Checking fallbacks for {name}...")
    if os.path.exists(dest):
        print(f"  SUCCESS (FALLBACK): Reusing existing file at {dest}")
        return True
    root_filename = os.path.basename(dest)
    if os.path.exists(root_filename):
        try:
            shutil.copy2(root_filename, dest)
            print(f"  SUCCESS (FALLBACK): Copied local fallback {root_filename} to {dest}")
            return True
        except Exception as e:
            print(f"  ERROR: Failed to copy local fallback {root_filename}: {e}")
    print(f"  FATAL: No local fallback found for {name} (Checked {dest} and {root_filename})")
    return False

# Google Docs synchronization configuration
GOOGLE_DOCS = [
    {
        "id": "practice_intro",
        # Replace this URL with your published Google Doc web link:
        # File -> Share -> Publish to web -> Copy Link
        "url": "https://docs.google.com/document/d/e/2PACX-1vSrxMQMJX7vDAjR5QSPpOunOljTvBbXCamQMK6jclcmV0fHzC7exEfrm2ISgriW3D9NN7xOWYZ4GQTS/pub",
        "target_file": "practice.html",
        "placeholder": "practice_intro",
        "fallback_text": """<p>Any social-ecological practice is a collective effort. My entrepreneurial journey is multi-faceted involving landscape, urban design, urban planning, architecture, policy analysis, community engagement, and philanthropy. The <a href="http://www.edc.org.in" target="_blank" rel="noopener">Environmental Design Consultants (EDC) Ahmedabad</a> is my parent organization since 1995. EDC is partnered and lead by Landscape Architect Akshay Bhargava. At EDC, we provide landscape, architecture, and master planning services for large scale residential, recreational, institutional and industrial development with inclination to ecological restoration. Alongside EDC, I've taken initiatives with other organisations from time to time such as, <a href="http://www.saciwaters.org/index.php" target="_blank" rel="noopener">SaciWATERs Hyderabad</a>; <a href="http://taru.co.in" target="_blank" rel="noopener">TARU Ahmedabad</a>; <a href="http://www.cept.ac.in" target="_blank" rel="noopener">CEPT Ahmedabad</a>; Modi Associates; Urban Development Group; and <a href="http://www.sangath.org" target="_blank" rel="noopener">Stein, Doshi and Bhalla</a> (Sangath is now Vastushilpa Consultants). My advisory activities are with the local communities and local governments on various aspects spanning lake and community management. They are carried out through a not-for profit initiative of the EDC namely, Eco Development and Research Cell (EDRC). The practical experiences in diverse contexts and issues lay the foundation for my <a href="research.html">research</a> and <a href="teaching.html">teaching</a> besides nurturing my <a href="purpose.html">passion</a> and <a href="response.html">responses</a> to social-ecological aspects.</p>"""
    },
    {
        "id": "research_intro",
        # Replace this URL with your published Google Doc web link:
        # File -> Share -> Publish to web -> Copy Link
        "url": "https://docs.google.com/document/d/e/2PACX-1vSmv-zwJuYaVOBfVFHJJLDehBSyBmIWJ5xv22iKQL2AxCfW_QTHkWIhiRflm44dKW_lRaKiz_gbjPp2/pub",
        "target_file": "research.html",
        "placeholder": "research_intro",
        "fallback_text": """<p>My research interests are on the interrelationships (complementarities and conflicts) of the human development and nature conservation. My study of social-ecological system approach brings together the over two decades of understanding the various aspects of water and waterbodies wisdoms and worries with respect to urban planning, design, governance, management and sustainability. The interest on the ‘collective action’ or in other words, ‘governance’ by-for-of the people is at the core of this. Water’s connective capacity drives my aspiration to balance the applied and theoretical sciences for an improved understanding of the society as a continuum. The fact that research is involved in every initiative conceived in practice and teaching, the research experience becomes more integrated with instrumental and intrinsic values. Besides, engaging in multi-trans-disciplinary activities is fun and my forte.</p>"""
    },
    {
        "id": "teaching_intro",
        # Replace this URL with your published Google Doc web link:
        # File -> Share -> Publish to web -> Copy Link
        "url": "https://docs.google.com/document/d/e/2PACX-1vQpPtyUwBjyOLPxhW8kcWqgv0v6TqsSej73RXXDkxo1tyzUSo39jl7pIxV2LrvvJtYo-e8mjkqhNStK/pub",
        "target_file": "teaching.html",
        "placeholder": "teaching_intro",
        "fallback_text": """<p>With diverse practice and research activities, my teaching pedagogy stems from a <strong>trans-multi-disciplinary focus</strong> around the built environment. Teaching is a lifelong passion that enables constant learning through active sharing.</p>"""
    },
    {
        "id": "people_intro",
        # Replace this URL with your published Google Doc web link:
        # File -> Share -> Publish to web -> Copy Link
        "url": "https://docs.google.com/document/d/e/2PACX-1vQZk7y2b0C3zA3Ih300RNlxDaQhiLSF1Gw3po2BeE8epWCAjsgpMkSO_hXBDumcgllZs-PHxxLYQttA/pub",
        "target_file": "people.html",
        "placeholder": "people_intro",
        "fallback_text": """<p>Several people from our surrounding environment, present and past, influence our being. I understand how some have influenced me, while I continue learning from others to better understand society and self. I am blessed with friends, mentors, and critics who shape my thoughts. Teachers, clients, colleagues, and students remain a constant source of learning.</p>"""
    },
    {
        "id": "travel_intro",
        # Replace this URL with your published Google Doc web link:
        # File -> Share -> Publish to web -> Copy Link
        "url": "https://docs.google.com/document/d/e/2PACX-1vTkXyIKbBAKnvqsyALskwGJ2jx_3gDXneKBGxXmdaHmPGxLheTo3p_7Byrx8i3fpz-Ql3YdFRXNHmEX/pub",
        "target_file": "travel.html",
        "placeholder": "travel_intro",
        "fallback_text": """<h2>Journeys & Perspectives</h2>
<p>Work and a dream to know the world bring me to places. The networking, socializing and site seeing go hand in hand with the work. I'm an urban traveler and often been a solo traveler. Walking is my way of measuring a place. People and places of congregation interest me. Waterfronts are my favourite. I like to observe the activities in the small streets and spaces as they truly represent the culture of a place. I'm fascinated by the food and faith of the diverse cultures. Amidst the busy built environments of the cities, I'm often looking for nature and calmness. Yes, the nature trips are long overdue.</p>
<p>I've traveled to over hundred cities around the world and lived in a few. Born in Bilaspur (the rice bowl of India) and brought up partly there and partly in Bongaon (border city of India to Bangladesh) and Tatanagar (the Steel city of India), over the years, life has geographically shifted towards the west. Lived in Gwalior and Bhopal (lake city) for undergrad, then moved to Ahmedabad (Gandhi city) for a post grad and it is my Base as of now. Lived in Cambridge and Rotterdam for further post grads. Rotterdam feels as a second home where I lived long to pursue my PhD. With a short stint in the east at Kyoto, now I'm at the far west at Phoenix.</p>
<p>I believe in keeping the doors and windows open for all the cultures and values to enter my house and enrich my life experiences. Yet, I shall still remain grounded to my Indian roots.</p>"""
    },
    {
        "id": "resume_intro",
        # Replace this URL with your published Google Doc web link:
        # File -> Share -> Publish to web -> Copy Link
        "url": "https://docs.google.com/document/d/e/2PACX-1vSaMXdJhb79ihkc1wed_4H-ieNTu01gaseJ9tJgXRpJrwvsC66iJpo-6spI1V4XNeoW5pS4YJfA_wCc/pub",
        "target_file": "resume.html",
        "placeholder": "resume_intro",
        "fallback_text": """<p>With over twenty-five years of collaborative entrepreneurship, research, and education on large-scale development projects, my inclination is focused on <strong>ecological restoration</strong>. I am deeply concerned about reducing water resources and the related rising water distress.</p>
<p>My understanding of water as a complex <strong>social-ecological system</strong> has made me a keen political observer and gender-sensitive advocate. For maximizing governance and minimizing government to facilitate civil society in understanding the problems and finding the solutions, the crucial role of women must be clearly and cleverly integrated.</p>
<p>This thinking comes from multidisciplinary global scholarships supported by various fellowships and fraternities, alongside active on-ground engagement to connect science and society. My engagements converge with my passion, as I do what I do to try to remain sensitive and sensible, causing the least possible harm to the planet and the people—including if that means doing nothing!</p>
<p>I believe it is time to slow down to heal the planet for us to even live now. Besides, there is a longing for a just society, where humanity and biodiversity are the primary drivers. A line that describes me in short is: <strong>an open inquisitive child for whom the god, if any, lies in the freedom, and the value of that freedom is immeasurable!</strong></p>"""
    }
]

def fetch_and_clean_google_doc(url):
    html_data, _ = download_url(url)
    html_content = html_data.decode('utf-8')
    
    from bs4 import BeautifulSoup
    from urllib.parse import unquote
    soup = BeautifulSoup(html_content, 'html.parser')
    
    contents_div = soup.find(id="contents")
    if not contents_div:
        contents_div = soup.body if soup.body else soup
        
    allowed_tags = {'p', 'a', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'}
    
    # Pre-clean tags attributes
    for elem in contents_div.find_all(True):
        if elem.name in allowed_tags:
            attrs = {}
            if elem.name == 'a':
                href = elem.get('href')
                if href:
                    # Strip Google outbound redirects
                    match = re.search(r'google\.com/url\?q=([^&]+)', href)
                    if match:
                        href = unquote(match.group(1))
                    
                    # Convert absolute mansee.in URLs to relative preview HTML paths
                    domain_match = re.match(r'https?://(?:www\.)?mansee\.in/([^/]+)/?', href)
                    if domain_match:
                        page_id = domain_match.group(1)
                        mapping = {
                            "practice": "practice.html",
                            "practice-2": "practice.html",
                            "research": "research.html",
                            "teaching": "teaching.html",
                            "passion": "purpose.html",
                            "reaction": "response.html",
                            "talks": "talks.html",
                            "people": "people.html",
                            "resume": "resume.html",
                            "travels": "travel.html",
                            "contact": "contact.html"
                        }
                        if page_id in mapping:
                            href = mapping[page_id]
                            
                    attrs['href'] = href
                    if href.startswith('http'):
                        attrs['target'] = '_blank'
                        attrs['rel'] = 'noopener'
            elem.attrs = attrs
            
    # Identify bold/italic classes from style tags in the document
    bold_classes = set()
    italic_classes = set()
    style_tags = soup.find_all('style')
    for tag in style_tags:
        style_text = tag.string if tag.string else ''
        rules = re.findall(r'\.([a-zA-Z0-9_-]+)\s*\{([^}]+)\}', style_text)
        for class_name, body in rules:
            body_clean = body.replace(' ', '').lower()
            if 'font-weight:700' in body_clean or 'font-weight:bold' in body_clean:
                bold_classes.add(class_name)
            if 'font-style:italic' in body_clean:
                italic_classes.add(class_name)

    # Convert spans inside contents_div that should be bold or italic to strong/em
    for span in contents_div.find_all('span'):
        classes = span.get('class', [])
        style = str(span.get('style', '')).replace(' ', '').lower()
        
        is_bold = any(c in bold_classes for c in classes) or 'font-weight:700' in style or 'font-weight:bold' in style
        is_italic = any(c in italic_classes for c in classes) or 'font-style:italic' in style
        
        if is_bold and is_italic:
            span.name = 'strong'
            span.attrs = {}
            em_tag = soup.new_tag('em')
            span.wrap(em_tag)
        elif is_bold:
            span.name = 'strong'
            span.attrs = {}
        elif is_italic:
            span.name = 'em'
            span.attrs = {}

    container = contents_div.find(class_="doc-content")
    if not container:
        container = contents_div
 
    paragraphs = []
    for child in container.children:
        if hasattr(child, 'name') and child.name in {'p', 'ul', 'ol', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'}:
            for span in child.find_all('span'):
                span.unwrap()
            
            for sub in child.find_all(True):
                if sub.name not in allowed_tags:
                    sub.unwrap()
                else:
                    if sub.name != 'a':
                        sub.attrs = {}
                        
            text_val = str(child).strip()
            text_val = text_val.replace('\xa0', ' ')
            if text_val and text_val not in {'<p></p>', '<p> </p>', '<p>&nbsp;</p>'}:
                paragraphs.append(text_val)
                
    return '\n'.join(paragraphs)

def inject_content_into_file(target_file, placeholder, content):
    if not os.path.exists(target_file):
        print(f"  [WARNING] Target file {target_file} not found. Skipping injection.")
        return False
        
    start_tag = f"<!-- START_DOC_CONTENT:{placeholder} -->"
    end_tag = f"<!-- END_DOC_CONTENT:{placeholder} -->"
    
    with open(target_file, "r", encoding="utf-8") as f:
        file_content = f.read()
        
    start_idx = file_content.find(start_tag)
    end_idx = file_content.find(end_tag)
    
    if start_idx == -1 or end_idx == -1:
        print(f"  [WARNING] Comments for placeholder '{placeholder}' not found in {target_file}.")
        return False
        
    new_content = (
        file_content[:start_idx + len(start_tag)] +
        "\n            " + content + "\n            " +
        file_content[end_idx:]
    )
    
    with open(target_file, "w", encoding="utf-8", newline="") as f:
        f.write(new_content)
        
    print(f"  SUCCESS: Injected doc content into {target_file} between comments.")
    return True

def main():
    print("Starting build-time Google Sheets CSV downloader and validator...")
    os.makedirs("data", exist_ok=True)
    
    is_vercel = os.environ.get("VERCEL") == "1"
    if is_vercel:
        print("Vercel production environment detected. Fallback mechanisms are DISABLED.")
    else:
        print("Local or non-production environment detected. Fallback mechanisms are ENABLED.")
        
    all_passed = True
    all_errors = []
    
    for config in CONFIGS:
        name = config["name"]
        url = config["url"]
        dest = config["dest"]
        required_headers = config["required_headers"]
        validators = config["validators"]
        image_column = config.get("image_column")
        image_dest_dir = config.get("image_dest_dir")
        
        print(f"\nProcessing {name}...")
        success = False
        sheet_errors = []
        try:
            csv_data_bytes, _ = download_url(url)
            csv_text = csv_data_bytes.decode('utf-8')
            print(f"  Downloaded {len(csv_text)} characters.")
            
            # 1. Validate metadata schema
            if validate_csv(csv_text, name, required_headers, validators, sheet_errors):
                # 2. If config defines image downloading, process the image rows
                if image_column and image_dest_dir:
                    processed_csv = process_images_in_csv(csv_text, image_column, image_dest_dir, name, sheet_errors)
                    if processed_csv is not None:
                        csv_text = processed_csv
                        success = True
                    else:
                        print(f"  FAILED: Image downloading/processing failed for {name}")
                else:
                    success = True
                
                if success:
                    # Filter out empty rows from CSV before writing
                    csv_text = filter_empty_rows_from_csv(csv_text)
                    # Write to file
                    with open(dest, "w", encoding="utf-8", newline="") as out_file:
                        out_file.write(csv_text)
                    print(f"  SUCCESS: Written to {dest}")
            else:
                print(f"  FAILED: Validation error in {name}")
                all_errors.extend(sheet_errors)
                
        except Exception as e:
            msg = f"Error downloading or parsing sheet: {e}"
            print(f"  FAILED: {msg}")
            all_errors.append(f"{name}: {msg}")
            
        if not success:
            all_errors.extend(sheet_errors)
            if is_vercel:
                print("  [ALERT] Bypassing fallback in Vercel environment.")
                all_passed = False
            else:
                if handle_fallback(name, dest):
                    print("  [INFO] Using fallback for local compilation.")
                else:
                    all_passed = False
                    
    if not all_passed:
        if all_errors:
            print("\nCollecting errors and sending alert notification email...")
            send_error_email(all_errors)
        print("\nBuild-time data validation FAILED. Aborting build.")
        sys.exit(1)
        
    print("\nAll Google Sheets datasets processed successfully!")
    
    # Process Google Docs
    print("\nProcessing Google Docs synchronization...")
    for doc in GOOGLE_DOCS:
        doc_id = doc["id"]
        url = doc["url"]
        target_file = doc["target_file"]
        placeholder = doc["placeholder"]
        fallback = doc["fallback_text"]
        
        success = False
        content = ""
        
        if "YOUR_DOC_ID" in url or "e/2PACX-1vQWJcZqG58pMug4wN_xL8291416954201889/pub" in url:
            print(f"  [INFO] URL for {doc_id} is a placeholder. Using local fallback.")
            content = fallback
            success = True
        else:
            try:
                print(f"  Downloading Google Doc from: {url}")
                content = fetch_and_clean_google_doc(url)
                if content:
                    success = True
                    print(f"  Parsed Google Doc content successfully ({len(content)} chars).")
                else:
                    print(f"  [WARNING] Empty content parsed from Google Doc.")
            except Exception as e:
                print(f"  [WARNING] Failed to fetch or parse Google Doc {doc_id}: {e}")
        
        if not success:
            print(f"  [INFO] Reusing fallback content for {doc_id}.")
            content = fallback
            
        inject_content_into_file(target_file, placeholder, content)
        
    print("\nAll Google Docs synchronization processed successfully!")
    sys.exit(0)

if __name__ == "__main__":
    main()
