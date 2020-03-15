import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { NotificationService } from './notification.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private localNotifications: LocalNotifications,
    private mainService : NotificationService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private backgroundMode: BackgroundMode
  ) {
    this.initializeApp();
  }

  async initializeApp() {


    let is_installed = await this.mainService.getItem('inani_corona_wash_hands_is_installed');
    if( is_installed === null){
      this.mainService.schedule(this.localNotifications, 'EN');
      this.mainService.setIem('inani_corona_wash_hands_is_installed', true);
    }

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.backgroundMode.setDefaults({
        hidden: true
      });
      
      this.backgroundMode.enable();
    });
  }
}
