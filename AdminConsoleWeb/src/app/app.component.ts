import { Component } from '@angular/core';
import { DataService } from "./services/data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  vms: any;
  versions: any;

  constructor(public dataService:DataService) {
    this.dataService.getVms().subscribe(retVal => {
      this.vms = retVal;
    });

    this.dataService.getVersion(undefined, undefined).subscribe(retVal => {
      this.versions = retVal;
    })
  }

  public GetVersion(event, since, until) {
    return this.dataService.getVersion(since, until).subscribe(retVal => {
      this.versions = retVal;
    })
  }

  public Shutdown(event, vm, node) {
    this.dataService.shutdownNode(vm, node).subscribe(retVal => {
      alert(retVal);
    });
  }

  public Update(event, vm, node, commitHash) {
    this.dataService.updateNode(vm, node, commitHash).subscribe(retVal => {
      console.log(retVal);
    });
  }
}
