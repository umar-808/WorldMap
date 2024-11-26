import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorldBankService {
  private apiUrl = 'https://api.worldbank.org/v2/country';

  constructor(private http: HttpClient) {}

  getCountryData(countryCode: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${countryCode}?format=json`).pipe(
      map((response) => (response && response[1] ? response[1][0] : null))
    );
  }
}
