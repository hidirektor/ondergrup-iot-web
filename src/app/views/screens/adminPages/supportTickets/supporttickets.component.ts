import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {firstValueFrom} from 'rxjs';
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HttpCoreInterceptor} from "../../../../http-core.interceptor";

interface ISupportTicket {
  id: number;
  title: string;
  subject: string;
  ticketStatus: string;
  responses: string;
  createdDate: number;
}

@Component({
  selector: 'app-supporttickets',
  templateUrl: './supporttickets.component.html',
  standalone: true,
  imports: [
    HttpClientModule,
    NgClass,
    NgForOf,
    DatePipe,
    NgIf
  ],
  providers: [
    ApiService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCoreInterceptor,
      multi: true
    }
  ],
  styleUrls: ['./supporttickets.component.scss']
})
export class SupportTicketsComponent implements OnInit {
  public tickets: ISupportTicket[] = [];
  public filteredTickets: ISupportTicket[] = [];
  public loading: boolean = false; // loading alanı eklendi

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  async loadTickets(): Promise<void> {
    this.loading = true; // Yükleme işlemi başladığında loading'i true yap
    try {
      const response = await firstValueFrom(this.apiService.getAllTickets(this.apiService.getToken()));
      this.tickets = response as ISupportTicket[];
      this.filteredTickets = [...this.tickets];
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      this.loading = false; // Yükleme işlemi tamamlandığında loading'i false yap
    }
  }

  filterTickets(status: string): void {
    this.filteredTickets = this.tickets.filter(ticket => ticket.ticketStatus === status);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Created':
        return 'text-success';
      case 'Customer Answered':
        return 'text-warning';
      case 'Answered':
        return 'text-primary';
      case 'Closed':
        return 'text-dark';
      default:
        return '';
    }
  }

  async respondToTicket(ticketID: number): Promise<void> {
    const comment = prompt('Yanıtınızı giriniz:');
    if (comment) {
      try {
        await firstValueFrom(this.apiService.responseTicket(this.apiService.getToken(), { id: ticketID, userID: this.apiService.getCookie("userID"), comment }));
        this.loadTickets(); // Talep yanıtlandıktan sonra listeyi yeniden yükleyin
      } catch (error) {
        console.error('Failed to respond to ticket:', error);
      }
    }
  }

  async closeTicket(ticketID: number): Promise<void> {
    if (confirm('Bu talebi kapatmak istediğinize emin misiniz?')) {
      try {
        await firstValueFrom(this.apiService.closeTicket(this.apiService.getToken(), { id: ticketID }));
        this.loadTickets(); // Talep kapatıldıktan sonra listeyi yeniden yükleyin
      } catch (error) {
        console.error('Failed to close ticket:', error);
      }
    }
  }

  // Yeni fonksiyon: Responses içinden en son yorumu çekmek için
  getLatestComment(responses: string): string {
    const parsedResponses = JSON.parse(responses);
    if (parsedResponses.responses && parsedResponses.responses.length > 0) {
      const latestResponse = parsedResponses.responses[parsedResponses.responses.length - 1];
      return latestResponse.comment;
    }
    return '';
  }

  // Yeni fonksiyon: Status değerini çevirmek için
  getTranslatedStatus(status: string): string {
    switch (status) {
      case 'Created':
        return 'Oluşturuldu';
      case 'Customer Answered':
        return 'Müşteri Yanıtı';
      case 'Answered':
        return 'Yanıtlandı';
      case 'Closed':
        return 'Kapatıldı';
      default:
        return status; // Bilinmeyen statüler için orijinal değeri döndür
    }
  }
}