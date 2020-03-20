import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {

  constructor(private modalCtrl: ModalController, private emailComposer: EmailComposer) { }

  ngOnInit() { }

  async dismiss() {
    await this.modalCtrl.dismiss();
  }

  sendMail() {
    this.emailComposer.isAvailable().then((available: boolean) => {
      if (available) {

        let email = {
          to: 'inanielhoussain@gmail.com',
          subject: 'Hire ME!',
          body: 'I want to work with you',
          isHtml: true
        }

        this.emailComposer.open(email);
      }
    });
  }
}
