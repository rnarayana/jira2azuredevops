import { httpGet } from "./httpUtils";
import * as repoConfig from "./repoConfig";

export async function getAllFieldsInDevOps(): Promise<string> {
  const getFieldsUrl = `${repoConfig.boardsWorkItemsUrl}/fields${repoConfig.azureApiVersion}`;
  const fieldsResponse = await httpGet(getFieldsUrl, repoConfig.devOpsHeader);
  const jiraIdFieldName = fieldsResponse.value.filter(
    (f: any) => f.name === "Jira ID"
  )[0].referenceName;
  return jiraIdFieldName;
}
