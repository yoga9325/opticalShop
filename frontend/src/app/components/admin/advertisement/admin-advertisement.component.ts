import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Advertisement, AdvertisementService } from '../../../services/advertisement.service';
import { PromoBannerService, PromoBannerSettings } from '../../../services/promo-banner.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TabViewModule } from 'primeng/tabview';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-admin-advertisement',
    standalone: true,
    imports: [
        CommonModule, 
        FormsModule, 
        TableModule, 
        ButtonModule, 
        InputTextModule, 
        DialogModule,
        InputSwitchModule,
        InputNumberModule,
        InputTextareaModule,
        TabViewModule,
        ConfirmDialogModule,
        ToastModule
    ],
    providers: [MessageService, ConfirmationService],
    templateUrl: './admin-advertisement.component.html',
    styleUrls: ['./admin-advertisement.component.css']
})
export class AdminAdvertisementComponent implements OnInit {
    // Image Advertisement Management
    advertisements: Advertisement[] = [];
    newAdvertisement: Advertisement = { imageUrl: '', caption: '' };
    displayDialog: boolean = false;

    // Promotional Banner Management
    bannerSettings: PromoBannerSettings;
    newFeature: string = '';

    constructor(
        private advertisementService: AdvertisementService,
        private bannerService: PromoBannerService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {
        // Load current banner settings
        this.bannerSettings = { ...this.bannerService.getSettings() };
    }

    ngOnInit(): void {
        this.loadAdvertisements();
    }

    // ===== Image Advertisement Methods =====
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
            this.showSuccess('Advertisement added successfully!');
        });
    }

    deleteAdvertisement(id: number): void {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this advertisement?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.advertisementService.deleteAdvertisement(id).subscribe(() => {
                    this.loadAdvertisements();
                    this.showSuccess('Advertisement deleted successfully!');
                });
            }
        });
    }

    // ===== Promotional Banner Methods =====
    saveBannerSettings(): void {
        this.bannerService.updateSettings(this.bannerSettings).subscribe({
            next: () => {
                this.showSuccess('Banner settings saved successfully!');
            },
            error: (error) => {
                console.error('Error saving banner settings:', error);
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: 'Failed to save banner settings. Please try again.' 
                });
            }
        });
    }

    resetBannerSettings(): void {
        this.confirmationService.confirm({
            message: 'Are you sure you want to reset banner settings to defaults?',
            header: 'Reset Confirmation',
            icon: 'pi pi-question-circle',
            acceptButtonStyleClass: 'p-button-warning',
            accept: () => {
                this.bannerService.resetToDefaults().subscribe({
                    next: (settings) => {
                        this.bannerSettings = { ...settings };
                        this.showSuccess('Banner settings reset to defaults!');
                    },
                    error: (error) => {
                        console.error('Error resetting banner settings:', error);
                        this.messageService.add({ 
                            severity: 'error', 
                            summary: 'Error', 
                            detail: 'Failed to reset banner settings. Please try again.' 
                        });
                    }
                });
            }
        });
    }

    addFeature(): void {
        if (this.newFeature.trim()) {
            this.bannerSettings.features.push(this.newFeature.trim());
            this.newFeature = '';
        }
    }

    removeFeature(index: number): void {
        this.bannerSettings.features.splice(index, 1);
    }

    previewBanner(): void {
        // Save settings first
        this.bannerService.updateSettings(this.bannerSettings).subscribe({
            next: () => {
                // Trigger preview by clearing session storage and calling service method
                sessionStorage.removeItem('promoModalShown');
                // Emit event to trigger banner display
                this.bannerService.triggerPreview();
                this.showSuccess('Preview triggered! Banner will appear now.');
            },
            error: (error) => {
                console.error('Error saving settings for preview:', error);
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: 'Failed to save settings. Please try again.' 
                });
            }
        });
    }

    // ===== Toast Notifications =====
    showSuccess(message: string): void {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
    }

    showInfo(message: string): void {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: message });
    }
}
