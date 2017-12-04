import { Component } from '@angular/core';
import {DataService} from "./services/data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  vms: any[];

  constructor(public dataService:DataService) {
    this.dataService.getVms().subscribe(retVal => {
      console.log(retVal);
      this.vms = retVal;
    });
  }
}
