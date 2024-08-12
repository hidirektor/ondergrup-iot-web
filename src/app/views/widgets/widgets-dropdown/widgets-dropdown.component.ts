import {AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit,} from '@angular/core';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  DropdownComponent,
  DropdownItemDirective,
  DropdownToggleDirective,
  RowComponent,
  WidgetStatAComponent
} from "@coreui/angular";
import {RouterLink} from "@angular/router";
import {ChartjsComponent} from "@coreui/angular-chartjs";

@Component({
  selector: 'app-widgets-dropdown',
  templateUrl: './widgets-dropdown.component.html',
  styleUrls: ['./widgets-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [
    WidgetStatAComponent,
    ColComponent,
    RowComponent,
    DropdownComponent,
    DropdownToggleDirective,
    RouterLink,
    ChartjsComponent,
    DropdownItemDirective,
    CardHeaderComponent,
    CardBodyComponent,
    CardComponent
  ]
})
export class WidgetsDropdownComponent implements OnInit, AfterContentInit {
  @Input() totalUsers: number = 0;
  @Input() engineerCount: number = 0;
  @Input() technicianCount: number = 0;
  @Input() totalMachines: number = 0;
  @Input() totalKlasikCount: number = 0;
  @Input() totalPowerPackCount: number = 0;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }
}