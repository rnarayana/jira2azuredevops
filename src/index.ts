import { getCommits } from "./getCommits";
import { getAllWorkItemsInBoards } from "./getWorkItems";
import { getJiraIdForWorkItems } from "./getJira";
import { getAllFieldsInDevOps } from "./getAllFieldsInDevOps";
import { addCommits } from "./addCommits";
import { logger } from "./utils";

(async () => {
  logger.info("> JIRA -> Azure DevOps Migration for CommitIDs");
  await migrate();
  logger.info("Done.");
})();

async function migrate() {
  logger.info("1. Get the custom field referenceName for that are needed.");
  const jiraIdFieldName = await getAllFieldsInDevOps();
  logger.debug(`Jira ID reference name = ${jiraIdFieldName}`);

  logger.info("2. Get all work item ids from DevOps");
  const devOpsJiraMapping = await getAllWorkItemsInBoards(100);
  logger.debug(devOpsJiraMapping);

  logger.info("3. Get JIRA ID for each of the WorkItems");
  await getJiraIdForWorkItems(devOpsJiraMapping, jiraIdFieldName);
  logger.warn(
    `Work Items without JIRA ID : ${devOpsJiraMapping
      .filter((x) => !x.jiraId)
      .map((y) => y.id.toString())
      .join(",")}`
  );

  logger.info("4. For each work item, query Jira for any linked commits");
  await getCommits(devOpsJiraMapping);
  logger.debug(devOpsJiraMapping);

  logger.info(
    "5. For each commit, verify that the commit exists in Repos, and is not yet linked, and add the link."
  );
  await addCommits(devOpsJiraMapping);
}
