"""Verify selected SuperSplat scene pages and download their licensed preview images.

Run manually before publishing new community demos. A creator license does not
resolve every possible upstream-rights issue; review each description too.
"""

import re
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "public" / "community"

SCENES = {
    "skylark-cafe": "e313b44a",
    "modlinek-villa": "2380253c",
    "pantheon-interior": "dac6e508",
    "repc-museum": "04ff1ba2",
    "avoncroft-postmill": "ac397573",
    "olio-cafe": "17c8391f",
    "full-apartment": "eed8f458",
}


def get(url):
    request = Request(url, headers={"User-Agent": "DigitalTwinLicenseCheck/1.0"})
    with urlopen(request, timeout=30) as response:
        return response.read(), response.headers


def main():
    DEST.mkdir(parents=True, exist_ok=True)
    for name, scene_id in SCENES.items():
        url = f"https://superspl.at/scene/{scene_id}"
        body, headers = get(url)
        html = body.decode("utf-8")
        if '<link rel="license" href="https://creativecommons.org/licenses/by/4.0/"' not in html:
            raise ValueError(f"License is no longer shown as CC BY 4.0: {url}")
        match = re.search(r'<meta property="og:image" content="([^"]+)"', html)
        if not match:
            raise ValueError(f"No preview image found: {url}")
        image_url = match.group(1)
        image, image_headers = get(image_url)
        if image_headers.get_content_type() != "image/webp":
            raise ValueError(f"Unexpected preview format: {image_url}")
        embed, _ = get(f"https://superspl.at/s?id={scene_id}")
        if b"SuperSplat Viewer" not in embed:
            raise ValueError(f"Embed endpoint unavailable: {scene_id}")
        output = DEST / f"{name}.webp"
        output.write_bytes(image)
        print(name, scene_id, len(image), headers.get("x-frame-options"), headers.get("content-security-policy"))


if __name__ == "__main__":
    main()
