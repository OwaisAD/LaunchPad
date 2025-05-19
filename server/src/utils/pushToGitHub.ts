import simpleGit from "simple-git";
import { Octokit } from "@octokit/rest";
import sodium from "libsodium-wrappers";
import fs from "fs-extra";
import path from "path";

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

  // 1. Clean up .git if it already exists
  const gitFolderPath = path.join(projectLocation, ".git");
  if (await fs.pathExists(gitFolderPath)) {
    console.log("Cleaning up existing .git folder...");
    await fs.remove(gitFolderPath);
  }

  // 2. Create a new GitHub repository
  const { data } = await octokit.repos.createForAuthenticatedUser({
    name: repoName,
    private: true,
  });

  const repoUrl = `https://${GITHUB_TOKEN}@github.com/${GITHUB_USERNAME}/${repoName}.git`;

  const git = simpleGit({
    baseDir: projectLocation,
  });

  await git.init();
  await git.addConfig("user.name", "LaunchPad Bot");
  await git.addConfig("user.email", "launchpad@example.com");

  await git.checkoutLocalBranch("master");
  await git.add(".");
  await git.commit(`Initial commit for ${projectName} through Launchpad`);
  await git.addRemote("origin", repoUrl);
  await git.push("origin", "master");

  console.log("Pushed to GitHub:", repoUrl);

  //  remove the .git folder after pushing
  await fs.remove(gitFolderPath);

  // Add secret (LAUNCHPAD_DEPLOY_TOKEN) to repo
  const { data: publicKey } = await octokit.actions.getRepoPublicKey({
    owner: GITHUB_USERNAME,
    repo: repoName,
  });

  await sodium.ready;
  const binkey = sodium.from_base64(publicKey.key, sodium.base64_variants.ORIGINAL);
  const DEPLOY_TOKEN = process.env.LAUNCHPAD_DEPLOY_TOKEN;
  if (!DEPLOY_TOKEN) throw new Error("Missing LaunchPad deploy token");

  const encryptedBytes = sodium.crypto_box_seal(DEPLOY_TOKEN, binkey);
  const encrypted = sodium.to_base64(encryptedBytes, sodium.base64_variants.ORIGINAL);

  // 2. Set the encrypted token as a secret
  await octokit.actions.createOrUpdateRepoSecret({
    owner: GITHUB_USERNAME,
    repo: repoName,
    secret_name: "LAUNCHPAD_DEPLOY_TOKEN",
    encrypted_value: encrypted,
    key_id: publicKey.key_id,
  });

  return data.html_url;
}
