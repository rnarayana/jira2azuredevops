export interface DevOpsJiraMapping {
    id: number;
    jiraId: string;
    regression: boolean;
    finishDate: string;
    commitIds: string[];
}
