export interface Version {
    id: number;
    versionTitle: string;
    versionDesc: string;
    versionCode: string;
    versionID: string;
    releaseDate: number;
}

export interface GetAllVersionsResponse {
    message: string;
    payload: {
        versions: Version[];
    };
}