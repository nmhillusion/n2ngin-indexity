import * as fs from "fs";
import * as jsYaml from "js-yaml";

export class Indexity {
  private srcDir: string;

  constructor() {}

  public config(srcDir: string): Indexity {
    this.srcDir = srcDir;

    return this;
  }

  private loadYaml(path_: string) {
    const content_ = fs.readFileSync(path_, "utf8").toString();
    return jsYaml.load(content_);
  }

  public async build(): Promise<any> {
    return Promise.resolve(this.loadYaml(this.srcDir));
  }
}
