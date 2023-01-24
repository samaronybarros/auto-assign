"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@actions/core");
const github_pull_request_1 = require("./github.pull.request");
async function run() {
    try {
        const githubPullRequest = new github_pull_request_1.GitHubPullRequest();
        githubPullRequest.validate();
        githubPullRequest.assignUser();
    }
    catch (error) {
        const err = error;
        core.setFailed(err.message);
    }
}
run();
//# sourceMappingURL=index.js.map