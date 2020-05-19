import { httpPatch, httpGet } from "./httpUtils";
import * as repoConfig from "./repoConfig";
import config from "./appsettings.json";
import { DevOpsJiraMapping } from "./devOpsJiraMapping";
import { Logger } from "./utils";

export async function updateWorkItems(mappings: DevOpsJiraMapping[]) {
  let header = {
    "Content-Type": "application/json-patch+json",
    Authorization: repoConfig.devOpsHeader.Authorization,
  };
  const p1 = mappings.map(async (mapping) => {
    const wiGetUrl = `${repoConfig.boardsWorkItemsUrl}/workitems/${mapping.id}?$expand=relations&${repoConfig.azureApiVersion}`;
    const wiPatchUrl = `${repoConfig.boardsWorkItemsUrl}/workitems/${mapping.id}${repoConfig.azureApiVersion}`;

    //Get work item:
    const workItemResponse = await httpGet(wiGetUrl, repoConfig.devOpsHeader);

    // Remove any existing linked commits
    let body: any[] = [];
    if (workItemResponse.relations) {
      body.push({
        op: "test",
        path: "/rev",
        value: workItemResponse.rev,
      });
      for (let i = 0; i < workItemResponse.relations.length; i++) {
        if (
          workItemResponse.relations[i].url.startsWith("vstfs:///Git/Commit/")
        ) {
          body.push({
            op: "remove",
            path: `/relations/${i}`,
          });
        }
      }

      if (body.length > 1) {
        Logger.info(`Removing existing commit from ${mapping.id}!`);
        Logger.debug(body);
        await httpPatch(wiPatchUrl, header, body);
      }
    }

    // Add commits
    body = [];
    let msg: string = "";
    if (mapping.regression) {
      msg += "regression";
      Logger.info(`Set Regression = true for ${mapping.id}`);
      body.push({
        op: "add",
        path: "/fields/Custom.Regression",
        value: true,
      });
    }

    if (mapping.finishDate) {
      msg += " finishdate";
      Logger.info(`Set FinishDate = ${mapping.finishDate} for ${mapping.id}`);
      body.push({
        op: "add",
        path: "/fields/Microsoft.VSTS.Scheduling.FinishDate",
        value: mapping.finishDate,
      });
    }

    if (mapping.commitIds) {
      msg += " commits";
      mapping.commitIds.forEach((commitId) => {
        const url = `vstfs:///Git/Commit/${config.devops.projectName}/${config.devops.repoName}/${commitId}`;
        body.push({
          op: "add",
          path: "/relations/-",
          value: {
            rel: "ArtifactLink",
            url: url,
            attributes: {
              name: "Fixed in Commit",
            },
          },
        });
      });
    }

    if (body.length > 0) {
      Logger.info(`Updating workitem ${mapping.id} with ${msg}!`);
      Logger.debug(body);
      await httpPatch(wiPatchUrl, header, body);
    }
  });

  await Promise.all(p1);
}
