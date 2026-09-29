# Homepage image loading

The homepage downloads the original 4032 × 3024 JPEG (4,281,192 bytes) for a photo displayed at up to 900 CSS pixels wide. It bypasses existing responsive WebP output, has automatic request priority, and lacks intrinsic height. A cold-cache trace at 4 Mbps / 150 ms latency showed the image taking about 10 seconds to transfer and visible layout shifts.

Use the existing generated 480, 800, and 1400-pixel WebP variants in a native picture element. Set sizes to the actual page content width, mark this above-the-fold image eager/high priority, and supply its original width and height so the browser reserves the correct aspect ratio. Preserve the original JPEG as the fallback, including when responsive image generation is disabled. Keep the existing photo and layout; no new assets, dependencies, global theme overrides, or preload requests are needed.

Validation: guard against downloading the original on modern browsers, keep the selected image payload under 400 KB, and verify space is reserved while the image request is held. Build in production, run both upgrade audits and the NAIL desktop/mobile suite after PurgeCSS, inspect visual parity, and repeat the same network measurement on the published site.
