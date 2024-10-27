import { IndexityOptions } from "../indexity";
import { IndexNode } from "../model/node.model";

export class BaseIndexityAdapter {
  constructor(
    protected entryNode: IndexNode,
    protected indexityOptions: IndexityOptions
  ) {}

  toString() {
    console.log({ metadata: this.entryNode });
  }
}
