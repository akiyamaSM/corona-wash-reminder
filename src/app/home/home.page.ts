import { Component } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private localNotifications: LocalNotifications, private mainService : NotificationService) {
    this.mainService.setLanguage('FR')
  }


  schedule(){
    this.mainService.schedule(this.localNotifications);
  }
}
