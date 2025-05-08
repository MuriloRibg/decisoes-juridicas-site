import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Neo4jService {
  private http: HttpClient = inject(HttpClient);

  getRedeJuizesProcessos(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/neo4j/rede-juizes-processos');
  }
}
