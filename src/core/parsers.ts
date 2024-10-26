import * as fs from "fs";
import * as jsYaml from "js-yaml";
import * as path from "path";
import { IndexNode, NodeMetadata } from "../model/node.model";

function parseMetadata(rawData: unknown, path_: string) : NodeMetadata {
  const tags_ = (rawData["tags"] as string)?.split("\,|\;").map(s => s.trim()).filter(Boolean);
  const parsedPath = path.parse(path_);
  
  return {
    author: rawData["author"],
    bannerPath: rawData["bannerPath"],
    tags: tags_ || [],
    publishDate: rawData["publishDate"],
    summary: rawData["summary"] || "",
    title: rawData["title"] || parsedPath.name || parsedPath.dir
  }
}


export function parseYamlToIndexNode(path_: string) : IndexNode {
  const content_ = fs.readFileSync(path_, "utf8").toString();
  const rawData = jsYaml.load(content_);
  return {
    path: path_,
    metadata: parseMetadata(rawData, path_),
    rawData,
    children: []
  };
}