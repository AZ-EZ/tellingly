import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const outDir = "app-store/subscription-screenshots";

await mkdir(outDir, { recursive: true });

const plans = [
  {
    file: "tellingly-plus-monthly-review.png",
    selected: "monthly",
    title: "Tellingly Plus Monthly",
    price: "$3.99/mo",
  },
  {
    file: "tellingly-plus-annual-review.png",
    selected: "annual",
    title: "Tellingly Plus Annual",
    price: "$24.99/yr",
  },
];

for (const plan of plans) {
  await sharp(Buffer.from(render(plan)))
    .png()
    .toFile(`${outDir}/${plan.file}`);
}

function render(plan) {
  const annualSelected = plan.selected === "annual";
  const monthlySelected = plan.selected === "monthly";
  return `
    <svg width="1290" height="2796" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#11151a"/>
          <stop offset=".55" stop-color="#101116"/>
          <stop offset="1" stop-color="#281719"/>
        </linearGradient>
        <linearGradient id="card" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#20232b"/>
          <stop offset="1" stop-color="#15171d"/>
        </linearGradient>
      </defs>
      <rect width="1290" height="2796" fill="url(#bg)"/>
      <path d="M0 0H1290V760C950 640 720 220 0 0Z" fill="#2d1b20"/>
      <circle cx="1010" cy="350" r="220" fill="#8de6c1" opacity=".14"/>
      <circle cx="1040" cy="2200" r="360" fill="#ff6046" opacity=".15"/>

      <text x="116" y="230" fill="#f6f0df" font-family="Arial, sans-serif" font-size="42" font-weight="800" letter-spacing="8">TELLINGLY</text>
      <text x="116" y="362" fill="#ff6046" font-family="Georgia, serif" font-size="78" font-style="italic">${escapeXml(plan.title)}</text>
      <foreignObject x="116" y="420" width="1010" height="190">
        <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Arial, sans-serif; color:#c9c0ad; font-size:42px; line-height:1.22; font-weight:600;">
          Unlock the full archive, trait trends, unlimited compatibility links, comparison history, and extra question packs.
        </div>
      </foreignObject>

      <rect x="116" y="670" width="1058" height="1540" rx="38" fill="url(#card)" stroke="#3a3c46" stroke-width="3"/>
      <text x="178" y="795" fill="#9af0cc" font-family="Arial, sans-serif" font-size="30" font-weight="900" letter-spacing="7">TELLINGLY PLUS</text>
      <text x="178" y="930" fill="#f6f0df" font-family="Georgia, serif" font-size="82" font-style="italic">Keep the pattern,</text>
      <text x="178" y="1028" fill="#f6f0df" font-family="Georgia, serif" font-size="82" font-style="italic">not just the moment.</text>

      ${feature(178, 1160, "Full answer archive")}
      ${feature(178, 1268, "Trait trends and deeper reads")}
      ${feature(178, 1376, "Unlimited compatibility links")}
      ${feature(178, 1484, "Comparison history")}
      ${feature(178, 1592, "Extra question packs")}

      ${planCard(178, 1735, "Annual", "$24.99/yr", "Best for the weekly card habit", annualSelected)}
      ${planCard(178, 1940, "Monthly", "$3.99/mo", "Easy to try", monthlySelected)}

      <rect x="178" y="2175" width="934" height="128" rx="26" fill="#ff6046"/>
      <text x="645" y="2255" text-anchor="middle" fill="#111116" font-family="Arial, sans-serif" font-size="46" font-weight="900">Continue</text>

      <text x="645" y="2382" text-anchor="middle" fill="#f6f0df" font-family="Arial, sans-serif" font-size="38" font-weight="800">Restore Purchases</text>
      <text x="645" y="2518" text-anchor="middle" fill="#8d887d" font-family="Arial, sans-serif" font-size="30" font-weight="700">Subscription managed by Apple. Cancel anytime.</text>

      <text x="116" y="2650" fill="#9af0cc" font-family="Arial, sans-serif" font-size="34" font-weight="900" letter-spacing="7">ANSWER TODAY'S QUESTION</text>
    </svg>
  `;
}

function feature(x, y, label) {
  return `
    <circle cx="${x + 20}" cy="${y - 11}" r="17" fill="#9af0cc"/>
    <path d="M${x + 11} ${y - 12}l7 8 15-20" fill="none" stroke="#111116" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="${x + 62}" y="${y}" fill="#f6f0df" font-family="Arial, sans-serif" font-size="40" font-weight="800">${escapeXml(label)}</text>
  `;
}

function planCard(x, y, label, price, subline, selected) {
  const fill = selected ? "#f6f0df" : "#171a21";
  const stroke = selected ? "#9ac9ff" : "#3a3c46";
  const main = selected ? "#111116" : "#f6f0df";
  const muted = selected ? "#4e514d" : "#a6a094";
  return `
    <rect x="${x}" y="${y}" width="934" height="155" rx="24" fill="${fill}" stroke="${stroke}" stroke-width="5"/>
    <text x="${x + 42}" y="${y + 60}" fill="${main}" font-family="Arial, sans-serif" font-size="38" font-weight="900">${escapeXml(label)}</text>
    <text x="${x + 892}" y="${y + 62}" text-anchor="end" fill="${main}" font-family="Arial, sans-serif" font-size="42" font-weight="900">${escapeXml(price)}</text>
    <text x="${x + 42}" y="${y + 113}" fill="${muted}" font-family="Arial, sans-serif" font-size="28" font-weight="800">${escapeXml(subline)}</text>
  `;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
