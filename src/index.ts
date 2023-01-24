import * as core from "@actions/core";
import { GitHubPullRequest } from "./github.pull.request";

async function run() {
  try {
    const githubPullRequest = new GitHubPullRequest();
    githubPullRequest.validate();
    githubPullRequest.assignUser();
  } catch (error) {
    const err = error as Error;
    core.setFailed(err.message);
  }
}

run();
