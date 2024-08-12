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
import {DomSanitizer} from "@angular/platform-browser";
import {firstValueFrom} from "rxjs";
import {HttpClientModule} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";

interface IMachine {
  id: number;
  machineID: string;
  ownerID: string | null;
  machineType: string;
  createdAt: number;
  lastUpdate: number | null;
  ownerName: string;
}

@Component({
  templateUrl: 'ownedmachines.component.html',
  styleUrls: ['ownedmachines.component.scss'],
  standalone: true,
  imports: [HttpClientModule, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, ReactiveFormsModule, CardFooterComponent, TableDirective, NgForOf, DatePipe, NgIf, AlertComponent],
  providers: [ApiService]
})
export class OwnedmachinesComponent implements OnInit {

  public alertMessage: string | null = null;
  public alertColor: string = 'warning';
  public alertVisible: boolean = false;

  public machines: IMachine[] = [];
  public totalMachines: number = 0;

  private allMachines: IMachine[] = [];

  constructor(private apiService: ApiService, private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadMachines();
  }

  async loadMachines(): Promise<void> {
    try {
      const token = this.apiService.getToken();
      const response = await firstValueFrom(this.apiService.getAllMachines(token));

      this.allMachines = response.payload.machines;

      this.route.paramMap.subscribe(params => {
        const ownerNameParam = params.get('ownerName');
        if (ownerNameParam) {
          this.filterMachinesByOwner(ownerNameParam);
        }
      });

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading machines:', error);
      this.showAlert('Makineler yüklenirken hata oluştu.', 'danger');
    }
  }

  filterMachinesByOwner(ownerName: string): void {
    this.machines = this.allMachines.filter(m => m.ownerName === ownerName);
    this.totalMachines = this.machines.length;
    this.cdr.detectChanges();
  }

  navigateToMachines(): void {
    this.router.navigate(['/machines']);
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