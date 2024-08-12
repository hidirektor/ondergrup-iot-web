export interface ActionLog {
    id: number;
    sourceUserID: string;
    sourceUserName: string;
    affectedUserID: string | null;
    affectedUserName: string | null;
    affectedMachineID: string | null;
    affectedMaintenanceID: string | null;
    affectedHydraulicUnitID: string | null;
    operationSection: string;
    operationType: string;
    operationName: string;
    operationTime: number;
}

export interface GetAllActionsResponse {
    message: string;
    payload: {
        logs: ActionLog[];
    };
}