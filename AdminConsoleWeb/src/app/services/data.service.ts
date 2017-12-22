import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import 'rxjs/add/operator/map';


@Injectable()
export class DataService {
  constructor(private http:HttpClient) {

  }

  GetNodes()
  {
    // return this.http.get(`
    // ${ServiceConfig.ServiceDnsName}:${ServiceConfig.SPort}
    // ${ServiceConfig.SApi}${ServiceConfig.SNodeApi}
    // `);
    var headers = new HttpHeaders({
      'Authorization': 'AbCd+1234',
      'Content-Type': 'application/json'
    });

    return this.http.get('http://localhost:3001/api/nodes', {headers: headers});
  }

  GetVersions(branch = undefined, since = undefined, until = undefined)
  {
    var url = `http://localhost:3001/api/versions/commits`;

    var headers = new HttpHeaders({
      'Authorization': 'AbCd+1234',
      'Content-Type': 'application/json'
    });

    var body = {
      branch: branch,
      since: since,
      until: until
    };

    return this.http.post(url, body, {headers: headers});
  }

  GetBranches()
  {
    var url = `http://localhost:3001/api/versions/branches`;

    var headers = new HttpHeaders({
      'Authorization': 'AbCd+1234'
    });

    return this.http.get(url, {headers: headers});
  }

  Restart(node: any)
  {
    console.log(node);

    var url = `http://localhost:3001/api/nodes`;

    var headers = new HttpHeaders({
      'Authorization': 'AbCd+1234'
    });

    var body = {
      id: node.id,
      mode: 'restart'
    };

    return this.http.post(url, body, {headers: headers});
  }

  ChangeVersion(id, commitHash)
  {
    var url = `http://localhost:3001/api/nodes`;

    var headers = new HttpHeaders({
      'Authorization': 'AbCd+1234',
      'Content-Type': 'application/json'
    });

    var body = {
      id: id,
      mode: 'update',
      commitHash: commitHash
    };

    return this.http.post(url, body, {headers: headers});
  }
}
