"""Run after npm run build. Produces a self-contained, file:// friendly preview."""
from pathlib import Path
import re,base64
root=Path(__file__).resolve().parents[1]
dist=root/'dist'; html=(dist/'index.html').read_text()
def embed_css(m):
 css=(dist/m.group(1).lstrip('/')).read_text()
 def embed_url(match):
  path=match.group(1).strip('"\'');p=dist/path.lstrip('/')
  if p.is_file():
   mime='font/ttf' if p.suffix=='.ttf' else 'application/octet-stream'
   return 'url(data:'+mime+';base64,'+base64.b64encode(p.read_bytes()).decode()+')'
  return match.group(0)
 css=re.sub(r'url\(([^)]+)\)',embed_url,css)
 return '<style>'+css+'</style>'
html=re.sub(r'<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>',embed_css,html)
scripts=[]
def embed_js(m):
 js=(dist/m.group(1).lstrip('/')).read_text().replace('</script','<\\/script')
 scripts.append('<script type="module">'+js+'</script>');return ''
html=re.sub(r'<script type="module"[^>]*src="([^"]+)"[^>]*></script>',embed_js,html)
html=html.replace('</body>','\n'.join(scripts)+'\n</body>')
favicon=base64.b64encode((root/'public/favicon.svg').read_bytes()).decode()
html=html.replace('href="/favicon.svg"','href="data:image/svg+xml;base64,'+favicon+'"')
(root/'Aegis-Preview.html').write_text(html)
print('Portable HTML:',len(html),'bytes')
