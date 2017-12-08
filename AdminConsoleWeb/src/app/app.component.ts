import { Component } from '@angular/core';
import { DataService } from "./services/data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  vms: any[];
  versions: any[];

  constructor(public dataService:DataService) {
    this.dataService.getVms().subscribe(retVal => {
      this.vms = retVal;
    });

    this.dataService.getVersion().subscribe(retVal => {
      this.versions = retVal;
    })
  }

  public Shutdown(event, vm, node) {
    this.dataService.shutdownNode(vm, node).subscribe(retVal => {
      console.log(retVal);
    });
  }

  public Update(event, vm, node) {
    this.dataService.updateNode(vm, node).subscribe(retVal => {
      console.log(retVal);
    });
  }
}
