import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  constructor(public http:Http) {

  }

  getVms() {
    return this.http.get('http://localhost:12345/api/vm').map(res => res.json());
  }
}
