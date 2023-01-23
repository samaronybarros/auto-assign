import * as core from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { GitHub } from "@actions/github/lib/utils";

class GitHubPullRequest {
  private octokit: InstanceType<typeof GitHub>;
  private target: {
    [key: string]: any;
    number: number;
    html_url?: string;
    body?: string;
  };

  constructor(token: string) {
    this.octokit = getOctokit(token);

    const pullRequest = context.payload.pull_request;
    const issue = context.payload.issue;
    const target = pullRequest || issue;
    if (target === undefined) {
      throw new Error("It's not possible to assign the user");
    }
    this.target = target;
  }

  async validate() {
    const {
      assignees,
      user: { type },
    } = this.target;

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
    const {
      number,
      user: { login: author },
    } = this.target;

    const result = await this.octokit.rest.issues.addAssignees({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: number,
      assignees: [author],
    });

    core.debug(JSON.stringify(result));
    core.info(`@${author} has been assigned to the pull request: #${number}`);
  }
}

async function run() {
  try {
    const token = core.getInput("repo-token", { required: true });
    const githubPullRequest = new GitHubPullRequest(token);
    githubPullRequest.validate();
    githubPullRequest.assignUser();
  } catch (error) {
    const err = error as Error;
    core.setFailed(err.message);
  }
}

run();
