import { Component } from '@angular/core';
import { DataService } from "./services/data.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  nodes: any;
  versions: any;
  branches: any;

  constructor(private http:HttpClient, private dataService:DataService)
  {
    this.dataService.GetNodes().subscribe(retVal =>
    {
      this.nodes = retVal;
    });

    this.dataService.GetVersions().subscribe(retVal =>
    {
      this.versions = retVal
    });

    this.dataService.GetBranches().subscribe(retVal =>
    {
      this.branches = retVal
    });
  }

  Restart($event, node: any)
  {
    this.dataService.Restart(node).subscribe(retVal =>
    {
      alert(retVal["Message"]);
    });
  }

  GetVersions($event, branch, since, until)
  {
    console.log(branch);
    console.log(since);
    console.log(until);

    this.dataService.GetVersions(branch, since, until).subscribe(retVal =>
    {
      this.versions = retVal;
    })
  }

  ChangeVersion($event, id, commitHash)
  {
    console.log(id);
    console.log(commitHash);

    this.dataService.ChangeVersion(id, commitHash).subscribe(retVal =>
    {
      alert(retVal);
    })
  }
}
