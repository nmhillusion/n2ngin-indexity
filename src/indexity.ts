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
    let currentNode: IndexNode = null;
    let children: IndexNode[] = [];

    if (!fs.lstatSync(startPoint).isDirectory()) {
      throw Error("Entry point must be a directory");
    }

    const childrenResult = fs
      .readdirSync(startPoint)
      .map((it) => path.join(startPoint, it));

    for (const itemPath_ of childrenResult) {
      if (fs.lstatSync(itemPath_).isDirectory()) {
        children.push(this.walkThroughDir(itemPath_));
      } else if (path.basename(itemPath_).match(/\.ya?ml$/i)) {
        currentNode = parseYamlToIndexNode(itemPath_);
      }
    }

    if (!currentNode) {
      currentNode = {
        path: startPoint,
        children: [],
        metadata: null,
        rawData: null
      }
    }

    currentNode.children = children;

    return currentNode;
  }

  public async build() {
    const metadata_ = this.walkThroughDir(this.srcDir);

    return {
      metadata: metadata_,
      operator: new IndexityAdapter(metadata_),
    };
  }
}
