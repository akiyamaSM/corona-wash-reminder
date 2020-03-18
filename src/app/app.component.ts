import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { NotificationService } from './notification.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { timer } from 'rxjs';
import { serviceName } from './lib/config';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  showSplash = true;

  constructor(
    private localNotifications: LocalNotifications,
    private mainService: NotificationService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private backgroundMode: BackgroundMode,
  ) {
    this.initializeApp();
  }

  async initializeApp() {

    let is_installed = await this.mainService.getItem(serviceName);
    if (is_installed === null) {
      this.mainService.schedule(this.localNotifications, 'EN');
      this.mainService.setIem(serviceName, true);
    }

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      timer(2000).subscribe(() => this.showSplash = false);

      this.backgroundMode.setDefaults({ hidden: true, silent: true });

      this.backgroundMode.enable();
    });
  }
}
