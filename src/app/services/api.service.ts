import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, Observable, of, throwError} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';
import {ProfileResponse} from "../models/profile-response.model";
import {LoginResponse} from "../models/login-response.model";
import {map} from "rxjs/operators";
import {GetAllActionsResponse} from "../models/actionlog-response.model";
import {HydraulicDetailsResponse} from "../models/hydraulic-response.model";
import {getMaintenanceStatus, MaintenanceResponse} from "../models/maintenance-response.model";
import {GetAllMachinesResponse} from "../models/machines-response.model";
import {GetAllVersionsResponse} from "../models/versions-response.model";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'https://ondergrup.hidirektor.com.tr/api/v2';

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  private getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  login(body: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, body);
  }

  changePassword(token: string, body: any): Observable<any> {
    const headers = this.getAuthHeaders(token);
    return this.http.post(`${this.apiUrl}/auth/changePass`, body, { headers });
  }

  logout(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, body);
  }

  register(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, body);
  }

  resetPassword(body: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/resetPass`, body);
  }

  getPreferences(token: string, userID: string): Observable<any> {
    const headers = this.getAuthHeaders(token);
    return this.http.post(`${this.apiUrl}/user/getPreferences`, { userID }, { headers });
  }

  getProfile(token: string, userID: string): Observable<ProfileResponse> {
    const headers = this.getAuthHeaders(token);
    return this.http.post<ProfileResponse>(`${this.apiUrl}/user/getProfile`, { userID }, { headers })
        .pipe(
            map((response: any) => {
              if (response && response.payload) {
                const user = response.payload.user;
                const userPreferences = response.payload.userPreferences;

                this.cookieService.set('userID', user.userID);
                this.cookieService.set('userName', user.userName);
                this.cookieService.set('userType', user.userType);
                this.cookieService.set('nameSurname', user.nameSurname);
                this.cookieService.set('eMail', user.eMail);
                this.cookieService.set('phoneNumber', user.phoneNumber);
                this.cookieService.set('companyName', user.companyName);
                this.cookieService.set('createdAt', user.createdAt.toString());
                this.cookieService.set('language', userPreferences.language.toString());
                this.cookieService.set('nightMode', userPreferences.nightMode.toString());
              }
              return response;
            }),
            catchError(this.handleError)
        );;
  }

  updatePreferences(token: string, userID: string, preferencesData: any): Observable<any> {
    const headers = this.getAuthHeaders(token);
    return this.http.post(`${this.apiUrl}/user/updatePreferences`, { userID, preferencesData }, { headers });
  }

  updateProfile(token: string, body: any): Observable<any> {
    const headers = this.getAuthHeaders(token);
    return this.http.post(`${this.apiUrl}/user/updateProfile`, body, { headers });
  }

  uploadProfilePhoto(token: string, userName: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('userName', userName);
    formData.append('accessToken', token);
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/user/uploadProfilePhoto`, formData);
  }

  downloadProfilePhoto(userName: string): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/user/downloadProfilePhoto`, { userName }, { responseType: 'blob' });
  }

  getProfilePhoto(userName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/user/getProfilePhoto/${userName}`, { responseType: 'blob' })
        .pipe(
            catchError(error => {
              return of(new Blob());
            })
        );
  }

  checkUser(userName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/checkUser`, { userName });
  }

  saveToken(token: string) {
    this.cookieService.set('authToken', token, 1, '/');
  }

  getToken(): string {
    return this.cookieService.get('authToken');
  }

  clearToken() {
    this.cookieService.delete('authToken', '/');
  }

  setCookie(name: string, value: string, days: number = 1) {
    this.cookieService.set(name, value, days, '/');
  }

  getCookie(name: string): string {
    return this.cookieService.get(name);
  }

  deleteCookie(name: string) {
    this.cookieService.delete(name, '/');
  }

  getAllUsers(token: string): Observable<any> {
    const headers = this.getAuthHeaders(token);
    return this.http.get(`${this.apiUrl}/authorized/getAllUsers`, { headers });
  }

  getAllSubUsers(token: string): Observable<any> {
    const headers = this.getAuthHeaders(token);
    return this.http.get(`${this.apiUrl}/authorized/getAllSubUsers`, { headers });
  }

  deleteUser(token: string, body: any): Observable<any> {
    const headers = this.getAuthHeaders(token);
    return this.http.post(`${this.apiUrl}/authorized/deleteUser`, body, { headers })
        .pipe(
            catchError(this.handleError)
        );
  }

  deactivateUser(token: string, body: any): Observable<any> {
    const headers = this.getAuthHeaders(token);
    return this.http.post(`${this.apiUrl}/authorized/deActivateUser`, body, { headers })
        .pipe(
            catchError(this.handleError)
        );
  }

  activateUser(token: string, body: any): Observable<any> {
    const headers = this.getAuthHeaders(token);
    return this.http.post(`${this.apiUrl}/authorized/activateUser`, body, { headers })
        .pipe(
            catchError(this.handleError)
        );
  }

  getAllActions(token: string): Observable<GetAllActionsResponse> {
    const headers = this.getAuthHeaders(token);
    return this.http.get<GetAllActionsResponse>(`${this.apiUrl}/authorized/getAllActions`, { headers })
        .pipe(
            catchError(this.handleError)
        );
  }

  getHydraulicStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/hydraulic/getHydraulicStats`).pipe(
        catchError(this.handleError)
    );
  }

  addUser(token: string, body: any): Observable<any> {
    const headers = this.getAuthHeaders(token);
    return this.http.post(`${this.apiUrl}/authorized/addUser`, body, { headers });
  }

  updateUser(token: string, body: any): Observable<any> {
    const headers = this.getAuthHeaders(token);
    return this.http.post(`${this.apiUrl}/authorized/updateUser`, body, { headers })
        .pipe(
            catchError(this.handleError)
        );
  }

  sendAlertMail(token: string, body: any): Observable<any> {
    const headers = this.getAuthHeaders(token);
    return this.http.post(`${this.apiUrl}/authorized/sendAlertMail`, body, { headers })
        .pipe(
            catchError(this.handleError)
        );
  }

  getAllHydraulicUnits(unitType: string = ''): Observable<HydraulicDetailsResponse> {
    const body = { UnitType: unitType };
    return this.http.post<HydraulicDetailsResponse>(`${this.apiUrl}/hydraulic/getHydraulicDetails`, body)
        .pipe(
            catchError(this.handleError)
        );
  }

  getPartList(orderID: string): void {
    const url = `${this.apiUrl}/hydraulic/getPartList/${orderID}`;
    window.open(url, '_blank');
  }

  getSchematic(orderID: string): void {
    const url = `${this.apiUrl}/hydraulic/getSchematic/${orderID}`;
    window.open(url, '_blank');
  }

  getMaintenancesAll(token: string): Observable<MaintenanceResponse> {
    const headers = this.getAuthHeaders(token);
    return this.http.get<MaintenanceResponse>(`${this.apiUrl}/authorized/getAllMaintenances`, { headers })
        .pipe(
            map(response => {
              response.payload.maintenancesDetails = response.payload.maintenancesDetails.map(maintenance => {
                maintenance.kontrol11 = getMaintenanceStatus(maintenance.kontrol11.toString());
                maintenance.kontrol12 = getMaintenanceStatus(maintenance.kontrol12.toString());
                maintenance.kontrol13 = getMaintenanceStatus(maintenance.kontrol13.toString());
                maintenance.kontrol14 = getMaintenanceStatus(maintenance.kontrol14.toString());
                maintenance.kontrol21 = getMaintenanceStatus(maintenance.kontrol21.toString());
                maintenance.kontrol22 = getMaintenanceStatus(maintenance.kontrol22.toString());
                maintenance.kontrol23 = getMaintenanceStatus(maintenance.kontrol23.toString());
                maintenance.kontrol24 = getMaintenanceStatus(maintenance.kontrol24.toString());
                maintenance.kontrol31 = getMaintenanceStatus(maintenance.kontrol31.toString());
                maintenance.kontrol32 = getMaintenanceStatus(maintenance.kontrol32.toString());
                maintenance.kontrol33 = getMaintenanceStatus(maintenance.kontrol33.toString());
                maintenance.kontrol34 = getMaintenanceStatus(maintenance.kontrol34.toString());
                maintenance.kontrol35 = getMaintenanceStatus(maintenance.kontrol35.toString());
                maintenance.kontrol36 = getMaintenanceStatus(maintenance.kontrol36.toString());
                maintenance.kontrol41 = getMaintenanceStatus(maintenance.kontrol41.toString());
                maintenance.kontrol42 = getMaintenanceStatus(maintenance.kontrol42.toString());
                maintenance.kontrol43 = getMaintenanceStatus(maintenance.kontrol43.toString());
                maintenance.kontrol44 = getMaintenanceStatus(maintenance.kontrol44.toString());
                maintenance.kontrol45 = getMaintenanceStatus(maintenance.kontrol45.toString());
                maintenance.kontrol46 = getMaintenanceStatus(maintenance.kontrol46.toString());
                maintenance.kontrol51 = getMaintenanceStatus(maintenance.kontrol51.toString());
                maintenance.kontrol52 = getMaintenanceStatus(maintenance.kontrol52.toString());
                maintenance.kontrol53 = getMaintenanceStatus(maintenance.kontrol53.toString());
                maintenance.kontrol54 = getMaintenanceStatus(maintenance.kontrol54.toString());
                maintenance.kontrol55 = getMaintenanceStatus(maintenance.kontrol55.toString());
                maintenance.kontrol56 = getMaintenanceStatus(maintenance.kontrol56.toString());
                maintenance.kontrol61 = getMaintenanceStatus(maintenance.kontrol61.toString());
                maintenance.kontrol62 = getMaintenanceStatus(maintenance.kontrol62.toString());
                maintenance.kontrol63 = getMaintenanceStatus(maintenance.kontrol63.toString());
                maintenance.kontrol71 = getMaintenanceStatus(maintenance.kontrol71.toString());
                maintenance.kontrol72 = getMaintenanceStatus(maintenance.kontrol72.toString());
                maintenance.kontrol81 = getMaintenanceStatus(maintenance.kontrol81.toString());
                maintenance.kontrol82 = getMaintenanceStatus(maintenance.kontrol82.toString());
                maintenance.kontrol83 = getMaintenanceStatus(maintenance.kontrol83.toString());
                return maintenance;
              });
              return response;
            }),
            catchError(this.handleError)
        );
  }

  getAllMachines(token: string): Observable<GetAllMachinesResponse> {
    const headers = this.getAuthHeaders(token);
    return this.http.get<GetAllMachinesResponse>(`${this.apiUrl}/authorized/getAllMachines`, { headers })
        .pipe(
            catchError(this.handleError)
        );
  }

  getAllVersions(token: string): Observable<GetAllVersionsResponse> {
    const headers = this.getAuthHeaders(token);
    return this.http.get<GetAllVersionsResponse>(`${this.apiUrl}/authorized/getAllVersions`, { headers })
        .pipe(
            catchError(this.handleError)
        );
  }

  downloadSelectedVersion(versionCode: string): Observable<Blob> {
    const body = { versionCode };
    return this.http.post(`${this.apiUrl}/updateChecker/downloadNewVersion`, body, { responseType: 'blob' })
        .pipe(
            catchError(this.handleError)
        );
  }

  createVersion(token: string, versionCode: string, versionTitle: string, versionDesc: string, file: File): Observable<any> {
    const userID = this.getCookie('userID');
    console.log(userID);

    const allowedExtensions = ['hex', 'bin'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!allowedExtensions.includes(fileExtension || '')) {
      return throwError(() => new Error('Sadece .hex ve .bin dosyalarına izin verilmektedir.'));
    }

    const formData = new FormData();
    formData.append("operationPlatform", "Admin Panel");
    formData.append("sourceUserID", userID);
    formData.append('versionCode', versionCode);
    formData.append('versionTitle', versionTitle);
    formData.append('versionDesc', versionDesc);
    formData.append('accessToken', token);
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/updateChecker/createVersion`, formData)
        .pipe(
            catchError(this.handleError)
        );
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
      console.log(errorMessage);
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      console.log(errorMessage);
    }
    return throwError(() => new Error(errorMessage));
  }
}