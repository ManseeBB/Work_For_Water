import re
html = open('source.html', encoding='utf-8').read()
imgs = re.findall(r'src="([^"]+\.(?:jpg|png|jpeg))"', html)
urls = re.findall(r'url\(([^)]+)\)', html)
all_images = set(imgs + urls)
print('\n'.join(all_images))
