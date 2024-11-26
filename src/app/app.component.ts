import { Component, OnInit } from '@angular/core';
import { SearchService } from './services/search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'world-map-app';

  searchQuery: string = '';
  countries: string[] = [];
  filteredCountries: string[] = [];

  constructor(private searchService: SearchService) {}

  ngOnInit(): void {
    this.searchService.countryList$.subscribe((countryList) => {
      this.countries = countryList;
      this.filterCountries();
    });
  }

  filterCountries(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredCountries = [];
      return;
    }
    this.filteredCountries = this.countries.filter((country) =>
      country.toLowerCase().startsWith(this.searchQuery.toLowerCase())
    );
  }

  selectCountry(country: string): void {
    this.searchQuery = country;
    this.filteredCountries = [];
  }

  searchCountry(): void {
    if (this.searchQuery.trim()) {
      this.searchService.searchCountry(this.searchQuery.trim());
      this.searchQuery = '';
    }
  }
}
