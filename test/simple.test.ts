import { Indexity } from "../src/indexity";
import * as path from "path";
import * as fs from "fs";

function writeToFile(path_: string, content: string) {
  const outPath = path_;
  if (!fs.existsSync(outPath)) {
    fs.mkdirSync(path.dirname(outPath), {
      recursive: true,
    });
  }
  fs.writeFileSync(outPath, content);
}

test("build", async () => {
  const index_ = new Indexity();

  const result_ = await index_.config(path.join(__dirname, "resource")).build();

  console.log("indexity: ", result_);
  expect(result_).not.toBeNull();
  expect(result_).toHaveProperty("metadata");
  expect(result_).toHaveProperty("operator");

  const searchCodeResult = result_.operator.search("code");
  const listResult = result_.operator.listAll();
  const basicUIHtml = result_.operator.html.basicUI();

  console.log({ searchCodeResult });
  console.log({
    listResult,
  });

  writeToFile(path.join(__dirname, "output", "sitemap.html"), basicUIHtml);

  console.log(JSON.stringify(result_));
});
