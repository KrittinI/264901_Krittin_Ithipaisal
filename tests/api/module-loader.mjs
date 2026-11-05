import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    if (
      !["ERR_MODULE_NOT_FOUND", "ERR_UNSUPPORTED_DIR_IMPORT"].includes(error.code) ||
      !specifier.startsWith(".")
    ) {
      throw error;
    }

    const parentPath = fileURLToPath(context.parentURL);
    const basePath = path.resolve(path.dirname(parentPath), specifier);
    for (const candidate of [`${basePath}.js`, path.join(basePath, "index.js")]) {
      try {
        await access(candidate);
        return { url: pathToFileURL(candidate).href, shortCircuit: true };
      } catch {
        // Try the next extensionless resolution candidate.
      }
    }

    throw error;
  }
}

export async function load(url, context, nextLoad) {
  if (!url.startsWith("file:")) return nextLoad(url, context);

  const filePath = fileURLToPath(url);
  const workspacePath = process.cwd() + path.sep;

  if (
    filePath.startsWith(workspacePath) &&
    !filePath.includes(`${path.sep}node_modules${path.sep}`) &&
    filePath.endsWith(".js")
  ) {
    const loaded = await nextLoad(url, { ...context, format: "module" });
    return { ...loaded, format: "module", shortCircuit: true };
  }

  return nextLoad(url, context);
}
