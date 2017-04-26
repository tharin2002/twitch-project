import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html'
})
export class ItemDetailsPage {
  selectedItem: any;
  streams: any;
  offset: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
    this.offset = 0;
    let uri = 'https://api.twitch.tv/kraken/streams?client_id=n8pgxp7kq4r38uqsrmhxh4drdk3pgb&game=' + this.selectedItem.game.name;
    http.get(uri).map(res => res.json()).subscribe(data => {
      this.streams = data.streams;
    });
  }

  doInfinite(infiniteScroll) {
    this.offset += 25;
    let uri = 'https://api.twitch.tv/kraken/streams?client_id=n8pgxp7kq4r38uqsrmhxh4drdk3pgb&offset=' + this.offset + '&game=' + this.selectedItem.game.name;
    this.http.get(uri).map(res => res.json()).subscribe(data => {
      data.streams.forEach(item => {
        this.streams.push(item);
      });
      infiniteScroll.complete();
    });
  }
}
