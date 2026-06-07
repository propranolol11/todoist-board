import { access } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve as resolvePath } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const obsidianStub = pathToFileURL(resolvePath(root, "tests/obsidian-stub.mjs")).href;

async function exists(url) {
  try {
    await access(fileURLToPath(url));
    return true;
  } catch {
    return false;
  }
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "obsidian") {
    return { shortCircuit: true, url: obsidianStub };
  }

  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    const isRelative = specifier.startsWith("./") || specifier.startsWith("../");
    const hasExtension = /\.[cm]?[jt]s$/.test(specifier);
    if (!isRelative || hasExtension || !context.parentURL) throw error;

    const candidate = new URL(`${specifier}.ts`, context.parentURL).href;
    if (await exists(candidate)) {
      return { shortCircuit: true, url: candidate };
    }
    throw error;
  }
}
