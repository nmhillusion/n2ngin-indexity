import * as path from "path";
import { IndexNode } from "../model/node.model";
import { BaseIndexityAdapter } from "./base.adapter";
import { METADATA_REGEXP_PATTERN } from "../core/parsers";

export class HtmlIndexityAdapter extends BaseIndexityAdapter {
  private buildChildren(children_: IndexNode[]) {
    const itemHtmls = [];

    for (const childItem of children_) {
      itemHtmls.push(this.buildSingleNode(childItem));
    }

    const combinedItemsHtml = itemHtmls
      .map((it) => `<div class="child">${it}</div>`)
      .join("");

    return `
      <div class="children">
        ${combinedItemsHtml}
      </div>
    `;
  }

  private getHrefOfNode(node_: IndexNode) {
    return path
      .relative(this.indexityOptions.relativeTo, node_.path)
      .replace(METADATA_REGEXP_PATTERN, "");
  }

  private buildSingleNode(node_: IndexNode, outerTagName: string = "div") {
    let childrenContent = ``;

    if (node_.children && 0 < node_.children.length) {
      childrenContent = this.buildChildren(node_.children);
    }

    return `
      <${outerTagName} class="entry">
        <a class="link" href="${this.getHrefOfNode(node_)}">
          <h3 class="title">${node_.metadata?.title}</h3>
        </a>
        <span class="summary">${node_.metadata?.summary}</span>

        ${childrenContent}
      </${outerTagName}>
    `;
  }

  basicUI(
    customStyle: string = `
        .children {
          padding-left: 20px;
        }`
  ) {
    return `
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <base href="${this.indexityOptions.baseHref}" target="_self">
    <style class="indexity-style">
      ${customStyle}
    </style>
    
    ${this.buildSingleNode(this.entryNode, "div")}
    `;
  }
}
