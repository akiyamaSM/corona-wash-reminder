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
        `lavez-vous les mains s'il vous plaît, c'est important`,
      ]
    },
    {
      langue: 'AR', messages: [
        `اغسل يديك، رجاء`,
        'ابقى في منزلك و اغسل يديك باستمرار، أزمة و ستمضي',
        'اغسل يديك بالماء والصابـون أو بمطهر'
      ]
    },
    {
      langue: 'EN', messages: [
        `Wash your hands please, do it for the ones you love`,
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
      
      await this.setIem('inani_corona_wash_hands_started_at', moment().toISOString());

      let nextDates = this.datesBetween(
        moment(),
        moment().add(7, 'days')
      );

      
      let times: Array<any> = [
        {
          hour: 10,
          minutes: 0,
        },
        {
          hour: 12,
          minutes: 0,
        },
        {
          hour: 15,
          minutes: 0,
        },
        {
          hour: 17,
          minutes: 0,
        },
        {
          hour: 18,
          minutes: 30,
        },
        {
          hour: 20,
          minutes: 0,
        },
        {
          hour: 22,
          minutes: 0,
        },
      ];
      let id = 0;
      nextDates.forEach((date) => {
        let moment_date = moment(date, "MM-DD-YYYY");
          

        let notifArray  = times.map((time) => {
          let local_moment_date = moment_date.clone();
          local_moment_date.hours(time.hour);
          local_moment_date.minutes(time.minutes);
          return {
            id: ++id,
            led: 'FF0000',
            foreground: true,
            title: 'Wanna beat corona?',
            text: this.getRandomMessageFrom(messages),
            trigger: {at: new Date(local_moment_date.toISOString())},
            data: {
              when: local_moment_date.toISOString()
            },
            smallIcon: 'res://n_icon.png'
          } 
        });

        localNotification.schedule([... notifArray]);
      });


  }

  getRandomMessageFrom(messages: Array<string>): string{
    return messages[Math.floor(this.random(1, messages.length))-1];
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

  random(mn, mx) {  
    return Math.random() * (mx - mn) + mn;  
  }
  
  

}
