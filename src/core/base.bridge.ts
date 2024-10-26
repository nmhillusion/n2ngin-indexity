
export class BaseIndexityBridge {
  constructor(protected metadata: any) {}

  toString() {
    console.log({ metadata: this.metadata });
  }
}
