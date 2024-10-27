import { exec } from "child_process";
import { version } from "../package.json";

const command = `git tag v${version} && git push --tag`;

const process_ = exec(command);

process_.on("error", (err) => {
  console.error(err);
  process.exit(1);
});

process_.on("message", (message) => {
  console.log(message);
});

process_.on("exit", (exitCode) => {
  console.log("result of command: ", exitCode);
});
