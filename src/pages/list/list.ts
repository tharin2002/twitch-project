import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { ItemDetailsPage } from '../item-details/item-details';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  icons: string[];
  games: any;
  allGames: any;
  offset: number;
  items: Array<{title: string, note: string, icon: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http) {
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
    'american-football', 'boat', 'bluetooth', 'build'];

    http.get('https://api.twitch.tv/kraken/games/top?client_id=n8pgxp7kq4r38uqsrmhxh4drdk3pgb').map(res => res.json()).subscribe(data => {
      this.games = data.top;
      this.allGames = this.games;
    });

    this.offset = 0;

    this.items = [];
    for(let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }

  itemTapped(event, item) {
    this.navCtrl.push(ItemDetailsPage, {
      item: item
    });
  }

  doInfinite(infiniteScroll) {
    this.offset += 10;
    let uri = 'https://api.twitch.tv/kraken/games/top?client_id=n8pgxp7kq4r38uqsrmhxh4drdk3pgb&offset=' + this.offset;
    this.http.get(uri).map(res => res.json()).subscribe(data => {
      data.top.forEach(item => {
        this.games.push(item);
      });
      this.allGames = this.games;
      infiniteScroll.complete();
    });
  }

  onFilter(ev: any) {
    this.games = this.allGames;
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.games = this.games.filter((item) => {
        return (item.game.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}
