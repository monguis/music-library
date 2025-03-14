import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/app-layout/header/header.component';
import { NotificationsComponent } from './components/app-layout/notifications/notifications.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, NotificationsComponent],
  providers: [ToastrService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Music Library';
}
