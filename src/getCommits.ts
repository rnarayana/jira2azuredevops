import { httpGet } from "./httpUtils";
import * as repoConfig from "./repoConfig";
import { DevOpsJiraMapping } from "./devOpsJiraMapping";

export async function getCommits(mappings: DevOpsJiraMapping[]) {
  const promises = mappings.map(async (x) => await getCommitForOneJiraIssue(x));
  await Promise.all(promises);
}

async function getCommitForOneJiraIssue(devopsJiraMapping: DevOpsJiraMapping) {
  if (!devopsJiraMapping.jiraId) {
    return;
  }

  const jiraIssueUrl = `${repoConfig.jiraIssueUrl}/${devopsJiraMapping.jiraId}`;
  const jiraIssue = await httpGet(jiraIssueUrl, repoConfig.jiraHeader);
  if (!jiraIssue) {
    return;
  }

  const jiraCommitUrl = `${repoConfig.jiraCommitUrl}${jiraIssue.id}`;
  const jiraCommits = await httpGet(jiraCommitUrl, repoConfig.jiraHeader);
  if (jiraCommits.detail[0]?.repositories.length) {
    let repoCommits = jiraCommits.detail[0].repositories[0].commits;
    if (repoCommits.length) {
      devopsJiraMapping.commitIds = repoCommits.map((c: any) => c.id);
    }
  }
}
