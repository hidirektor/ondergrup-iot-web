import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {
  AlertComponent,
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  ColComponent,
  RowComponent,
  TableDirective
} from '@coreui/angular';
import {ApiService} from "../../../services/api.service";
import {firstValueFrom} from "rxjs";
import {HttpClientModule} from "@angular/common/http";
import {Router} from "@angular/router";

interface IMaintenance {
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
  showDetails?: boolean;
}

@Component({
  templateUrl: 'maintenances.component.html',
  styleUrls: ['maintenances.component.scss'],
  standalone: true,
  imports: [HttpClientModule, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, ReactiveFormsModule, CardFooterComponent, TableDirective, NgForOf, DatePipe, NgIf, AlertComponent],
  providers: [ApiService]
})
export class MaintenancesComponent implements OnInit {

  public alertMessage: string | null = null;
  public alertColor: string = 'warning';
  public alertVisible: boolean = false;

  public maintenances: IMaintenance[] = [];
  public totalMaintenances: number = 0;

  constructor(private apiService: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadMaintenances();
  }

  async loadMaintenances(): Promise<void> {
    try {
      const token = this.apiService.getToken();
      const response = await firstValueFrom(this.apiService.getMaintenancesAll(token));

      this.maintenances = response.payload.maintenancesDetails.map(maintenance => ({
        ...maintenance,
        showDetails: false
      }));
      this.totalMaintenances = this.maintenances.length;

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading maintenances:', error);
      this.showAlert('Bakım kayıtları yüklenirken bir hata oluştu.', 'danger');
    }
  }

  toggleDetails(maintenance: IMaintenance): void {
    maintenance.showDetails = !maintenance.showDetails;
    this.cdr.detectChanges();
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