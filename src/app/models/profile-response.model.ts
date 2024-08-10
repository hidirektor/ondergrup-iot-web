export interface UserPreferences {
    id: number;
    userID: string;
    language: boolean;
    nightMode: boolean;
}

export interface UserProfile {
    id: number;
    userID: string;
    userName: string;
    userType: string;
    nameSurname: string;
    eMail: string;
    phoneNumber: string;
    companyName: string;
    password: string;
    isActive: boolean;
    createdAt: number;
}

export interface ProfileResponse {
    message: string;
    payload: {
        user: UserProfile;
        userPreferences: UserPreferences;
    };
}