import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./tests/ts-loader.mjs", pathToFileURL("./"));
