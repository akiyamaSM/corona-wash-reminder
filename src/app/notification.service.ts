import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import * as moment from 'moment';
import { notifications } from './translation';
import { reminderTimes } from './lib/config';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  readonly messages: Array<any> = notifications;
  storageKey: String;

  constructor(public storage: Storage) {
    this.storageKey = 'inani_corona_wash_hands_lang'
  }

  async getItem(key) {
    return await this.storage.get(key);
  }

  async setIem(key, value) {
    await this.storage.set(key, value);
  }

  async getLanguage() {
    return await this.storage.get(this.storageKey);
  }

  async setLanguage(langue) {
    await this.storage.set(this.storageKey, langue);
  }

  async schedule(localNotification: LocalNotifications, lang: string) {

    await this.setLanguage(lang);

    localNotification.clearAll();

    await this.setIem('inani_corona_wash_hands_started_at', moment().toISOString());

    let nextDates = this.datesBetween(
      moment(),
      moment().add(5, 'days')
    );

    await this.setNotificationForNextDates(localNotification, nextDates, lang);
  }

  async setNotificationForNextDates(localNotification: LocalNotifications, nextDates, lang: string) {

    let messages: Array<string> = this.messages.find((line) => line.langue === lang).messages;
    let id = 0;

    await Promise.all(nextDates.map(async (date) => {

      let notifArray = await this.getTimeNotifications(id, date, messages);

      localNotification.schedule([...notifArray]);
    }));
  }

  async getTimeNotifications(id, date, messages) {
    let times: Array<any> = reminderTimes;
    let moment_date = moment(date, "MM-DD-YYYY");

    let notifications = [];
    await Promise.all(times.map((time) => {

      let local_moment_date = moment_date.clone();
      local_moment_date.hours(time.hour);
      local_moment_date.minutes(time.minutes);

      notifications.push({
        id: ++id,
        led: 'FF0000',
        foreground: true,
        title: 'Wanna beat corona?',
        text: this.getRandomMessageFrom(messages),
        trigger: {
          at: new Date(local_moment_date.toISOString())
        },
        data: {
          when: local_moment_date.toISOString()
        },
        smallIcon: 'res://n_icon.png'
      })
    }));

    return notifications;
  }

  getRandomMessageFrom(messages: Array<string>): string {
    return messages[Math.floor(this.random(1, messages.length)) - 1];
  }


  datesBetween(startDate, endDate) {
    var dates = [];

    var currDate = moment(startDate).startOf('day');
    var lastDate = moment(endDate).startOf('day');

    do {
      dates.push(currDate.clone().format('L'));
    }
    while (currDate.add(1, 'days').diff(lastDate) < 0);

    return dates;
  }

  random(mn, mx) {
    return Math.random() * (mx - mn) + mn;
  }
}
