"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubPullRequest = void 0;
const core = require("@actions/core");
const github_1 = require("@actions/github");
class GitHubPullRequest {
    constructor() {
        const token = core.getInput("repo-token", { required: true });
        this.octokit = (0, github_1.getOctokit)(token);
        const pullRequest = github_1.context.payload.pull_request;
        const issue = github_1.context.payload.issue;
        const target = pullRequest || issue;
        if (target === undefined) {
            throw new Error("It's not possible to assign the user");
        }
        this.target = target;
    }
    async validate() {
        const { assignees, user: { type }, } = this.target;
        if (assignees.length > 0) {
            core.info("It's not possible to assign a PR already assigned");
            return;
        }
        if (type === "Bot") {
            core.info("It's not possible to assign a PR to a bot");
            return;
        }
    }
    async assignUser() {
        const { number, user: { login: author }, } = this.target;
        const result = await this.octokit.rest.issues.addAssignees({
            owner: github_1.context.repo.owner,
            repo: github_1.context.repo.repo,
            issue_number: number,
            assignees: [author],
        });
        core.debug(JSON.stringify(result));
        core.info(`@${author} has been assigned to the pull request: #${number}`);
    }
}
exports.GitHubPullRequest = GitHubPullRequest;
//# sourceMappingURL=github.pull.request.js.map