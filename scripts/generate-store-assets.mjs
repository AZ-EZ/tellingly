import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const iconSvg = "public/assets/icon.svg";
const mobileScreenshot = "tellingly-home.png";

await mkdir("public/assets/icons", { recursive: true });
await mkdir("assets/store", { recursive: true });

await sharp(iconSvg).resize(192, 192).png().toFile("public/assets/icons/icon-192.png");
await sharp(iconSvg).resize(512, 512).png().toFile("public/assets/icons/icon-512.png");
const maskableInner = await sharp(iconSvg).resize(416, 416).png().toBuffer();
await sharp({
  create: {
    width: 512,
    height: 512,
    channels: 4,
    background: "#101116"
  }
})
  .composite([{ input: maskableInner, top: 48, left: 48 }])
  .png()
  .toFile("public/assets/icons/maskable-512.png");
await sharp(iconSvg).resize(300, 300).png().toFile("assets/store/tellingly-store-tile-300.png");

const screenshot = await sharp(mobileScreenshot)
  .resize({ height: 700 })
  .png()
  .toBuffer();

await sharp({
  create: {
    width: 1366,
    height: 768,
    channels: 4,
    background: "#101116"
  }
})
  .composite([
    {
      input: Buffer.from(`
        <svg width="1366" height="768" xmlns="http://www.w3.org/2000/svg">
          <rect width="1366" height="768" fill="#101116"/>
          <path d="M0 0H1366V310C1002 270 762 36 0 0Z" fill="#241417" opacity=".9"/>
          <path d="M1040 100C1120 140 1200 245 1160 326C1122 402 984 386 930 318C874 247 928 124 1040 100Z" fill="#8de6c1" opacity=".12"/>
          <text x="92" y="170" fill="#f6f0df" font-family="Arial, sans-serif" font-size="78" font-weight="800">One sharp question a day.</text>
          <text x="96" y="230" fill="#a6a094" font-family="Arial, sans-serif" font-size="28">Answer once. See the live split. Compare with a friend.</text>
        </svg>
      `),
      top: 0,
      left: 0
    },
    {
      input: screenshot,
      top: 34,
      left: 902
    }
  ])
  .png()
  .toFile("assets/store/tellingly-store-screenshot-desktop.png");
