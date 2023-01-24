export declare class GitHubPullRequest {
    private octokit;
    private target;
    constructor();
    validate(): Promise<void>;
    assignUser(): Promise<void>;
}
