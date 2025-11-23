import { Component, OnInit, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { AdvertisementService, Advertisement } from '../../services/advertisement.service';
import { HomeDetails, HomeDetails1, HomeDetails2, HomeDetails4, HomeDetails5, HomeDetails6, HomeDetails7, HomeDetails8, HomeDetails9, HomeDetails10, HomeDetails11, HomeDetails12, HomeDetails14, HomeDetails15 } from './lenskart-home.data';

@Component({
  selector: 'app-lenskart-home',
  templateUrl: './lenskart-home.component.html',
  styleUrls: ['./lenskart-home.component.css'],
  standalone: true,
  imports: [CarouselModule, ButtonModule],
  schemas: [NO_ERRORS_SCHEMA]
})
export class LenskartHomeComponent implements OnInit {
  homeDetails = HomeDetails;
  homeDetails1 = HomeDetails1;
  homeDetails2 = HomeDetails2;
  homeDetails4 = HomeDetails4;
  homeDetails5 = HomeDetails5;
  homeDetails6 = HomeDetails6;
  homeDetails7 = HomeDetails7;
  homeDetails8 = HomeDetails8;
  homeDetails9 = HomeDetails9;
  homeDetails10 = HomeDetails10;
  homeDetails11 = HomeDetails11;
  homeDetails12 = HomeDetails12;
  homeDetails14 = HomeDetails14;
  homeDetails15 = HomeDetails15;
  advertisements: Advertisement[] = [];

  constructor(private router: Router, private advertisementService: AdvertisementService) { }

  ngOnInit(): void {
    // Scroll to top on route change
    window.scrollTo(0, 0);
    this.loadAdvertisements();
  }

  loadAdvertisements(): void {
    this.advertisementService.getAllActiveAdvertisements().subscribe(data => {
      this.advertisements = data;
      // Fallback to static data if no ads found (optional, or just replace)
      if (this.advertisements.length === 0) {
        // keep using static HomeDetails1 or map it to Advertisement interface if needed
      }
    });
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }
}
