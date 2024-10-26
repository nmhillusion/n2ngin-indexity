import { Indexity } from "../src/indexity";
import * as path from "path";

test("build", async () => {
  const index_ = new Indexity();

  const result_ = await index_
    .config(path.join(__dirname, "resource"))
    .build();

  console.log("indexity: ", result_);
  expect(result_).not.toBeNull();
  expect(result_).toHaveProperty("metadata");
  expect(result_).toHaveProperty("operator");

  const searchCodeResult = result_.operator.search("code");
  const listResult = result_.operator.listAll();

  console.log({ searchCodeResult });
  console.log({
    listResult
  });

  console.log(JSON.stringify(result_));
  
});
