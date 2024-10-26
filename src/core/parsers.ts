import * as fs from "fs";
import * as jsYaml from "js-yaml";
import { IndexNode, NodeMetadata } from "../model/node.model";

function parseMetadata(rawData: unknown) : NodeMetadata {
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


export function parseYamlToIndexNode(path_: string) : IndexNode {
  const content_ = fs.readFileSync(path_, "utf8").toString();
  const rawData = jsYaml.load(content_);
  return {
    path: path_,
    metadata: parseMetadata(rawData),
    rawData,
    children: []
  };
}