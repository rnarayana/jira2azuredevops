import { httpGet } from "./httpUtils";
import * as repoConfig from "./repoConfig";
import { DevOpsJiraMapping } from "./devOpsJiraMapping";
import { sleep } from "./utils";

export async function getJiraIdForWorkItems(
  mappings: DevOpsJiraMapping[],
  jiraIdFieldName: string
) {
  let start = 0,
    batch = 30,
    end = start + batch;
  while (start < mappings.length) {
    await getJiraIdForBatch(mappings, jiraIdFieldName, start, end);
    start = end + 1;
    end = end + batch;
    await sleep(1000);
  }
}

async function getJiraIdForBatch(
  mappings: DevOpsJiraMapping[],
  jiraIdFieldName: string,
  start: number,
  end: number
) {
  console.log(`Invoking from ${start} to ${end}`);
  const jiraMappingPromises = mappings
    .slice(start, end)
    .map(async (mapping) => {
      const getWorkItemUrl = `${repoConfig.boardsWorkItemsUrl}/workitems/${mapping.id}?${repoConfig.azureApiVersion}`;
      // await Promise.resolve();
      const workItemResponse = await httpGet(
        getWorkItemUrl,
        repoConfig.devOpsHeader
      );
      mapping.jiraId = workItemResponse.fields[jiraIdFieldName];
    });
  await Promise.all(jiraMappingPromises);
}
