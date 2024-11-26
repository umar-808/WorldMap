import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private countryListSource = new BehaviorSubject<string[]>([]);
  countryList$ = this.countryListSource.asObservable();

  private countrySearchSource = new BehaviorSubject<string>('');
  countrySearch$ = this.countrySearchSource.asObservable();

  updateCountryList(countries: string[]): void {
    this.countryListSource.next(countries);
  }

  searchCountry(countryName: string): void {
    this.countrySearchSource.next(countryName);
  }
}
