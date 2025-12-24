import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromoBannerService, PromoBannerSettings } from '../../services/promo-banner.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-promo-modal',
  templateUrl: './promo-modal.component.html',
  styleUrls: ['./promo-modal.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class PromoModalComponent implements OnInit, OnDestroy {
  isVisible = false;
  countdown = 15; // Countdown from 15 seconds
  showCloseButton = false; // Close button only shows after countdown
  
  // Banner settings from service
  settings: PromoBannerSettings;
  
  private timer: any;
  private countdownInterval: any;
  private settingsSubscription?: Subscription;
  private previewSubscription?: Subscription;
  private readonly MODAL_SHOWN_KEY = 'promoModalShown';

  constructor(private bannerService: PromoBannerService) {
    // Load initial settings
    this.settings = this.bannerService.getSettings();
  }

  ngOnInit() {
    // Subscribe to settings changes
    this.settingsSubscription = this.bannerService.settings$.subscribe(settings => {
      this.settings = settings;
      this.countdown = settings.countdownDuration;
    });

    // Subscribe to preview trigger
    this.previewSubscription = this.bannerService.preview$.subscribe(() => {
      // Clear session storage and show banner immediately
      sessionStorage.removeItem(this.MODAL_SHOWN_KEY);
      this.showModal();
    });

    // Check if modal was already shown in this session
    const wasShown = sessionStorage.getItem(this.MODAL_SHOWN_KEY);
    
    // Only show if enabled and not already shown
    if (!wasShown && this.settings.enabled) {
      // Show modal immediately (no delay before showing)
      this.showModal();
    }
  }

  ngOnDestroy() {
    // Clean up timers if component is destroyed
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
    if (this.previewSubscription) {
      this.previewSubscription.unsubscribe();
    }
  }

  showModal() {
    this.isVisible = true;
    this.countdown = this.settings.countdownDuration;
    this.showCloseButton = false;
    
    // Mark modal as shown in session storage
    sessionStorage.setItem(this.MODAL_SHOWN_KEY, 'true');
    
    // Start countdown timer
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      
      if (this.countdown <= 0) {
        // Countdown finished, show close button
        this.showCloseButton = true;
        clearInterval(this.countdownInterval);
      }
    }, 1000); // Update every second
  }

  closeModal() {
    this.isVisible = false;
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}
