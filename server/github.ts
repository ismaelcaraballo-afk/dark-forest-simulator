import { Octokit } from '@octokit/rest';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

export async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

export async function createRepository(repoName: string, description: string, isPrivate: boolean = false) {
  const octokit = await getUncachableGitHubClient();
  
  try {
    const response = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      description: description,
      private: isPrivate,
      auto_init: true
    });
    
    return response.data;
  } catch (error: any) {
    if (error.status === 422) {
      throw new Error(`Repository '${repoName}' already exists in your GitHub account`);
    }
    throw error;
  }
}

export async function pushToRepository(owner: string, repo: string, files: Array<{path: string, content: string}>) {
  const octokit = await getUncachableGitHubClient();
  
  // Get the default branch
  const repoData = await octokit.repos.get({ owner, repo });
  const defaultBranch = repoData.data.default_branch;
  
  // Get the latest commit SHA
  const branchData = await octokit.repos.getBranch({ owner, repo, branch: defaultBranch });
  const latestCommitSha = branchData.data.commit.sha;
  
  // Create a tree with all files
  const tree = files.map(file => ({
    path: file.path,
    mode: '100644' as const,
    type: 'blob' as const,
    content: file.content
  }));
  
  const treeResponse = await octokit.git.createTree({
    owner,
    repo,
    tree,
    base_tree: latestCommitSha
  });
  
  // Create a commit
  const commitResponse = await octokit.git.createCommit({
    owner,
    repo,
    message: 'Add Dark Forest Simulator from Replit',
    tree: treeResponse.data.sha,
    parents: [latestCommitSha]
  });
  
  // Update the branch reference
  await octokit.git.updateRef({
    owner,
    repo,
    ref: `heads/${defaultBranch}`,
    sha: commitResponse.data.sha
  });
  
  return commitResponse.data;
}