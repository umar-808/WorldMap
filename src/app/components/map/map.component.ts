import { ChangeDetectorRef, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SearchService } from 'src/app/services/search.service';
import { WorldBankService } from 'src/app/services/world-bank.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent {
  selectedCountry: any = null;
  selectedCountryCode: string | null = null;

  private subscription!: Subscription;

  constructor(private worldBankService: WorldBankService, private cdr: ChangeDetectorRef, private searchService: SearchService) {
    this.subscription = this.searchService.countrySearch$.subscribe(
      (countryName) => {
        if (countryName) {
          this.highlightCountryByName(countryName);
        }
      }
    );
  }

  onSvgLoaded(event: Event): void {
    const objectElement = event.target as HTMLObjectElement;
    const svgDocument = objectElement.contentDocument;
  
    if (svgDocument) {
      const paths = svgDocument.querySelectorAll('path');
      const countryTitles: string[] = [];
  
      paths.forEach((path) => {
        const title = path.getAttribute('title');
        if (title) {
          countryTitles.push(title);
          path.addEventListener('mouseover', () => this.onCountryHover(path));
          path.addEventListener('mouseout', () => this.onCountryHoverOut(path));
          path.addEventListener('click', () => this.onCountryClick(path));
        }
      });
  
      this.searchService.updateCountryList(countryTitles);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCountryHover(path: SVGElement): void {
    if (this.selectedCountryCode !== path.id) {
      path.setAttribute('fill', '#fd8b8b');
      path.style.cursor = 'pointer';
    }
  }

  onCountryHoverOut(path: SVGElement): void {
    if (this.selectedCountryCode !== path.id) {
      path.setAttribute('fill', '');
      path.style.cursor = '';
    }
  }

  highlightCountryByName(countryName: string): void {
    const objectElement = document.querySelector('object') as HTMLObjectElement;
    const svgDocument = objectElement?.contentDocument;
  
    if (!svgDocument) {
      console.error('SVG is not loaded.');
      return;
    }
  
    const countryPath = Array.from(svgDocument.querySelectorAll('path')).find(
      (path) => path.getAttribute('title')?.toLowerCase() === countryName.toLowerCase()
    );
  
    if (!countryPath) {
      console.error('Country not found on the map.');
      if (this.selectedCountryCode) {
        const previousCountry = svgDocument.querySelector(
          `#${this.selectedCountryCode}`
        ) as SVGElement;
  
        if (previousCountry) {
          this.unselectCountry(previousCountry);
        }
      }
      alert('Country not found!');
      return;
    }
  
    if (this.selectedCountryCode === countryPath.id) {
      console.log(`Country ${countryName} is already selected.`);
      return;
    }
  
    this.selectCountry(countryPath);
  }
  
  onCountryClick(path: SVGElement): void {
    if (this.selectedCountryCode === path.id) {
      this.unselectCountry(path);
      return;
    }
  
    this.selectCountry(path);
  }
  
  private selectCountry(path: SVGElement): void {
    if (this.selectedCountryCode) {
      const previousCountry = path.ownerSVGElement?.querySelector(
        `#${this.selectedCountryCode}`
      );
      previousCountry?.setAttribute('fill', '');
    }
  
    this.selectedCountryCode = path.id;
    path.setAttribute('fill', '#fd8b8b');
  
    this.worldBankService.getCountryData(path.id).subscribe(
      (data: any) => {
        const countryData = data;
  
        this.selectedCountry = {
          name: countryData.name,
          capital: countryData.capitalCity,
          region: countryData.region.value,
          incomeLevel: countryData.incomeLevel.value,
          longitude: countryData.longitude,
          latitude: countryData.latitude
        };
  
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching country data:', error);
      }
    );
  }

  private unselectCountry(path: SVGElement): void {
    path.setAttribute('fill', '');
    this.selectedCountryCode = null;
    this.selectedCountry = null;
    this.cdr.detectChanges();
  }
}
