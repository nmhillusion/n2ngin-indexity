import { IndexNode } from "../model/node.model";
import { BaseIndexityAdapter } from "./base.adapter";

export class SearchIndexityAdapter extends BaseIndexityAdapter {
  constructor(entryNode: IndexNode) {
    super(entryNode);
  }

  search(keyword: string) {
    return [];
  }
}