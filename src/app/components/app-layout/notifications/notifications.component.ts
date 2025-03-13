import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notifications',
  imports: [],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent implements OnInit, OnDestroy {
  constructor(
    private notificationsService: NotificationsService,
    private toastr: ToastrService
  ) {}

  notificationSub?: Subscription;

  ngOnInit() {
    this.notificationSub = this.notificationsService.notifications$.subscribe(msg => {
      this.toastr[msg.status](msg.message, msg.title);
    });
  }

  ngOnDestroy(): void {
    this.notificationSub?.unsubscribe();
  }
}
