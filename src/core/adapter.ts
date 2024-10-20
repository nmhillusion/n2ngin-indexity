import { SearchIndexityBridge } from "./search.bridge";

export class BaseIndexityBridge {
  constructor(protected metadata: any) {}

  toString() {
    console.log({ metadata: this.metadata });
  }
}

export class IndexityAdapter {
  #searchBridge: SearchIndexityBridge;

  constructor(metadata: any) {
    this.#searchBridge = new SearchIndexityBridge(metadata);
  }

  search(keyword: string) {
    return this.#searchBridge.search(keyword);
  }
}
