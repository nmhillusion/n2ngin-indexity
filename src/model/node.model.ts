export interface NodeMetadata {
  title: string;
  bannerPath: string;
  publishDate: string;
  summary: string;
  tags: string[];
  author: string;
  linkForPost?: LinkForPostType | string;
}

export interface IndexNode {
  path: string;
  metadata: NodeMetadata;
  rawData: unknown;
  children: IndexNode[];
}

export enum LinkForPostType {
  NONE = null,
  INDEX = "index.html",
}
