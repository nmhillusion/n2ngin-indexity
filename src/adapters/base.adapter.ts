import { IndexityOption } from "../model/indexity.option";
import { IndexNode } from "../model/node.model";

export class BaseIndexityAdapter {
  constructor(
    protected entryNode: IndexNode,
    protected indexityOptions: IndexityOption
  ) {}

  toString() {
    console.log({ metadata: this.entryNode });
  }
}
