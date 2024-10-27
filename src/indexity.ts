import { IndexityAdapter } from "./core/adapter";
import {
  parseWalkThroughDir
} from "./core/parsers";

export interface IndexityOptions {
  srcDir?: string;
  relativeTo: string;
  baseHref?: string;
}

export class Indexity {
  private options: IndexityOptions;

  public config(
    options: IndexityOptions = {
      relativeTo: process.cwd(),
      baseHref: ".",
    }
  ): Indexity {
    this.options = options;
    return this;
  }

  public async build() {
    const metadata_ = parseWalkThroughDir(this.options.srcDir);

    return {
      metadata: metadata_,
      operator: new IndexityAdapter(metadata_, this.options),
    };
  }
}
