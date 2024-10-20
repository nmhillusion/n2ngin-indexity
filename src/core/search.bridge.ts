import { BaseIndexityBridge } from "./adapter";

export class SearchIndexityBridge extends BaseIndexityBridge {
  constructor(metadata: any) {
    super(metadata);
  }

  search(keyword: string) {
    return [];
  }
}