import { httpGet } from "./httpUtils";
import * as repoConfig from "./repoConfig";
import { DevOpsJiraMapping } from "./devOpsJiraMapping";

export async function getJiraIdForWorkItems(
  mappings: DevOpsJiraMapping[],
  jiraIdFieldName: string
) {
  const jiraMappingPromises = mappings.map(async (mapping) => {
    const getWorkItemUrl = `${repoConfig.boardsWorkItemsUrl}/workitems/${mapping.id}${repoConfig.azureApiVersion}`;

    const workItemResponse = await httpGet(
      getWorkItemUrl,
      repoConfig.devOpsHeader
    );
    mapping.jiraId = workItemResponse.fields[jiraIdFieldName];
  });
  await Promise.all(jiraMappingPromises);
}
