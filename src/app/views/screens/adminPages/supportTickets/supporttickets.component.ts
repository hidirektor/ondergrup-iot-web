import {Component, OnInit, TemplateRef} from '@angular/core';
import {ApiService} from '../../../../services/api.service';
import {firstValueFrom} from 'rxjs';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {HttpCoreInterceptor} from "../../../../http-core.interceptor";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {DatePipe, NgClass, NgForOf, NgIf} from "@angular/common";

interface ISupportTicket {
  id: number;
  ownerID?: string;  // ownerID opsiyonel olarak işaretlendi
  title: string;
  subject: string;
  ticketStatus: string;
  responses: string;
  createdDate: number;
}

interface IChatMessage {
  userID: string;
  userName: string;
  nameSurname: string;
  commentDate: number;
  comment: string;
}

@Component({
  selector: 'app-supporttickets',
  templateUrl: './supporttickets.component.html',
  imports: [
    HttpClientModule,
    NgClass,
    NgForOf,
    DatePipe,
    NgIf,
    FormsModule
  ],
  providers: [
    ApiService,
    NgbModal,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpCoreInterceptor,
      multi: true
    }
  ],
  styleUrls: ['./supporttickets.component.scss'],
  standalone: true
})
export class SupportTicketsComponent implements OnInit {
  public tickets: ISupportTicket[] = [];
  public filteredTickets: ISupportTicket[] = [];
  public chatMessages: IChatMessage[] = [];
  public newMessage: string = '';
  public loading: boolean = false;
  private modalRef: NgbModalRef | undefined;
  public currentTicket: ISupportTicket | undefined;

  constructor(private apiService: ApiService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  async loadTickets(): Promise<void> {
    this.loading = true;
    try {
      const response = await firstValueFrom(this.apiService.getAllTickets(this.apiService.getToken()));
      this.tickets = response as ISupportTicket[];

      this.filteredTickets = this.tickets.filter(ticket =>
          ticket.ticketStatus === 'Created' || ticket.ticketStatus === 'Customer Response'
      );
    } catch (error) {
      console.error('Failed to load tickets:', error);
    } finally {
      this.loading = false;
    }
  }

  filterTickets(status: string): void {
    this.filteredTickets = this.tickets.filter(ticket => ticket.ticketStatus === status);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Created':
        return 'text-success';
      case 'Customer Response':
        return 'text-warning';
      case 'Answered':
        return 'text-primary';
      case 'Closed':
        return 'text-dark';
      default:
        return '';
    }
  }

  openChat(content: TemplateRef<any>, ticket: ISupportTicket): void {
    try {
      this.currentTicket = ticket;
      const parsedResponses = JSON.parse(ticket.responses);
      this.chatMessages = parsedResponses.responses || [];
    } catch (error) {
      console.error('Error parsing responses:', error);
      this.chatMessages = [];
    }
    this.newMessage = '';
    this.modalRef = this.modalService.open(content);
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  async sendMessage(): Promise<void> {
    if (this.newMessage.trim() && this.currentTicket) {
      const newChatMessage: IChatMessage = {
        userID: this.apiService.getCookie('userID'),
        userName: this.apiService.getCookie('userName'),
        nameSurname: this.apiService.getCookie('nameSurname'),
        commentDate: Date.now(),
        comment: this.newMessage,
      };

      this.chatMessages.push(newChatMessage);
      this.newMessage = '';

      try {
        await firstValueFrom(this.apiService.responseTicket(this.apiService.getToken(), {
          id: this.currentTicket.id,
          userID: newChatMessage.userID,
          comment: newChatMessage.comment
        }));

        // Modal'ı kapat ve tabloyu güncelle
        this.closeModal();
        await this.loadTickets();
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  }

  async closeTicket(ticketID: number): Promise<void> {
    if (confirm('Bu talebi kapatmak istediğinize emin misiniz?')) {
      try {
        await firstValueFrom(this.apiService.closeTicket(this.apiService.getToken(), { id: ticketID, operationPlatform: "Admin Panel", sourceUserID: this.apiService.getCookie('userID') }));
        await this.loadTickets();
      } catch (error) {
        console.error('Failed to close ticket:', error);
      }
    }
  }

  getLatestComment(responses: string): string {
    try {
      const parsedResponses = JSON.parse(responses);
      if (parsedResponses.responses && parsedResponses.responses.length > 0) {
        const latestResponse = parsedResponses.responses[parsedResponses.responses.length - 1];
        return latestResponse.comment;
      }
    } catch (error) {
      console.error('Error parsing responses:', error);
    }
    return '';
  }

  getTranslatedStatus(status: string): string {
    switch (status) {
      case 'Created':
        return 'Oluşturuldu';
      case 'Customer Response':
        return 'Müşteri Yanıtı';
      case 'Answered':
        return 'Yanıtlandı';
      case 'Closed':
        return 'Kapatıldı';
      default:
        return status;
    }
  }

  isOwnerMessage(message: IChatMessage): boolean {
    if (this.currentTicket?.ownerID) {
      const isOwner = this.currentTicket.ownerID === message.userID;
      console.log('Owner ID:', this.currentTicket.ownerID);
      console.log('Message User ID:', message.userID);
      console.log('Is owner message:', isOwner);
      return isOwner;
    }
    return false;
  }

  showAllTickets(): void {
    this.filteredTickets = [...this.tickets];
  }
}