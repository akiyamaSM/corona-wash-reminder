import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { of } from 'rxjs';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  readonly messages: Array<any> = [
    {
      langue: 'FR', messages: [
        `lavez-vous les mains s'il vous plaît`,
      ]
    },
    {
      langue: 'AR', messages: [
        `اغسل يديك، رجاء`,
      ]
    },
    {
      langue: 'EN', messages: [
        `Wash your hands please`,
      ]
    },
  ];


  constructor(public storage: Storage) { }

    async getLanguage(){
      let langue = await this.storage.get('inani_corona_wash_hands_lang');

      return langue;
    }

    setLanguage(langue){
      this.storage.set('inani_corona_wash_hands_lang', langue);
    }
  
    async schedule(localNotification: LocalNotifications){
      let lang = await this.getLanguage();

      if(lang === null){
        lang = 'EN';
      }
      
      let messages : Array<string> = this.messages.find((line) => line.langue === lang).messages;
      localNotification.cancelAll();

      localNotification.schedule({
        title: 'Wanna beat corona?',
        text: this.getRandomMessageFrom(messages),
        trigger: {at: new Date(new Date().getTime() + 3600)},
        led: 'FF0000',
        sound: null,
        foreground: true,
     });

  }
  
  getRandomMessageFrom(messages: Array<string>): string{
    return messages[0];
  }

}
