import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  constructor(public http:Http, public httpClient:HttpClient) {

  }

  getVms() {
    return this.http.get('http://localhost:12345/api/vm').map(res => res.json());
  }

  getVersion() {
    return this.http.get('http://localhost:12345/api/version').map(res => res.json());
  }

  updateNode(vm, node) {
    var url = `http://localhost:12345/api/node/${vm.id}/${node.id}`;
    console.log(url);
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
    var body = {
      restaurantId: node.RestaurantId,
      port: node.port,
      versionId: node.VersionId
    };

    return this.httpClient.put(url, JSON.stringify(body), {headers: headers});

  }

  shutdownNode(vm, node) {
    var url = `http://localhost:12345/api/node/${vm.id}/${node.id}`;
    console.log(url);
    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT')
    return this.httpClient.delete(url, {headers: headers});
  }
}
