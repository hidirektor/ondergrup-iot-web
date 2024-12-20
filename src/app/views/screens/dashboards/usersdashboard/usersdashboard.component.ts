import {DatePipe, NgForOf, NgIf, NgStyle} from '@angular/common';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {
  AlertComponent,
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective
} from '@coreui/angular';
import {ChartjsComponent} from '@coreui/angular-chartjs';
import {IconDirective} from '@coreui/icons-angular';

import {WidgetsBrandComponent} from '../../../widgets/widgets-brand/widgets-brand.component';
import {WidgetsDropdownComponent} from '../../../widgets/widgets-dropdown/widgets-dropdown.component';
import {ApiService} from "../../../../services/api.service";
import {DomSanitizer} from "@angular/platform-browser";
import {firstValueFrom} from "rxjs";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HttpCoreInterceptor} from "../../../../http-core.interceptor";
import {Router} from "@angular/router";

interface IUser {
  userID: string;
  userName: string;
  userType: string;
  nameSurname: string;
  eMail: string;
  phoneNumber: string;
  companyName: string;
  isActive: boolean;
  createdAt: number;
  avatar: any;
  preferences: {
    id: number;
    userID: string;
    language: boolean;
    nightMode: boolean;
  };
}

@Component({
  templateUrl: 'usersdashboard.component.html',
  styleUrls: ['usersdashboard.component.scss'],
  standalone: true,
  imports: [HttpClientModule, WidgetsDropdownComponent, TextColorDirective, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, IconDirective, ReactiveFormsModule, ButtonGroupComponent, FormCheckLabelDirective, ChartjsComponent, NgStyle, CardFooterComponent, GutterDirective, ProgressBarDirective, ProgressComponent, WidgetsBrandComponent, CardHeaderComponent, TableDirective, AvatarComponent, NgForOf, DatePipe, NgIf, AlertComponent],
  providers: [
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCoreInterceptor,
      multi: true
    }
  ]
})
export class UsersdashboardComponent implements OnInit {

  public alertMessage: string | null = null;
  public alertColor: string = 'warning';
  public alertVisible: boolean = false;

  public users: IUser[] = [];
  public totalUsers: number = 0;
  public engineerCount: number = 0;
  public technicianCount: number = 0;

  public showEngineers: boolean | null = null;
  public showTechnicians: boolean | null = null;

  constructor(private apiService: ApiService, private sanitizer: DomSanitizer, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.checkAuthentication();

    const urlParams = new URLSearchParams(window.location.search);
    const engineersParam = urlParams.get('engineers');
    const techniciansParam = urlParams.get('technicians');

    this.showEngineers = engineersParam ? engineersParam === 'true' : null;
    this.showTechnicians = techniciansParam ? techniciansParam === 'true' : null;

    this.loadUsers();
  }

