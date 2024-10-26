import * as fs from "fs";
import * as path from "path";
import { IndexityAdapter } from "./core/adapter";
import { IndexNode } from "./model/node.model";
import { parseYamlToIndexNode } from "./core/parsers";

export class Indexity {
  private srcDir: string;

  constructor() {}

  public config(srcDir: string): Indexity {
    this.srcDir = srcDir;

    return this;
  }

  private walkThroughDir(startPoint: string) {
    let data: IndexNode[] = [];

    if (String(startPoint).match(/.ya?ml$/i)) {
      data.push(parseYamlToIndexNode(startPoint));
    } else if (fs.lstatSync(startPoint).isDirectory()) {
      const childrenResult = fs
        .readdirSync(startPoint)
        .map((it) => path.join(startPoint, it))
        .map((it) => this.walkThroughDir(it))
        .reduce((prev, curr) => {
          return prev.concat(curr);
        }, []);

      data = childrenResult;
    }

    return data;
  }

  public async build() {
    const metadata_ = this.walkThroughDir(this.srcDir);

    return {
      metadata: metadata_,
      operator: new IndexityAdapter(metadata_),
    };
  }
}
