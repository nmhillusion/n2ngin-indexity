import { Indexity } from "../src/indexity";
import * as path from "path";

test("build", async () => {
  const index_ = new Indexity();

  const outContent = await index_
    .config(path.join(__dirname, "resource/user.yml"))
    .build();

  console.log({ outContent });

  expect(outContent).not.toBeNull();
  expect(JSON.stringify(outContent)).not.toHaveLength(0);
});
