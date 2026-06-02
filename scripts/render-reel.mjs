import { dirname, resolve } from "node:path";
import { spawn } from "node:child_process";
import ffmpegPath from "ffmpeg-static";
import ffprobeStatic from "ffprobe-static";

const pathSeparator = process.platform === "win32" ? ";" : ":";
const env = {
  ...process.env,
  PATH: [
    dirname(ffmpegPath),
    dirname(ffprobeStatic.path),
    process.env.PATH || ""
  ].join(pathSeparator)
};

const child = spawn(resolve("node_modules/.bin/hyperframes"), [
  "render",
  "marketing/reels/tellingly-daily-ritual",
  "--output",
  "marketing/reels/tellingly-daily-ritual/renders/tellingly-reel.mp4",
  "--quality",
  "standard",
  "--workers",
  "2"
], { stdio: "inherit", env });

child.on("exit", (code) => process.exit(code ?? 1));
