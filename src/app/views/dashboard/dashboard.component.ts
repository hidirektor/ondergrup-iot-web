import {DatePipe, NgForOf, NgStyle} from '@angular/common';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {
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

import {WidgetsBrandComponent} from '../widgets/widgets-brand/widgets-brand.component';
import {WidgetsDropdownComponent} from '../widgets/widgets-dropdown/widgets-dropdown.component';
import {ApiService} from "../../services/api.service";
import {DomSanitizer} from "@angular/platform-browser";
import {firstValueFrom} from "rxjs";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HttpCoreInterceptor} from "../../http-core.interceptor";
import {Router} from "@angular/router";
import {ActionLog} from "../../models/actionlog-response.model";

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

interface IMachine {
  id: number;
  machineID: string;
  ownerID: string | null;
  machineType: string;
  createdAt: number;
  lastUpdate: number | null;
  ownerName: string;
  machineData: any[];
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [HttpClientModule, WidgetsDropdownComponent, TextColorDirective, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, IconDirective, ReactiveFormsModule, ButtonGroupComponent, FormCheckLabelDirective, ChartjsComponent, NgStyle, CardFooterComponent, GutterDirective, ProgressBarDirective, ProgressComponent, WidgetsBrandComponent, CardHeaderComponent, TableDirective, AvatarComponent, NgForOf, DatePipe],
  providers: [
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCoreInterceptor,
      multi: true
    }
  ]
})
export class DashboardComponent implements OnInit {

  public users: IUser[] = [];
  public machines: IMachine[] = [];
  public actionLogs: ActionLog[] = [];
  public totalUsers: number = 0;
  public engineerCount: number = 0;
  public technicianCount: number = 0;
  public totalMachines: number = 0;
  public totalKlasikCount: number = 0;
  public totalPowerPackCount: number = 0;

  constructor(private apiService: ApiService, private sanitizer: DomSanitizer, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.loadUsers();
    this.loadMachines();
    this.loadActionLogs();
    this.loadHydraulicStats();
  }

  async checkAuthentication(): Promise<void> {
    const token = this.apiService.getToken();
    if (!token) {
      this.router.navigate(['/login']); // Eğer token yoksa login sayfasına yönlendir
    }
  }

  async loadUsers(): Promise<void> {
    const token = this.apiService.getToken();

    try {
      const response = await firstValueFrom(this.apiService.getAllUsers(token));
      const users = response.payload.users;

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

      this.users = users;
      this.totalUsers = this.users.length;
      this.engineerCount = this.users.filter(user => user.userType === 'ENGINEER').length;
      this.technicianCount = this.users.filter(user => user.userType === 'TECHNICIAN').length;

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }

  async loadMachines(): Promise<void> {
    const token = this.apiService.getToken();

    try {
      const response = await firstValueFrom(this.apiService.getAllMachines(token));
      this.machines = response.payload.machines;
      this.totalMachines = this.machines.length;
    } catch (error) {
      console.error('Error loading machines:', error);
    }
  }

  async loadActionLogs(): Promise<void> {
    const token = this.apiService.getToken();

    try {
      const response = await firstValueFrom(this.apiService.getAllActions(token));
      this.actionLogs = response.payload.logs;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading action logs:', error);
    }
  }

  async loadHydraulicStats(): Promise<void> {
    try {
      const response = await firstValueFrom(this.apiService.getHydraulicStats());
      const stats = response.payload.statistics;
      this.totalKlasikCount = stats.Klasik;
      this.totalPowerPackCount = stats.Hidros; // Hidros burada PowerPack olarak kabul edildi
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading hydraulic stats:', error);
    }
  }
}
