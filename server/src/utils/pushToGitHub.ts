import simpleGit from "simple-git";
import { Octokit } from "@octokit/rest";

interface PushOptions {
  projectName: string;
  slug: string;
  repo: string; // GitHub / GitLab / Azure / Bitbucket etc..
  projectLocation: string; // Local path to the project
}

const GITHUB_USERNAME = "OwaisAD";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_USERNAME || !GITHUB_TOKEN) {
  throw new Error("GitHub credentials are not set in the environment variables");
}

export async function pushToGitHub(options: PushOptions): Promise<string> {
  const { projectName, repo, projectLocation } = options;

  console.log("Selected repo:", repo);

  const repoName = `LP-${projectName.replace(/\s+/g, "")}`;

  const octokit = new Octokit({
    auth: GITHUB_TOKEN,
  });

  const { data } = await octokit.repos.createForAuthenticatedUser({
    name: repoName,
    private: true,
  });

  const repoUrl = `https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${repoName}.git`;

  const git = simpleGit({
    baseDir: projectLocation,
  });

  await git.init();
  git.checkoutLocalBranch("master");
  await git.add(".");
  await git.commit(`Initial commit for ${projectName} through Launchpad`);
  await git.addRemote("origin", repoUrl);
  await git.push("origin", "master");

  console.log("Pushed to GitHub:", repoUrl);
  return data.html_url;
}
