from pathlib import Path
import re, zipfile, struct
from html.parser import HTMLParser

root = Path('outputs/un-universo-para-amidala').resolve()
css = root / 'css/styles.css'
s = css.read_text(encoding='utf-8-sig')
lines, buf, depth, parens, quote, i = [], '', 0, 0, None, 0

def flush(suffix=''):
    global buf
    text = buf.strip()
    if text or suffix:
        if suffix == ';':
            text = re.sub(r'^([\w-]+):\s*', r'\1: ', text)
        lines.append('  ' * depth + text + suffix)
    buf = ''

while i < len(s):
    c = s[i]
    if quote:
        buf += c
        if c == quote and (i == 0 or s[i-1] != '\\'):
            quote = None
    elif s.startswith('/*', i):
        flush()
        end = s.index('*/', i) + 2
        lines.append('\n' + '  ' * depth + s[i:end])
        i = end
        continue
    elif c in ('"', "'"):
        quote = c
        buf += c
    elif c == '(':
        parens += 1
        buf += c
    elif c == ')':
        parens -= 1
        buf += c
    elif c == '{' and not parens:
        flush(' {')
        depth += 1
    elif c == '}' and not parens:
        flush(';') if buf.strip() else None
        depth -= 1
        lines.append('  ' * depth + '}')
        if depth == 0:
            lines.append('')
    elif c == ';' and not parens:
        flush(';')
    else:
        buf += c
    i += 1
flush()
assert depth == 0 and parens == 0 and quote is None
css.write_text('\n'.join(lines).strip() + '\n', encoding='utf-8')

class References(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for key, val in attrs:
            if key in ('src','href') and val and not val.startswith(('data:','#','http')):
                assert (root/val).is_file(), f'Missing asset {val}'
References().feed((root/'index.html').read_text(encoding='utf-8-sig'))
for ref in re.findall(r'url\([\'"]?([^\)\'\"]+)', css.read_text(encoding='utf-8')):
    assert (css.parent/ref).resolve().is_file(), f'Missing CSS asset {ref}'
img = (root/'assets/ramos.png').read_bytes()
assert img[:8] == b'\x89PNG\r\n\x1a\n'
assert struct.unpack('>II',img[16:24]) == (1536,1024)
assert (root/'.nojekyll').is_file()
expected = ['.gitignore','.nojekyll','README.md','index.html','css/styles.css','js/app.js','js/dedicatorias.js','assets/ramos.png']
actual = sorted(p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file())
assert actual == sorted(expected), actual
archive = root.parent/'un-universo-para-amidala.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
    for item in actual:
        z.write(root/item, root.name+'/'+item)
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    print('Validated assets, CSS structure, image dimensions and ZIP integrity.')
    print('Files:', len(z.namelist()))
    print('ZIP bytes:',archive.stat().st_size)
    print('\n'.join(z.namelist()))
