import * as path from "path";
import { IndexNode, LinkForPostType } from "../model/node.model";
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

  private buildTitleUiOfNode(node_: IndexNode) {
    console.log({
      title: node_.metadata?.title,
      path: node_.path,
      linkForPost: node_.metadata?.linkForPost,
    });

    if (node_.metadata?.linkForPost !== LinkForPostType.NONE) {
      return `
        <a class="link" href="${this.getHrefOfNode(node_)}">
          <h3 class="title">${node_.metadata?.title}</h3>
        </a>
      `;
    } else {
      return `<h3 class="title">${node_.metadata?.title}</h3>`;
    }
  }

  private buildSingleNode(node_: IndexNode, outerTagName: string = "div") {
    let childrenContent = ``;

    if (node_.children && 0 < node_.children.length) {
      childrenContent = this.buildChildren(node_.children);
    }

    return `
      <${outerTagName} class="entry">
        ${this.buildTitleUiOfNode(node_)}
        <span class="summary">${node_.metadata?.summary}</span>

        ${childrenContent}
      </${outerTagName}>
    `;
  }

  basicUI(
    customCss: string = `
        .children {
          padding-left: 20px;
        }`
  ) {
    return this.buildDetailUI({
      layout: {
        html: `
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <base href="${this.indexityOptions.baseHref}" target="_self">
        <title>${this.entryNode.metadata?.title}</title>
        <style class="indexity-style">
          ${customCss}
        </style>

        <div id="indexity--table-of-content">
          {{nodePlaceholderName}}
        </div>
        `,
        nodePlaceholderName: "{{nodePlaceholderName}}",
      },
      singleNodeBuilder: this.buildSingleNode.bind(this),
    });
  }

  buildDetailUI({
    layout,
    singleNodeBuilder = this.buildSingleNode.bind(this),
  }: {
    layout: {
      html: string;
      nodePlaceholderName: string;
    };
    singleNodeBuilder(node_: IndexNode, outerTagName: string): string;
  }) {
    return layout.html.replace(
      layout.nodePlaceholderName,
      singleNodeBuilder(this.entryNode, "div")
    );
  }
}
