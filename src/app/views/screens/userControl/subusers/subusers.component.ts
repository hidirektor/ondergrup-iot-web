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

interface IUserPreferences {
  id: number;
  userID: string;
  language: boolean;
  nightMode: boolean;
}

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
  preferences: IUserPreferences;
}

@Component({
  templateUrl: 'subusers.component.html',
  styleUrls: ['subusers.component.scss'],
  standalone: true,
  imports: [
    HttpClientModule,
    WidgetsDropdownComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    RowComponent,
    ColComponent,
    ButtonDirective,
    IconDirective,
    ReactiveFormsModule,
    ButtonGroupComponent,
    FormCheckLabelDirective,
    ChartjsComponent,
    NgStyle,
    CardFooterComponent,
    GutterDirective,
    ProgressBarDirective,
    ProgressComponent,
    WidgetsBrandComponent,
    CardHeaderComponent,
    TableDirective,
    AvatarComponent,
    NgForOf,
    DatePipe,
    NgIf,
    AlertComponent
  ],
  providers: [
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCoreInterceptor,
      multi: true
    }
  ]
})
export class SubusersComponent implements OnInit {

  public alertMessage: string | null = null;
  public alertColor: string = 'warning';
  public alertVisible: boolean = false;

  public users: IUser[] = [];

  constructor(
      private apiService: ApiService,
      private sanitizer: DomSanitizer,
      private router: Router,
      private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
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

    try {
      const response = await firstValueFrom(this.apiService.getAllSubUsers(token));
      let subUserDetails = response.payload.subUserDetails;

      // Önce users dizisini temizleyin
      this.users = [];

      for (const detail of subUserDetails) {
        for (const subuser of detail.subUserData) {
          // Kullanıcı tercihlerini subUserPreferencesData'dan eşleştir
          const preferences = detail.subUserPreferencesData.find((p: IUserPreferences) => p.userID === subuser.userID);
          if (preferences) {
            subuser.preferences = preferences;
          }

          try {
            const photo = await firstValueFrom(this.apiService.getProfilePhoto(subuser.userName));

            if (photo && photo.size > 0) {
              if (subuser.avatar) {
                URL.revokeObjectURL(subuser.avatar);
              }
              const objectURL = URL.createObjectURL(photo);
              subuser.avatar = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            } else {
              subuser.avatar = '../../../../assets/onderlift_icon.png';
            }
          } catch {
            subuser.avatar = '../../../../assets/onderlift_icon.png';
          }
        }
        this.users.push(...detail.subUserData);
      }

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