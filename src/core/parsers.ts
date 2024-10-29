import * as fs from "fs";
import * as jsYaml from "js-yaml";
import * as path from "path";
import { IndexNode, LinkForPostType, NodeMetadata } from "../model/node.model";

export const METADATA_REGEXP_PATTERN = /\bmeta(data)?\.ya?ml$/i;

function getTagsFromRawData(rawData: unknown): string[] {
  if ("object" == typeof rawData && rawData) {
    if ("tags" in rawData) {
      return (rawData["tags"] as string)
        ?.split(",|;")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function getLinkForPostFromRawData(rawData: unknown): LinkForPostType | string {
  let linkForPost: LinkForPostType | string = LinkForPostType.INDEX;

  if ("object" == typeof rawData && rawData) {
    if ("linkForPost" in rawData) {
      const rawLinkPostType = rawData["linkForPost"];
      // console.log({
      //   path_,
      //   rawLinkPostType,
      // });

      if (
        ["object", "string"].includes(typeof rawLinkPostType) &&
        !rawLinkPostType
      ) {
        linkForPost = LinkForPostType.NONE;
      }
    }
  }

  return linkForPost;
}

function getSummaryOfPost(
  rawData: unknown,
  linkForPost: LinkForPostType | string,
  path_: string
): string {
  if ("object" == typeof rawData && rawData) {
    if ("summary" in rawData) {
      return rawData["summary"] as string;
    }
  }

  if (linkForPost === LinkForPostType.INDEX) {
    const postPath = path.resolve(path.dirname(path_), linkForPost);

    if (fs.existsSync(postPath)) {
      return (
        fs
          .readFileSync(postPath, "utf8")
          .replace(/<.+?>/g, "")
          .slice(0, 300)
          .replace(/\s{2,}|\t/g, " ") + " ..."
      ).trim();
    }
  }

  return "";
}

function parseMetadata(rawData: unknown, path_: string): NodeMetadata {
  const parsedPath = path.parse(path_);
  const linkForPost = getLinkForPostFromRawData(rawData);
  return {
    author: rawData["author"],
    bannerPath: rawData["bannerPath"],
    tags: getTagsFromRawData(rawData),
    publishDate: rawData["publishDate"],
    summary: getSummaryOfPost(rawData, linkForPost, path_) || "",
    title: rawData["title"] || parsedPath.name || parsedPath.dir,
    linkForPost,
  } as NodeMetadata;
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
