export interface LoginResponse {
    message: string;
    payload: {
        userID: string;
        userType: string;
        accessToken: string;
        refreshToken: string;
    };
}