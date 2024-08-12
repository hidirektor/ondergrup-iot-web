export interface HydraulicInfoResult {
    id: number;
    userID: string;
    userName: string;
    orderID: string;
    partListID: string;
    schematicID: string;
    hydraulicType: string;
    createdDate: number;
}

export interface HydraulicDetailsResponse {
    message: string;
    payload: {
        hydraulicInfoResult: HydraulicInfoResult[];
    };
}