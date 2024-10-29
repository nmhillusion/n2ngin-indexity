import * as fs from "fs";
import * as jsYaml from "js-yaml";
import * as path from "path";
import { IndexNode, LinkForPostType, NodeMetadata } from "../model/node.model";

export const METADATA_REGEXP_PATTERN = /\bmeta(data)?\.ya?ml$/i;

function parseMetadata(rawData: unknown, path_: string): NodeMetadata {
  const tags_ = (rawData["tags"] as string)
    ?.split(",|;")
    .map((s) => s.trim())
    .filter(Boolean);
  const parsedPath = path.parse(path_);

  let linkForPost: LinkForPostType | string = LinkForPostType.INDEX;

  if ("object" == typeof rawData && rawData) {
    if ("linkForPost" in rawData) {
      const rawLinkType = rawData["linkForPost"];

      if ("object" == typeof rawLinkType && !rawLinkType) {
        linkForPost = LinkForPostType.NONE;
      }
    }
  }

  return {
    author: rawData["author"],
    bannerPath: rawData["bannerPath"],
    tags: tags_ || [],
    publishDate: rawData["publishDate"],
    summary: rawData["summary"] || "",
    title: rawData["title"] || parsedPath.name || parsedPath.dir,
    linkForPost,
  };
}

export function parseYamlToIndexNode(path_: string): IndexNode {
  const content_ = fs.readFileSync(path_, "utf8").toString();
  const rawData = jsYaml.load(content_);
  return {
    path: path_,
    metadata: parseMetadata(rawData, path_),
    rawData,
    children: [],
  };
}

export function parseWalkThroughDir(startPoint: string): IndexNode | null {
  let currentNode: IndexNode | null = null;
  let children: IndexNode[] = [];

  if (!fs.lstatSync(startPoint).isDirectory()) {
    throw Error("Entry point must be a directory");
  }

  const childrenResult = fs
    .readdirSync(startPoint)
    .map((it) => path.join(startPoint, it));

  for (const itemPath_ of childrenResult) {
    if (fs.lstatSync(itemPath_).isDirectory()) {
      const child_ = parseWalkThroughDir(itemPath_);

      if (child_) {
        children.push(child_);
      }
    } else if (path.basename(itemPath_).match(METADATA_REGEXP_PATTERN)) {
      currentNode = parseYamlToIndexNode(itemPath_);
    }
  }

  if (!currentNode && 0 < children.length) {
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
        linkForPost: null,
      },
      rawData: null,
    };
  }

  if (currentNode) {
    currentNode.children = children;
  }

  return currentNode;
}
