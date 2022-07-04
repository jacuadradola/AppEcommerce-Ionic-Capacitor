import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { IonList } from '@ionic/angular';

@Component({
  selector: 'app-menu-bill',
  templateUrl: './menu-bill.component.html',
  styleUrls: ['./menu-bill.component.scss'],
})
export class MenuBillComponent implements OnInit {

  @Output() clickItem = new EventEmitter<string>();

  @ViewChild(IonList, { static: false }) ionList: IonList;

  constructor() { }

  ngOnInit() {
  }

  clickMenu1(op = '') {
    this.ionList.closeSlidingItems();
    this.clickItem.emit(op);
  }

}
