import { HtmlIndexityAdapter } from "../adapters/html.adapter";
import { ListIndexityAdapter } from "../adapters/list.adapter";
import { SearchIndexityAdapter } from "../adapters/search.adapter";
import { IndexNode } from "../model/node.model";

export class IndexityAdapter {
  #searchAdapter: SearchIndexityAdapter;
  #listAdapter: ListIndexityAdapter;
  #htmlAdapter: HtmlIndexityAdapter;

  constructor(entryNode: IndexNode) {
    this.#searchAdapter = new SearchIndexityAdapter(entryNode);
    this.#listAdapter = new ListIndexityAdapter(entryNode);
    this.#htmlAdapter = new HtmlIndexityAdapter(entryNode);
  }

  search(keyword: string) {
    return this.#searchAdapter.search(keyword);
  }

  listAll() {
    return this.#listAdapter.getAll();
  }

  get html() {
    return this.#htmlAdapter;
  }
}
