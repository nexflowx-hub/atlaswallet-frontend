"""
AtlasWallet — PWA icon generator.
Generates 192, 512, maskable, and apple-touch icons from the brand mark.
"""
from PIL import Image, ImageDraw
import os

OUT_DIR = "/home/z/my-project/public/icons"
os.makedirs(OUT_DIR, exist_ok=True)

# AtlasWallet palette
BG = (2, 7, 17)            # #020711
BG_ELEV = (10, 20, 36)     # #0A1424
BRAND = (22, 135, 255)     # #1687FF
WHITE = (245, 248, 252)


def make_icon(size):
    img = Image.new("RGBA", (size, size), BG + (255,))
    draw = ImageDraw.Draw(img)
    radius = int(size * 0.18)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=BG_ELEV)
    draw.rounded_rectangle(
        [0, 0, size - 1, size - 1],
        radius=radius,
        outline=BRAND,
        width=max(1, int(size * 0.01)),
    )
    pad = int(size * 0.20)
    cx = size // 2
    inner = size - 2 * pad
    top_y = pad + int(inner * 0.18)
    base_y = pad + int(inner * 0.78)
    mid_y = pad + int(inner * 0.55)
    half_w = int(inner * 0.42)
    points_outer = [
        (cx, top_y),
        (cx + half_w, base_y),
        (cx + half_w // 2, base_y),
        (cx, mid_y),
        (cx - half_w // 2, base_y),
        (cx - half_w, base_y),
    ]
    draw.polygon(points_outer, fill=BRAND)
    points_left = [
        (cx, top_y),
        (cx, mid_y),
        (cx - half_w // 2, base_y),
        (cx - half_w, base_y),
    ]
    draw.polygon(points_left, fill=(int(BRAND[0] * 0.7), int(BRAND[1] * 0.7), int(BRAND[2] * 0.95)))
    path = os.path.join(OUT_DIR, f"icon-{size}.png")
    img.save(path, "PNG", optimize=True)
    print(f"Saved {path}")


def make_maskable(size):
    img = Image.new("RGBA", (size, size), BG + (255,))
    draw = ImageDraw.Draw(img)
    draw.rectangle([0, 0, size - 1, size - 1], fill=BG_ELEV)
    pad = int(size * 0.22)
    cx = size // 2
    cy = size // 2
    inner = size - 2 * pad
    top_y = cy - int(inner * 0.32)
    base_y = cy + int(inner * 0.30)
    mid_y = cy - int(inner * 0.02)
    half_w = int(inner * 0.28)
    points_outer = [
        (cx, top_y),
        (cx + half_w, base_y),
        (cx + half_w // 2, base_y),
        (cx, mid_y),
        (cx - half_w // 2, base_y),
        (cx - half_w, base_y),
    ]
    draw.polygon(points_outer, fill=BRAND)
    points_left = [
        (cx, top_y),
        (cx, mid_y),
        (cx - half_w // 2, base_y),
        (cx - half_w, base_y),
    ]
    draw.polygon(points_left, fill=(int(BRAND[0] * 0.7), int(BRAND[1] * 0.7), int(BRAND[2] * 0.95)))
    path = os.path.join(OUT_DIR, f"icon-{size}-maskable.png")
    img.save(path, "PNG", optimize=True)
    print(f"Saved {path}")


def make_apple_touch(size=180):
    img = Image.new("RGBA", (size, size), BG + (255,))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=40, fill=BG_ELEV)
    pad = int(size * 0.22)
    cx = size // 2
    inner = size - 2 * pad
    top_y = pad + int(inner * 0.18)
    base_y = pad + int(inner * 0.78)
    mid_y = pad + int(inner * 0.55)
    half_w = int(inner * 0.42)
    points_outer = [
        (cx, top_y),
        (cx + half_w, base_y),
        (cx + half_w // 2, base_y),
        (cx, mid_y),
        (cx - half_w // 2, base_y),
        (cx - half_w, base_y),
    ]
    draw.polygon(points_outer, fill=BRAND)
    points_left = [
        (cx, top_y),
        (cx, mid_y),
        (cx - half_w // 2, base_y),
        (cx - half_w, base_y),
    ]
    draw.polygon(points_left, fill=(int(BRAND[0] * 0.7), int(BRAND[1] * 0.7), int(BRAND[2] * 0.95)))
    path = os.path.join(OUT_DIR, "apple-touch-icon.png")
    img.save(path, "PNG", optimize=True)
    print(f"Saved {path}")


if __name__ == "__main__":
    make_icon(192)
    make_icon(512)
    make_maskable(192)
    make_maskable(512)
    make_apple_touch(180)
    print("All icons generated.")
