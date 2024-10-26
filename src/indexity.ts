import * as fs from "fs";
import * as jsYaml from "js-yaml";
import * as path from "path";
import { IndexityAdapter } from "./core/adapter";
import { IndexNode, NodeMetadata } from "./model/node.model";

export class Indexity {
  private srcDir: string;

  constructor() {}

  public config(srcDir: string): Indexity {
    this.srcDir = srcDir;

    return this;
  }

  private parseMetadata(rawData: unknown) : NodeMetadata {
    const tags_ = (rawData["tags"] as string)?.split("\,|\;").map(s => s.trim()).filter(Boolean);
    return {
      author: rawData["author"],
      bannerPath: rawData["bannerPath"],
      tags: tags_ || [],
      publishDate: rawData["publishDate"],
      summary: rawData["summary"],
      title: rawData["title"]
    }
  }

  private loadYaml(path_: string) : IndexNode {
    const content_ = fs.readFileSync(path_, "utf8").toString();
    const rawData = jsYaml.load(content_);
    return {
      path: path_,
      metadata: this.parseMetadata(rawData),
      rawData
    };
  }

  private walkThroughDir(startPoint: string) {
    let data: IndexNode[] = [];

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
