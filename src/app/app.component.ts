import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent, NotificationsComponent } from '@app/components/app-layout';
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
