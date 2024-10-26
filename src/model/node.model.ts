export interface NodeMetadata {
  title: string;
  bannerPath: string;
  publishDate: string;
  summary: string;
  tags: string[];
  author: string;
}

export interface IndexNode {
  path: string;
  metadata: NodeMetadata;
  rawData: unknown;
}
