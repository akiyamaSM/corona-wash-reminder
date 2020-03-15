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
  
    async getItem(key){
      let value = await this.storage.get(key);

      return value;
    }

    async setIem(key, value){
      await this.storage.set(key, value);
    }

    async getLanguage(){
      let langue = await this.storage.get('inani_corona_wash_hands_lang');

      return langue;
    }

    async setLanguage(langue){
      await this.storage.set('inani_corona_wash_hands_lang', langue);
    }
  
    async schedule(localNotification: LocalNotifications, lang: string){

      await this.setLanguage(lang);

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
