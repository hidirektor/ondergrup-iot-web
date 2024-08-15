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
import {Router} from "@angular/router";

interface IHydraulic {
  id: number;
  userID: string;
  userName: string;
  orderID: string;
  partListID: string;
  schematicID: string;
  hydraulicType: string;
  createdDate: number;
}

@Component({
  templateUrl: 'hydraulic.component.html',
  styleUrls: ['hydraulic.component.scss'],
  standalone: true,
  imports: [HttpClientModule, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, ReactiveFormsModule, CardFooterComponent, TableDirective, NgForOf, DatePipe, NgIf, AlertComponent],
  providers: [ApiService]
})
export class HydraulicComponent implements OnInit {

  public alertMessage: string | null = null;
  public alertColor: string = 'warning';
  public alertVisible: boolean = false;

  public hydraulics: IHydraulic[] = [];
  public totalHydraulics: number = 0;

  public showKlasik: boolean | null = null;
  public showModern: boolean | null = null;

  constructor(private apiService: ApiService, private sanitizer: DomSanitizer, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadHydraulics();
  }

  async loadHydraulics(): Promise<void> {
    try {
      const response = await firstValueFrom(this.apiService.getAllHydraulicUnits());

      let hydraulics = response.payload.hydraulicInfoResult;

      if (this.showKlasik !== null) {
        hydraulics = hydraulics.filter(h => h.hydraulicType === 'Klasik');
      }
      if (this.showModern !== null) {
        hydraulics = hydraulics.filter(h => h.hydraulicType === 'Modern');
      }

      this.hydraulics = hydraulics;
      this.totalHydraulics = this.hydraulics.length;

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading hydraulics:', error);
    }
  }

  viewPartList(orderID: string): void {
    this.apiService.getPartList(orderID);
  }

  viewSchematic(orderID: string): void {
    this.apiService.getSchematic(orderID);
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