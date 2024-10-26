import { IndexNode } from "../model/node.model";
import { BaseIndexityAdapter } from "./base.adapter";

export class HtmlIndexityAdapter extends BaseIndexityAdapter {
  private buildSingleNode(node_: IndexNode, outerTagName: string = "div") {
    let childrenContent = ``;

    if (node_.children && 0 < node_.children.length) {
      const itemHtmls = [];

      for (const childItem of node_.children) {
        itemHtmls.push(this.buildSingleNode(childItem));
      }

      const combinedItemsHtml = itemHtmls
        .map((it) => `<div class="child">${it}</div>`)
        .join("");

      childrenContent = `
        <div class="children">
          ${combinedItemsHtml}
        </div>
      `;
    }

    return `
      <${outerTagName} class="entry">
        <a href="${node_.path}">
          <h3>${node_.metadata?.title}</h3>
        </a>
        <span>${node_.metadata?.summary}</span>

        ${childrenContent}
      </${outerTagName}>
    `;
  }

  basicUI() {
    return this.buildSingleNode(this.entryNode, "div");
  }
}
