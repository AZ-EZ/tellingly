import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const iconSvg = "public/assets/icon.svg";
const appShot = "tellingly-home.png";

await mkdir("app-store/screenshots-6-9", { recursive: true });
await mkdir("ios/App/App/Assets.xcassets/AppIcon.appiconset", { recursive: true });

const opaqueIcon = await sharp(iconSvg)
  .resize(1024, 1024)
  .flatten({ background: "#101116" })
  .toColourspace("srgb")
  .png({ palette: false })
  .toBuffer();

await sharp(opaqueIcon).toFile("app-store/app-icon-1024.png");
await sharp(opaqueIcon).toFile("ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png");

const phone = await sharp(appShot)
  .resize({ width: 560 })
  .png()
  .toBuffer();

const slides = [
  {
    file: "tellingly-01-daily-question.png",
    title: "One sharp question a day.",
    subtitle: "Answer in one tap. No profile, no feed, no performance."
  },
  {
    file: "tellingly-02-live-split.png",
    title: "See the live split.",
    subtitle: "Your answer lands inside the crowd instantly."
  },
  {
    file: "tellingly-03-rarity.png",
    title: "Find out how rare you are.",
    subtitle: "A percentage, a pattern, and one sentence worth keeping."
  },
  {
    file: "tellingly-04-pattern-card.png",
    title: "Build a private pattern map.",
    subtitle: "Your answers compound into a weekly share card."
  },
  {
    file: "tellingly-05-compare.png",
    title: "Compare with a friend.",
    subtitle: "Send the same set and see where your instincts split."
  }
];

for (const [index, slide] of slides.entries()) {
  const bg = Buffer.from(`
    <svg width="1290" height="2796" xmlns="http://www.w3.org/2000/svg">
      <rect width="1290" height="2796" fill="#101116"/>
      <path d="M0 0H1290V880C1000 760 730 210 0 0Z" fill="#241417"/>
      <circle cx="1070" cy="360" r="210" fill="#8de6c1" opacity=".12"/>
      <circle cx="1010" cy="2120" r="330" fill="#ff6046" opacity=".12"/>
      <text x="92" y="232" fill="#f6f0df" font-family="Arial, sans-serif" font-size="86" font-weight="800">${escapeXml(slide.title)}</text>
      <foreignObject x="92" y="300" width="900" height="180">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial, sans-serif; color:#a6a094; font-size:44px; line-height:1.2; font-weight:600;">${escapeXml(slide.subtitle)}</div>
      </foreignObject>
      <text x="92" y="2648" fill="#8de6c1" font-family="Arial, sans-serif" font-size="34" font-weight="800" letter-spacing="7">TELLINGLY</text>
      <text x="1110" y="2648" fill="#a6a094" font-family="Arial, sans-serif" font-size="30" font-weight="700">0${index + 1}</text>
    </svg>
  `);

  await sharp(bg)
    .composite([
      {
        input: Buffer.from(`
          <svg width="666" height="1440" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="666" height="1440" rx="80" fill="#050609"/>
            <rect x="18" y="18" width="630" height="1404" rx="64" fill="#161820"/>
          </svg>
        `),
        top: 840,
        left: 312
      },
      {
        input: phone,
        top: 872,
        left: 365
      }
    ])
    .png()
    .toFile(`app-store/screenshots-6-9/${slide.file}`);
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
