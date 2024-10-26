import { IndexNode } from "../model/node.model";

export class BaseIndexityAdapter {
  constructor(protected entryNode: IndexNode) {}

  toString() {
    console.log({ metadata: this.entryNode });
  }
}
