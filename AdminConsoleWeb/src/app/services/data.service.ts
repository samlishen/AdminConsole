import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  constructor(public http:Http, public httpClient:HttpClient) {

  }

  getVms() {
    return this.http.get('http://localhost:3001/api/vm').map(res => res.json());
  }

  getVersion() {
    return this.http.get('http://localhost:3001/api/version').map(res => res.json());
  }

  updateNode(vm, node) {
    var url = `http://localhost:3001/api/node`;
    console.log(url);
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    var body = {
      vmId: vm.id,
      nodeId: node.id,
      mode: "update",
      restaurantId: node.RestaurantId,
      port: node.port,
      versionId: node.VersionId
    };

    return this.httpClient.post(url, JSON.stringify(body), {headers: headers});

  }

  shutdownNode(vm, node) {
    var url = `http://localhost:3001/api/node/${vm.id}/${node.id}`;
    console.log(url);
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.httpClient.delete(url, {headers: headers});
  }
}
