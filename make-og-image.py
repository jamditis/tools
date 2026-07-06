#!/usr/bin/env python3
"""Generate the social-preview image (resource-kit/docs/assets/og-image.png, 1200x630).

The card reuses the site's own identity: the dark green and cream of the favicon
(the serif "A" mark is redrawn here as the badge) plus the blue accent from the
docs CSS. A small row of tool tiles stands in for the directory itself, so the
share card depicts what the page is: a kit of AI tools and guides for newsrooms.
Text is rendered with the system DejaVu fonts and rasterized with rsvg-convert, so
the output is deterministic and needs no browser.

Run after changing the title, tagline, or palette (works from any directory; the
output path is resolved relative to this file):

    python3 make-og-image.py

Requires rsvg-convert and the DejaVu fonts the card is drawn with -- rsvg silently
substitutes another font if they are absent, which would change the rendering
(Debian/Ubuntu: `sudo apt install librsvg2-bin fonts-dejavu-core`).
"""
import os
import shutil
import subprocess
import tempfile

W, H = 1200, 630
GREEN = "#3d4b40"    # favicon background, brand primary
CREAM = "#ede6d4"    # favicon text, paper
BLUE = "#60a5fa"     # docs CSS accent
TILE = "#33403a"     # slightly darker green for the tool tiles
MUTED = "#b9b09a"    # muted cream for the footer

TITLE = "AI tools + resources"
SUBTITLE = "for newsrooms"
TAGLINE = "Practical guides, templates, and reference for building with AI."
FOOTER = "Center for Cooperative Media   ·   tools.amditis.tech"

# A row of tool tiles (the directory motif). Each tile gets a small accent dot and
# two text bars, so the row reads as a set of tool cards without naming any tool.
TILE_ACCENTS = [BLUE, CREAM, BLUE, CREAM]

OUT = os.path.join(os.path.dirname(__file__), "resource-kit", "docs", "assets", "og-image.png")


def build_svg():
    p = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">']
    p.append(f'<rect width="{W}" height="{H}" fill="{GREEN}"/>')
    p.append(f'<rect x="16" y="16" width="{W - 32}" height="{H - 32}" fill="none" stroke="{CREAM}" stroke-width="2" stroke-opacity="0.6"/>')

    # "A" mark badge (redrawn from favicon.svg): cream rounded square, green serif A.
    bx, by, bs = 80, 74, 116
    p.append(f'<rect x="{bx}" y="{by}" width="{bs}" height="{bs}" rx="20" fill="{CREAM}"/>')
    p.append(f'<text x="{bx + bs / 2}" y="{by + bs / 2}" font-family="DejaVu Serif" font-weight="bold" font-size="78" fill="{GREEN}" text-anchor="middle" dominant-baseline="central">A</text>')

    # Wordmark + subtitle (right of the badge).
    p.append(f'<text x="228" y="140" font-family="DejaVu Serif" font-weight="bold" font-size="76" fill="{CREAM}">{TITLE}</text>')
    p.append(f'<text x="230" y="196" font-family="DejaVu Sans" font-size="42" fill="{BLUE}">{SUBTITLE}</text>')

    # Directory motif: a row of four tool tiles.
    tile_w, tile_h, gap, top = 240, 150, 24, 280
    total = 4 * tile_w + 3 * gap
    left = (W - total) // 2
    for i, accent in enumerate(TILE_ACCENTS):
        tx = left + i * (tile_w + gap)
        p.append(f'<rect x="{tx}" y="{top}" width="{tile_w}" height="{tile_h}" rx="14" fill="{TILE}" stroke="{CREAM}" stroke-width="1.5" stroke-opacity="0.35"/>')
        p.append(f'<circle cx="{tx + 28}" cy="{top + 34}" r="10" fill="{accent}"/>')
        p.append(f'<rect x="{tx + 48}" y="{top + 26}" width="120" height="15" rx="7" fill="{CREAM}" fill-opacity="0.85"/>')
        p.append(f'<rect x="{tx + 24}" y="{top + 74}" width="{tile_w - 48}" height="12" rx="6" fill="{CREAM}" fill-opacity="0.55"/>')
        p.append(f'<rect x="{tx + 24}" y="{top + 98}" width="{tile_w - 90}" height="12" rx="6" fill="{CREAM}" fill-opacity="0.4"/>')

    # Tagline + footer.
    p.append(f'<text x="80" y="512" font-family="DejaVu Sans" font-size="30" fill="{CREAM}" fill-opacity="0.92">{TAGLINE}</text>')
    p.append(f'<line x1="80" y1="540" x2="{W - 80}" y2="540" stroke="{CREAM}" stroke-width="2" stroke-opacity="0.4"/>')
    p.append(f'<text x="80" y="584" font-family="DejaVu Sans" font-size="25" fill="{MUTED}">{FOOTER}</text>')

    p.append("</svg>")
    return "\n".join(p)


def main():
    if shutil.which("rsvg-convert") is None:
        raise SystemExit(
            "rsvg-convert not found. Install it and the DejaVu fonts the card needs:\n"
            "  sudo apt install librsvg2-bin fonts-dejavu-core"
        )
    svg = build_svg()
    with tempfile.NamedTemporaryFile("w", suffix=".svg", delete=False) as f:
        f.write(svg)
        svg_path = f.name
    try:
        os.makedirs(os.path.dirname(OUT), exist_ok=True)
        subprocess.run(["rsvg-convert", "-w", str(W), "-h", str(H), svg_path, "-o", OUT], check=True)
    finally:
        os.unlink(svg_path)
    print(f"wrote {OUT} ({W}x{H})")


if __name__ == "__main__":
    main()
