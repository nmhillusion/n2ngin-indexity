import { buildPublishPackageJson } from "@nmhillusion/n2mix/helper/package.helper";
import * as path from "path";

buildPublishPackageJson({
  basePublishDir: path.join(__dirname, "../dist"),
  packageJsonPath: path.join(__dirname, "../package.json"),
});
