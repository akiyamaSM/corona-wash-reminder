import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { of } from 'rxjs';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import * as moment from 'moment';

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

      let nextDates = this.datesBetween(
        moment(),
        moment().add(2, 'days')
      );

      
      
      nextDates.forEach((date) => {
        let moment_date = moment(date, "MM-DD-YYYY");
          moment_date.hours(21);
          moment_date.minutes(36);
        localNotification.schedule({
            id: Date.now(),
            led: 'FF0000',
            foreground: true,
            title: 'Wanna beat corona?',
            text: this.getRandomMessageFrom(messages),
            trigger: {at: new Date(moment_date.toISOString())},
          });
      });


  }

  getTimeFromDate(date){
    let times = date.split('/');

    return {
      month: times[1],
      day: times[0],
      year: times[2]
    }
  }
  
  getRandomMessageFrom(messages: Array<string>): string{
    return messages[0];
  }


  datesBetween(startDate, endDate) {
    var dates = [];

    var currDate = moment(startDate).startOf('day');
    var lastDate = moment(endDate).startOf('day');

    do{
      dates.push(currDate.clone().format('L'));

    }
    while(currDate.add(1, 'days').diff(lastDate) < 0);

    return dates;
  }
}
