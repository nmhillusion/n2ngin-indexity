import { IndexityAdapter } from "./core/adapter";
import {
  parseWalkThroughDir
} from "./core/parsers";
import { IndexityOption } from "./model/indexity.option";

export class Indexity {
  private options: IndexityOption;

  public config(
    options: IndexityOption = {
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
