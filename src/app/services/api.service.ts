import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, Observable, of} from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import {ProfileResponse} from "../models/profile-response.model";
import {LoginResponse} from "../models/login-response.model";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://ondergrup.hidirektor.com.tr:3000/api/v2';

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
    return this.http.post<ProfileResponse>(`${this.apiUrl}/user/getProfile`, { userID }, { headers });
  }

  updatePreferences(token: string, userID: string, preferencesData: any): Observable<any> {
    const headers = this.getAuthHeaders(token);
    return this.http.post(`${this.apiUrl}/user/updatePreferences`, { userID, preferencesData }, { headers });
  }

  updateProfile(token: string, userID: string, userData: any): Observable<any> {
    const headers = this.getAuthHeaders(token);
    return this.http.post(`${this.apiUrl}/user/updateProfile`, { userID, userData }, { headers });
  }

  uploadProfilePhoto(userName: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('userName', userName);
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

  getAllMachines(token: string): Observable<any> {
    const headers = this.getAuthHeaders(token);
    return this.http.get(`${this.apiUrl}/authorized/getAllMachines`, { headers });
  }
}