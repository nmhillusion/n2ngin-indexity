import { IndexNode } from "../model/node.model";
import { BaseIndexityAdapter } from "./base.adapter";

export class ListIndexityAdapter extends BaseIndexityAdapter {
  constructor(entryNode: IndexNode) {
    super(entryNode);
  }

  private getRecursiveOfNode(startNode: IndexNode) {
    let result_ : IndexNode[] = [startNode];

    for (const child of startNode.children) {
      result_ = result_.concat(
        this.getRecursiveOfNode(child)
      );
    }

    return result_;
  }

  getAll(): IndexNode[] {
    return this.getRecursiveOfNode(this.entryNode);
  }
}