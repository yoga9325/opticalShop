import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Advertisement, AdvertisementService } from '../../../services/advertisement.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-admin-advertisement',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, DialogModule],
    templateUrl: './admin-advertisement.component.html',
    styleUrls: ['./admin-advertisement.component.css']
})
export class AdminAdvertisementComponent implements OnInit {
    advertisements: Advertisement[] = [];
    newAdvertisement: Advertisement = { imageUrl: '', caption: '' };
    displayDialog: boolean = false;

    constructor(private advertisementService: AdvertisementService) { }

    ngOnInit(): void {
        this.loadAdvertisements();
    }

    loadAdvertisements(): void {
        this.advertisementService.getAllAdvertisements().subscribe(data => {
            this.advertisements = data;
        });
    }

    showDialog(): void {
        this.displayDialog = true;
    }

    saveAdvertisement(): void {
        this.advertisementService.addAdvertisement(this.newAdvertisement).subscribe(() => {
            this.loadAdvertisements();
            this.displayDialog = false;
            this.newAdvertisement = { imageUrl: '', caption: '' };
        });
    }

    deleteAdvertisement(id: number): void {
        if (confirm('Are you sure you want to delete this advertisement?')) {
            this.advertisementService.deleteAdvertisement(id).subscribe(() => {
                this.loadAdvertisements();
            });
        }
    }
}
