import * as fs from "fs";
import * as jsYaml from "js-yaml";
import * as path from "path";
import { IndexityAdapter } from "./core/adapter";

export class Indexity {
  private srcDir: string;

  constructor() {}

  public config(srcDir: string): Indexity {
    this.srcDir = srcDir;

    return this;
  }

  private loadYaml(path_: string) {
    const content_ = fs.readFileSync(path_, "utf8").toString();
    return {
      path: path_,
      metadata: jsYaml.load(content_)
    };
  }

  private walkThroughDir(startPoint: string) {
    let data: unknown[] = [];

    if (String(startPoint).match(/.ya?ml$/i)) {
      data.push(this.loadYaml(startPoint));
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
      operator: new IndexityAdapter(metadata_)
    }
  }
}
