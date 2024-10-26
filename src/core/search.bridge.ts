import { BaseIndexityBridge } from "./base.bridge";

export class SearchIndexityBridge extends BaseIndexityBridge {
  constructor(metadata: any) {
    super(metadata);
  }

  search(keyword: string) {
    return [];
  }
}