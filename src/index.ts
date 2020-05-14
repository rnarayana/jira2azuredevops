// 5. For any commits, verify that the commit exists in Repos, and is not yet linked, and add the link.
// 6. For custom fields, update DevOps if the value in Boards is different.

import { httpPatch } from "./httpUtils";
import * as repoConfig from "./repoConfig";
import { getCommits } from "./getCommits";
import { getAllWorkItemsInBoards } from "./getWorkItems";
import { getJiraIdForWorkItems } from "./getJira";
import { getAllFieldsInDevOps } from "./getAllFieldsInDevOps";

(async () => {
  console.log("> JIRA -> Azure DevOps Migration for CommitIDs");
  await migrate();
  console.log("Done.");
})();

async function migrate() {
  console.log("\n> 1. Get the custom field referenceName for that are needed.");
  const jiraIdFieldName = await getAllFieldsInDevOps();
  console.log(`Jira ID reference name = ${jiraIdFieldName}`);

  console.log("\n> 2. Get all work item ids from DevOps");
  const devOpsJiraMapping = await getAllWorkItemsInBoards();
  console.log(devOpsJiraMapping);

  console.log("\n> 3. Get JIRA ID for each of the WorkItems");
  await getJiraIdForWorkItems(devOpsJiraMapping, jiraIdFieldName);
  console.log(devOpsJiraMapping);

  console.log("\n> 4. For each work item, query Jira for any linked commits");
  await getCommits(devOpsJiraMapping);
  console.log(devOpsJiraMapping);
}
