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

interface IVersion {
  id: number;
  versionTitle: string;
  versionDesc: string;
  versionCode: string;
  versionID: string;
  releaseDate: number;
}

@Component({
  templateUrl: 'allversions.component.html',
  styleUrls: ['allversions.component.scss'],
  standalone: true,
  imports: [HttpClientModule, CardComponent, CardBodyComponent, RowComponent, ColComponent, ButtonDirective, ReactiveFormsModule, CardFooterComponent, TableDirective, NgForOf, DatePipe, NgIf, AlertComponent],
  providers: [ApiService]
})
export class AllVersionsComponent implements OnInit {

  public alertMessage: string | null = null;
  public alertColor: string = 'warning';
  public alertVisible: boolean = false;

  public versions: IVersion[] = [];
  public totalVersions: number = 0;

  constructor(private apiService: ApiService, private sanitizer: DomSanitizer, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadVersions();
  }

  async loadVersions(): Promise<void> {
    try {
      const token = this.apiService.getToken();
      const response = await firstValueFrom(this.apiService.getAllVersions(token));

      this.versions = response.payload.versions;
      this.totalVersions = this.versions.length;

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading versions:', error);
      this.showAlert('Versiyonlar yüklenirken hata oluştu.', 'danger');
    }
  }

  navigateToDashboard(): void {
    this.router.navigate(['/create-version']);
  }

  downloadVersion(versionCode: string): void {
    this.apiService.downloadSelectedVersion(versionCode).subscribe(
        (data: Blob) => {
          const downloadUrl = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `${versionCode}.hex`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        },
        (error) => {
          console.error('Error downloading version:', error);
          this.showAlert('Sürüm indirilemedi.', 'danger');
        }
    );
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