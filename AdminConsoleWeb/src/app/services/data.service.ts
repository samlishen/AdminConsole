import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  constructor(private http:HttpClient) {

  }

  getVms() {
    return this.http.get('http://localhost:3001/api/vm');
  }

  getVersion(since, until) {
    let url = 'http://localhost:3001/api/version';

    let headers = new HttpHeaders({'Content-Type': 'application/json'});

    let body = {
      since: since,
      until: until
    };

    return this.http.post(url, JSON.stringify(body), {headers: headers});
  }

  updateNode(vm, node, commitHash) {
    node.version.commitHash = commitHash;

    var url = `http://localhost:3001/api/node`;

    var headers = new HttpHeaders({'Content-Type': 'application/json'});

    var body = {
      vmId: vm.id,
      nodeId: node.id,
      mode: "update",
      versionId: node.VersionId
    };

    return this.http.post(url, JSON.stringify(body), {headers: headers});

  }

  shutdownNode(vm, node) {
    var url = `http://localhost:3001/api/node`;

    var headers = new HttpHeaders({'Content-Type': 'application/json'});

    var body = {
      vmId: vm.id,
      nodeId: node.id,
      mode: "restart"
    }

    return this.http.post(url, JSON.stringify(body), {headers: headers});
  }
}
