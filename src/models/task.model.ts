export class Task {
    Date: Date | string;
    Notes: string;
    Tasks: EachTask[];
}
export class EachTask {
    Summary: string;
    Link: string;
    Status: string;
}