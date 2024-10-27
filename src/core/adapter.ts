import { HtmlIndexityAdapter } from "../adapters/html.adapter";
import { ListIndexityAdapter } from "../adapters/list.adapter";
import { SearchIndexityAdapter } from "../adapters/search.adapter";
import { IndexityOptions } from "../indexity";
import { IndexNode } from "../model/node.model";

export class IndexityAdapter {
  #searchAdapter: SearchIndexityAdapter;
  #listAdapter: ListIndexityAdapter;
  #htmlAdapter: HtmlIndexityAdapter;

  constructor(entryNode: IndexNode, indexityOptions: IndexityOptions) {
    this.#searchAdapter = new SearchIndexityAdapter(entryNode, indexityOptions);
    this.#listAdapter = new ListIndexityAdapter(entryNode, indexityOptions);
    this.#htmlAdapter = new HtmlIndexityAdapter(entryNode, indexityOptions);
  }

  get search() {
    return this.#searchAdapter;
  }

  get list() {
    return this.#listAdapter;
  }

  get html() {
    return this.#htmlAdapter;
  }
}
