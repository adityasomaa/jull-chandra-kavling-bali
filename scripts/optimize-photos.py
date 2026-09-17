# Kompres ulang foto di public/photos (progressive JPEG, lebar maksimum 1920).
# Jalankan setelah `npm run photos`: python scripts/optimize-photos.py
import glob
from PIL import Image

for f in sorted(glob.glob("public/photos/*.jpg")):
    im = Image.open(f).convert("RGB")
    if im.width > 1920:
        im = im.resize((1920, round(1920 * im.height / im.width)), Image.LANCZOS)
    q = 70 if im.width >= 1600 else 74
    im.save(f, "JPEG", quality=q, optimize=True, progressive=True)
