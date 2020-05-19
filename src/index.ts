import { getCommits } from "./getCommits";
import { getAllWorkItemsInBoards } from "./getWorkItems";
import { getJiraIdForWorkItems } from "./getJira";
import { getAllFieldsInDevOps } from "./getAllFieldsInDevOps";
import { updateWorkItems } from "./updateWorkItem";
import { sleep, Logger } from "./utils";

(async () => {
  Logger.start("Jira2DevOps");
  Logger.info("> JIRA -> Azure DevOps Migration for CommitIDs");
  await migrate();
  Logger.info("Done.");
})();

async function migrate() {
  Logger.info("1. Getting the custom field referenceName for that are needed.");
  const jiraIdFieldName = await getAllFieldsInDevOps();
  Logger.info(`Jira ID reference name = ${jiraIdFieldName}`);

  Logger.info("2. Get all work item ids from DevOps");
  let start = 0,
    batch = 50,
    end = start + batch;
  let entireSet = await getAllWorkItemsInBoards();
  Logger.info(`Total work items = ${entireSet.length}`);

  do {
    Logger.info(
      `~~~~~~~~~~~~~~~~~~~~~ Processing [${start},${end})~~~~~~~~~~~~~~~~~~~~~`
    );
    let devOpsJiraMapping = entireSet.slice(start, end);

    Logger.debug(" > Get JIRA ID for each of the WorkItems");
    await getJiraIdForWorkItems(devOpsJiraMapping, jiraIdFieldName);

    const noJiraId = devOpsJiraMapping
      .filter((x) => !x.jiraId)
      .map((y) => y.id.toString())
      .join(",");
    if (noJiraId) {
      Logger.warn(`Work Items without JIRA ID : ${noJiraId}`);
    }

    Logger.debug(" > Get linked commits from JIRA");
    await getCommits(devOpsJiraMapping);
    const wiWithCommits = devOpsJiraMapping.filter(
      (x) => x.commitIds.length > 0
    );
    Logger.info(
      `${wiWithCommits.length}/${batch} work items have associated commits.`
    );

    Logger.debug(" > Update Work Items with commits and other fields.");
    await updateWorkItems(devOpsJiraMapping);

    start = end;
    end = end + batch;
    await sleep(10_000);
  } while (start <= entireSet.length);
}
