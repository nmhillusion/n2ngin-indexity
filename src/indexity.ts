import * as fs from "fs";
import * as path from "path";
import { IndexityAdapter } from "./core/adapter";
import { IndexNode } from "./model/node.model";
import { METADATA_REGEXP_PATTERN, parseYamlToIndexNode } from "./core/parsers";

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
      } else if (path.basename(itemPath_).match(METADATA_REGEXP_PATTERN)) {
        currentNode = parseYamlToIndexNode(itemPath_);
      }
    }

    if (!currentNode) {
      const parsedPath = path.parse(startPoint);

      currentNode = {
        path: startPoint,
        children: null,
        metadata: {
          author: "",
          bannerPath: "",
          publishDate: "",
          summary: "",
          tags: [],
          title: parsedPath.name || parsedPath.dir,
        },
        rawData: null,
      };
    }

    currentNode.children = children;

    return currentNode;
  }

  public async build() {
    const metadata_ = this.walkThroughDir(this.options.srcDir);

    return {
      metadata: metadata_,
      operator: new IndexityAdapter(metadata_, this.options),
    };
  }
}
