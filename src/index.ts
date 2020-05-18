import { getCommits } from "./getCommits";
import { getAllWorkItemsInBoards } from "./getWorkItems";
import { getJiraIdForWorkItems } from "./getJira";
import { getAllFieldsInDevOps } from "./getAllFieldsInDevOps";
import { addCommits } from "./addCommits";
import { sleep, logger } from "./utils";
import { DevOpsJiraMapping } from "./devOpsJiraMapping";

(async () => {
  logger.info("> JIRA -> Azure DevOps Migration for CommitIDs");
  await migrate();
  logger.info("Done.");
})();

async function migrate() {
  logger.info("1. Getting the custom field referenceName for that are needed.");
  const jiraIdFieldName = await getAllFieldsInDevOps();
  logger.debug(`Jira ID reference name = ${jiraIdFieldName}`);

  logger.info("2. Get all work item ids from DevOps");
  let start = 0,
    batch = 100,
    end = start + batch;
  let entireSet = await getAllWorkItemsInBoards();
  const noJiraId = entireSet
    .filter((x) => !x.jiraId)
    .map((y) => y.id.toString())
    .join(",");
  if (noJiraId) {
    logger.warn(`Work Items without JIRA ID : ${noJiraId}`);
  }
  logger.info(`Total work items = ${entireSet.length}`);

  do {
    logger.info(
      `~~~~~~~~~~~~~~~~~~~~~ Processing [${start},${end})~~~~~~~~~~~~~~~~~~~~~`
    );
    let devOpsJiraMapping = entireSet.slice(start, end);
    
    logger.debug(" > Get JIRA ID for each of the WorkItems");
    await getJiraIdForWorkItems(devOpsJiraMapping, jiraIdFieldName);

    logger.debug(" > Get linked commits from JIRA");
    await getCommits(devOpsJiraMapping);
    const wiWithCommits = devOpsJiraMapping.filter(
      (x) => x.commitIds.length > 0
    );
    logger.info(
      `${wiWithCommits.length}/${batch} work items have associated commits.`
    );

    logger.debug(" > Add the commit to Work Items.");
    //await addCommits(devOpsJiraMapping);

    start = end;
    end = end + batch;
    await sleep(1000);
  } while (start <= entireSet.length);
}
