import * as fs from "fs";

if (!fs.existsSync("database")) {
  fs.writeFileSync("database", "");
}

export function getStoredIds() {
  return fs.readFileSync("database").toString().split("\n");
}

export function writeIds(ids: string[]) {
  return fs.writeFileSync("database", ids.join("\n"));
}
