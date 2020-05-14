import config from "./appsettings.json";

const azureBbaseUrl = `https://dev.azure.com/${config.devops.orgName}/${config.devops.projectName}`;

export const azureApiVersion = "?api-version=5.1";
export const boardsWorkItemsUrl = `${azureBbaseUrl}/_apis/wit`;
export const reposUrl = `${azureBbaseUrl}/_apis/git/repositories/${config.devops.projectName}`;
const devOpsAuthInfo = `${config.devops.userName}:${config.devops.pat}`;
export const devOpsHeader = {
  Authorization: `Basic ${Buffer.from(devOpsAuthInfo).toString("base64")}`,
};

const jiraAuthInfo = `${config.jira.username}:${config.jira.password}`;
export const jiraHeader = {
  Authorization: `Basic ${Buffer.from(jiraAuthInfo).toString("base64")}`,
};
export const jiraIssueUrl = `${config.jira.url}/rest/api/latest/issue`;
export const jiraCommitUrl = `${config.jira.url}/rest/dev-status/1.0/issue/detail?applicationType=stash&dataType=repository&issueId=`;
