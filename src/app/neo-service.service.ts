import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class NeoServiceService {
  private url : string = `https://api.nasa.gov/neo/rest/v1/feed`
  private apiKey : string = 'Zl5ZDEoyJTKoxSmrwLJV2yCu547BMGcSUnnEC1Uy'
  constructor(private http : HttpClient) { }
  getDataFromNeoApi(start_date : any ,end_date : any){
    let url = `${this.url}?start_date=${start_date}&end_date=${end_date}&api_key=${this.apiKey}`
    return this.http.get(url);
  }
}
