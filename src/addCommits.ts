import { httpPatch } from "./httpUtils";
import * as repoConfig from "./repoConfig";
import config from "./appsettings.json";
import { DevOpsJiraMapping } from "./devOpsJiraMapping";
import { sleep } from "./utils";

export async function addCommits(mappings: DevOpsJiraMapping[]) {
  let start = 0,
    batch = 30,
    end = start + batch;
  while (start < mappings.length) {
    console.log(`Invoking addCommitsInBatch from ${start} to ${end}`);
    await addCommitsInBatch(mappings.slice(start, end));
    start = end + 1;
    end = end + batch;
    await sleep(1000);
  }
}

async function addCommitsInBatch(mappings: DevOpsJiraMapping[]) {
  let header = {
    "Content-Type": "application/json-patch+json",
    Authorization: repoConfig.devOpsHeader.Authorization,
  };
  const p1 = mappings.map(async (mapping) => {
    const addCommitsUrl = `${repoConfig.boardsWorkItemsUrl}/workitems/${mapping.id}${repoConfig.azureApiVersion}`;
    let body: any[] = [];
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
    await httpPatch(addCommitsUrl, header, body);
  });

  await Promise.all(p1);
}
