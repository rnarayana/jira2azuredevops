import { httpGet } from "./httpUtils";
import * as repoConfig from "./repoConfig";
import { DevOpsJiraMapping } from "./devOpsJiraMapping";
import { sleep, logger } from "./utils";

export async function getJiraIdForWorkItems(
  mappings: DevOpsJiraMapping[],
  jiraIdFieldName: string
) {
  let start = 0,
    batch = 30,
    end = start + batch;
  while (start < mappings.length) {
    logger.info(`Invoking getJiraIdInBatch from ${start} to ${end}`);
    await getJiraIdInBatch(mappings.slice(start, end), jiraIdFieldName);
    start = end + 1;
    end = end + batch;
    await sleep(1000);
  }
}

async function getJiraIdInBatch(
  mappings: DevOpsJiraMapping[],
  jiraIdFieldName: string
) {
  const jiraMappingPromises = mappings.map(async (mapping) => {
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
