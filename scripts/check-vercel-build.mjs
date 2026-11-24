import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const output = resolve(".vercel/output");
const config = JSON.parse(await readFile(resolve(output, "config.json"), "utf8"));
assert.equal(config.version, 3, "Vercel Build Output API v3 is required");
assert(config.routes.some((route) => route.handle === "filesystem"));
assert(config.routes.some((route) => route.dest === "/__server"));

const functionDir = resolve(output, "functions/__server.func");
const runtime = JSON.parse(await readFile(resolve(functionDir, ".vc-config.json"), "utf8"));
assert.equal(runtime.runtime, "nodejs24.x");
await access(resolve(functionDir, runtime.handler));
const { default: server } = await import(pathToFileURL(resolve(functionDir, runtime.handler)).href);
const response = await server.fetch(new Request("http://localhost/"));
assert.equal(response.status, 200, "Built SSR function must render the homepage");
const html = await response.text();
assert.match(html.replace(/<[^>]*>/g, ""), /Ashley Knows How to Furnish a Home/);
assert.match(html, /<main/);
assert.doesNotMatch(html, /__l5e|__lovable|lovable\.(dev|app)/);

const assets = new Set(
  [...html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)/g)].map((match) => match[1]),
);
assert(assets.size > 2, "SSR must reference the compiled local assets");
for (const asset of assets) await access(resolve(output, "static", `.${asset}`));
const missing = await server.fetch(new Request("http://localhost/missing-page"));
assert.equal(missing.status, 404, "Unknown routes must preserve the 404 response");
assert.match(await missing.text(), /Page not found/);
console.log(
  `Vercel output verified: Node 24 SSR (200), 404 routing, ${assets.size} local static assets.`,
);

const screenshots = JSON.parse(
  await readFile(resolve("docs/search-screenshot-hashes.json"), "utf8"),
);
assert.equal(screenshots.length, 8);
for (const screenshot of screenshots) {
  const file = resolve(output, "static", screenshot.path.replace(/^public\//, ""));
  const bytes = await readFile(file);
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    screenshot.sha256,
    screenshot.path,
  );
}
console.log("All eight original search screenshots are packaged with matching SHA-256 hashes.");

for (const file of ["west-marine-v2.png", "pacsun-v3.png", "ann-taylor.png"]) {
  await access(resolve(output, "static", "images", "customers", file));
}

for (const file of [
  "altari-room.webp",
  "altari-loveseat.webp",
  "darcy-sofa.webp",
  "mahoney-sofa.webp",
]) {
  await access(resolve(output, "static", "images", "ashley", file));
}
