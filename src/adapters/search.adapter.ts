import { IndexNode } from "../model/node.model";
import { BaseIndexityAdapter } from "./base.adapter";

export class SearchIndexityAdapter extends BaseIndexityAdapter {
  search(keyword: string) {
    return [];
  }
}
