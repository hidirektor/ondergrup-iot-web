export interface Maintenance {
    id: number;
    machineID: string;
    technicianID: string;
    technicianName: string;
    maintenanceDate: number;
    kontrol11: string;
    kontrol12: string;
    kontrol13: string;
    kontrol14: string;
    kontrol21: string;
    kontrol22: string;
    kontrol23: string;
    kontrol24: string;
    kontrol31: string;
    kontrol32: string;
    kontrol33: string;
    kontrol34: string;
    kontrol35: string;
    kontrol36: string;
    kontrol41: string;
    kontrol42: string;
    kontrol43: string;
    kontrol44: string;
    kontrol45: string;
    kontrol46: string;
    kontrol51: string;
    kontrol52: string;
    kontrol53: string;
    kontrol54: string;
    kontrol55: string;
    kontrol56: string;
    kontrol61: string;
    kontrol62: string;
    kontrol63: string;
    kontrol71: string;
    kontrol72: string;
    kontrol81: string;
    kontrol82: string;
    kontrol83: string;
    kontrol91: string | null;
    kontrol92: string | null;
    kontrol93: string | null;
    kontrol94: string | null;
    kontrol95: string | null;
    kontrol96: string | null;
    kontrol97: string | null;
    kontrol98: string | null;
    kontrol99: string | null;
    kontrol910: string | null;
}

export interface MaintenanceResponse {
    message: string;
    payload: {
        maintenancesDetails: Maintenance[];
    };
}

export function getMaintenanceStatus(maintenanceCode: string): string {
    if(maintenanceCode === "1") {
        return "Tamam";
    } else if(maintenanceCode === "2") {
        return "Hayır";
    } else if(maintenanceCode === "3") {
        return "Düzeltme";
    } else if(maintenanceCode === "4") {
        return "Yok";
    } else {
        return "NaN";
    }
}