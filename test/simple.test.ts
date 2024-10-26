import { Indexity } from "../src/indexity";
import * as path from "path";

test("build", async () => {
  const index_ = new Indexity();

  const outContent = await index_
    .config(path.join(__dirname, "resource"))
    .build();

  console.log({ outContent });
  expect(outContent).not.toBeNull();
  expect(outContent).toHaveProperty("metadata");
  expect(outContent).toHaveProperty("operator");

  const searchCodeResult = outContent.operator.search("code");

  console.log({ searchCodeResult });
});