  async checkAuthentication(): Promise<void> {
    const token = this.apiService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
    }
  }

  async loadUsers(): Promise<void> {
    const token = this.apiService.getToken();
    const currentUserName = this.apiService.getCookie('userName');

    try {
      const response = await firstValueFrom(this.apiService.getAllUsers(token));
      let users = response.payload.users;

      if (this.showEngineers !== null) {
        users = users.filter((user: { userType: string; }) => user.userType === 'ENGINEER');
      }
      if (this.showTechnicians !== null) {
        users = users.filter((user: { userType: string; }) => user.userType === 'TECHNICIAN');
      }

      for (const user of users) {
        try {
          const photo = await firstValueFrom(this.apiService.getProfilePhoto(user.userName));

          if (photo && photo.size > 0) {
            if (user.avatar) {
              URL.revokeObjectURL(user.avatar);
            }
            const objectURL = URL.createObjectURL(photo);
            user.avatar = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          } else {
            user.avatar = '../../../../assets/onderlift_icon.png';
          }
        } catch {
          user.avatar = '../../../../assets/onderlift_icon.png';
        }
      }

      this.users = users.sort((a: IUser, b: IUser) => (a.userName === currentUserName ? -1 : b.userName === currentUserName ? 1 : 0));
      this.totalUsers = this.users.length;
      this.engineerCount = this.users.filter(user => user.userType === 'ENGINEER').length;
      this.technicianCount = this.users.filter(user => user.userType === 'TECHNICIAN').length;

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }

  async deleteUser(targetUserName: string): Promise<void> {
    const token = this.apiService.getToken();
    const userID = this.apiService.getCookie('userID');
    const currentUserName = this.apiService.getCookie('userName');

    if (targetUserName === currentUserName) {
      this.showAlert('Kendi kendinizi silemezsiniz.', 'warning');
      return;
    }

    const operationPlatform = "Admin Panel";
    const sourceUserID = userID;
    const affectedUserID = null;
    const affectedUserName = targetUserName;
    const affectedMachineID = null;
    const affectedMaintenanceID = null;
    const affectedHydraulicUnitID = null;

    try {
      await firstValueFrom(this.apiService.deleteUser(token, { operationPlatform, sourceUserID, affectedUserID, affectedUserName, affectedMachineID, affectedMaintenanceID, affectedHydraulicUnitID, userName: targetUserName }));

      await this.loadUsers();

      this.cdr.detectChanges();
      this.showAlert('Kullanıcı başarıyla silindi.', 'success');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  async deactivateUser(targetUserName: string): Promise<void> {
    const token = this.apiService.getToken();
    const userID = this.apiService.getCookie('userID');
    const currentUserName = this.apiService.getCookie('userName');

    if (targetUserName === currentUserName) {
      this.showAlert('Kendi kendinizi deaktif edemezsiniz.', 'warning');
      return;
    }

    const operationPlatform = "Admin Panel";
    const sourceUserID = userID;
    const affectedUserID = null;
    const affectedUserName = targetUserName;
    const affectedMachineID = null;
    const affectedMaintenanceID = null;
    const affectedHydraulicUnitID = null;

    try {
      await firstValueFrom(this.apiService.deactivateUser(token, {operationPlatform, sourceUserID, affectedUserID, affectedUserName, affectedMachineID, affectedMaintenanceID, affectedHydraulicUnitID, userName: targetUserName}));
      await this.loadUsers();

      this.showAlert('Kullanıcı başarıyla pasifleştirildi.', 'success');
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  }

  async activateUser(targetUserName: string): Promise<void> {
    const token = this.apiService.getToken();
    const userID = this.apiService.getCookie('userID');
    const currentUserName = this.apiService.getCookie('userName');

    if (targetUserName === currentUserName) {
      this.showAlert('Kendi kendinizi aktif edemezsiniz.', 'warning');
      return;
    }

    const operationPlatform = "Admin Panel";
    const sourceUserID = userID;
    const affectedUserID = null;
    const affectedUserName = targetUserName;
    const affectedMachineID = null;
    const affectedMaintenanceID = null;
    const affectedHydraulicUnitID = null;

    try {
      await firstValueFrom(this.apiService.activateUser(token, {operationPlatform, sourceUserID, affectedUserID, affectedUserName, affectedMachineID, affectedMaintenanceID, affectedHydraulicUnitID, userName: targetUserName}));
      await this.loadUsers();

      this.showAlert('Kullanıcı başarıyla aktifleştirildi.', 'success');
    } catch (error) {
      console.error('Error activating user:', error);
    }
  }

  editUser(userID: string): void {
    this.router.navigate(['/edit-profile', userID]);
  }

  viewUserMachines(userName: string): void {
    this.router.navigate(['/machines/', userName]);
  }

  viewUserMaintenanceRecords(userID: string): void {
    this.router.navigate(['/user-maintenance-records', userID]);
  }

  showAlert(message: string, color: string): void {
    this.alertMessage = message;
    this.alertColor = color;
    this.alertVisible = true;

    setTimeout(() => {
      this.alertVisible = false;
    }, 2000);
  }
}
