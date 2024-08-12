export interface Machine {
    id: number;
    machineID: string;
    ownerID: string | null;
    machineType: string;
    createdAt: number;
    lastUpdate: number | null;
    ownerName: string;
    machineData: any[];
}

export interface GetAllMachinesResponse {
    message: string;
    payload: {
        machines: Machine[];
    };
}