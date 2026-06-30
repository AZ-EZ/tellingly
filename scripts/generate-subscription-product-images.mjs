import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const outDir = "app-store/subscription-images";

await mkdir(outDir, { recursive: true });

const images = [
  {
    file: "tellingly-plus-monthly.jpg",
    eyebrow: "MONTHLY",
    title: "Tellingly Plus",
    price: "$3.99/mo",
  },
  {
    file: "tellingly-plus-annual.jpg",
    eyebrow: "ANNUAL",
    title: "Tellingly Plus",
    price: "$24.99/yr",
  },
];

for (const image of images) {
  await sharp(Buffer.from(render(image)))
    .flatten({ background: "#101116" })
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toFile(`${outDir}/${image.file}`);
}

function render(image) {
  return `
    <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#15191d"/>
          <stop offset=".55" stop-color="#101116"/>
          <stop offset="1" stop-color="#332022"/>
        </linearGradient>
        <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#9af0cc" stop-opacity=".55"/>
          <stop offset="1" stop-color="#ff6046" stop-opacity=".68"/>
        </linearGradient>
      </defs>
      <rect width="1024" height="1024" rx="210" fill="url(#bg)"/>
      <circle cx="790" cy="228" r="188" fill="#9af0cc" opacity=".13"/>
      <circle cx="864" cy="814" r="292" fill="#ff6046" opacity=".16"/>
      <path d="M108 724c210-64 404-66 612-8 64 18 127 41 196 69" fill="none" stroke="#f6f0df" stroke-width="2" opacity=".18"/>
      <path d="M108 774c210-64 404-66 612-8 64 18 127 41 196 69" fill="none" stroke="#f6f0df" stroke-width="2" opacity=".14"/>

      <text x="96" y="156" fill="#f6f0df" font-family="Arial, sans-serif" font-size="39" font-weight="900" letter-spacing="8">TELLINGLY</text>
      <text x="96" y="246" fill="#9af0cc" font-family="Arial, sans-serif" font-size="30" font-weight="900" letter-spacing="7">${escapeXml(image.eyebrow)}</text>
      <text x="96" y="394" fill="#f6f0df" font-family="Georgia, serif" font-size="88" font-style="italic">${escapeXml(image.title)}</text>
      <text x="96" y="500" fill="#ff6046" font-family="Arial, sans-serif" font-size="68" font-weight="900">${escapeXml(image.price)}</text>
      <foreignObject x="96" y="560" width="750" height="160">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial, sans-serif; color:#c9c0ad; font-size:36px; line-height:1.22; font-weight:700;">
          Archive, trait trends, compatibility history, and extra question packs.
        </div>
      </foreignObject>
      <rect x="96" y="820" width="476" height="72" rx="24" fill="url(#glow)"/>
      <text x="334" y="868" text-anchor="middle" fill="#111116" font-family="Arial, sans-serif" font-size="30" font-weight="900">UNLOCK PLUS</text>
    </svg>
  `;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
