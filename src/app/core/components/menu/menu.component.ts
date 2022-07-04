import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { IonList } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  @Output() clickItem = new EventEmitter<string>();

  @ViewChild(IonList, { static: false }) ionList: IonList;

  constructor() { }

  ngOnInit() {


  }

  clickMenu(op = '') {
    this.ionList.closeSlidingItems();
    this.clickItem.emit(op);
  }

}
