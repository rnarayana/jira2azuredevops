import { getCommits } from "./getCommits";
import { getAllWorkItemsInBoards } from "./getWorkItems";
import { getJiraIdForWorkItems } from "./getJira";
import { getAllFieldsInDevOps } from "./getAllFieldsInDevOps";
import { addCommits } from "./addCommits";

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
  const devOpsJiraMapping = await getAllWorkItemsInBoards(100);
  console.log(devOpsJiraMapping);

  console.log("\n> 3. Get JIRA ID for each of the WorkItems");
  await getJiraIdForWorkItems(devOpsJiraMapping, jiraIdFieldName);
  console.log("Work Items withour JIRA ID")
  devOpsJiraMapping.filter(x => !x.jiraId).forEach(y => {
    console.log(y.id)
  });

  console.log("\n> 4. For each work item, query Jira for any linked commits");
  await getCommits(devOpsJiraMapping);
  console.log(devOpsJiraMapping);

  console.log(
    "\n> 5. For each commit, verify that the commit exists in Repos, and is not yet linked, and add the link."
  );
  await addCommits(devOpsJiraMapping);
}
