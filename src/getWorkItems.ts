import { httpPost } from "./httpUtils";
import * as repoConfig from "./repoConfig";
import { DevOpsJiraMapping } from "./devOpsJiraMapping";

export async function getAllWorkItemsInBoards(): Promise<DevOpsJiraMapping[]> {
  const getAllWorkItemsUrl = `${repoConfig.boardsWorkItemsUrl}/wiql${repoConfig.azureApiVersion}`;
  const workItemsResponse = await httpPost(
    getAllWorkItemsUrl,
    repoConfig.devOpsHeader,
    {
      query: `Select [System.Id] From WorkItems ORDER BY [System.CreatedDate] desc`,
    }
  );
  return workItemsResponse.workItems.map((wi: any) => {
    return {
      id: wi.id,
      jiraId: "",
      commitIds: [],
    };
  }).slice(0, 300);
}
