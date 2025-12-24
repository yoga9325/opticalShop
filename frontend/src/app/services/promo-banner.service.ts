import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface PromoBannerSettings {
  id?: number;
  enabled: boolean;
  title: string;
  subtitle: string;
  features: string[];
  countdownDuration: number; // in seconds
  icon: string; // Bootstrap icon class (e.g., 'bi-phone-fill', 'bi-gift-fill')
}

// Backend DTO interface
interface PromoBannerSettingsDTO {
  id?: number;
  enabled: boolean;
  title: string;
  subtitle: string;
  features: string; // JSON string in backend
  countdownDuration: number;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class PromoBannerService {
  private apiUrl = environment.apiUrl;
  
  // Default settings (fallback)
  private defaultSettings: PromoBannerSettings = {
    enabled: true,
    title: 'Optical Shop Mobile App',
    subtitle: 'Get ready for a seamless shopping experience right at your fingertips!',
    features: [
      'Browse products on the go',
      'Book eye tests instantly',
      'Exclusive app-only deals',
      'Virtual try-on feature'
    ],
    countdownDuration: 15,
    icon: 'bi-phone-fill'
  };

  private settingsSubject: BehaviorSubject<PromoBannerSettings>;
  public settings$: Observable<PromoBannerSettings>;
  
  // Preview trigger
  private previewTrigger = new Subject<void>();
  public preview$ = this.previewTrigger.asObservable();

  constructor(private http: HttpClient) {
    // Initialize with default settings
    this.settingsSubject = new BehaviorSubject<PromoBannerSettings>(this.defaultSettings);
    this.settings$ = this.settingsSubject.asObservable();
    
    // Load settings from API
    this.loadSettingsFromAPI();
  }

  /**
   * Load settings from API
   */
  private loadSettingsFromAPI(): void {
    this.http.get<PromoBannerSettingsDTO>(`${this.apiUrl}/banner-settings`)
      .subscribe({
        next: (dto) => {
          const settings = this.dtoToSettings(dto);
          this.settingsSubject.next(settings);
        },
        error: (error) => {
          console.error('Error loading banner settings from API:', error);
          // Keep using default settings on error
        }
      });
  }

  /**
   * Convert DTO to Settings (parse JSON features)
   */
  private dtoToSettings(dto: PromoBannerSettingsDTO): PromoBannerSettings {
    return {
      id: dto.id,
      enabled: dto.enabled,
      title: dto.title,
      subtitle: dto.subtitle,
      features: JSON.parse(dto.features),
      countdownDuration: dto.countdownDuration,
      icon: dto.icon
    };
  }

  /**
   * Convert Settings to DTO (stringify features)
   */
  private settingsToDTO(settings: PromoBannerSettings): PromoBannerSettingsDTO {
    return {
      id: settings.id,
      enabled: settings.enabled,
      title: settings.title,
      subtitle: settings.subtitle,
      features: JSON.stringify(settings.features),
      countdownDuration: settings.countdownDuration,
      icon: settings.icon
    };
  }

  /**
   * Get current settings
   */
  getSettings(): PromoBannerSettings {
    return this.settingsSubject.value;
  }

  /**
   * Update settings and save to database via API
   */
  updateSettings(settings: PromoBannerSettings): Observable<PromoBannerSettings> {
    const dto = this.settingsToDTO(settings);
    
    return this.http.put<PromoBannerSettingsDTO>(`${this.apiUrl}/admin/banner-settings`, dto)
      .pipe(
        map((responseDto) => {
          const updatedSettings = this.dtoToSettings(responseDto);
          this.settingsSubject.next(updatedSettings);
          return updatedSettings;
        })
      );
  }

  /**
   * Reset settings to defaults
   */
  resetToDefaults(): Observable<PromoBannerSettings> {
    return this.updateSettings({ ...this.defaultSettings });
  }

  /**
   * Check if banner is enabled
   */
  isEnabled(): boolean {
    return this.settingsSubject.value.enabled;
  }

  /**
   * Enable or disable banner
   */
  setEnabled(enabled: boolean): Observable<PromoBannerSettings> {
    const currentSettings = this.getSettings();
    return this.updateSettings({ ...currentSettings, enabled });
  }
  
  /**
   * Trigger preview - emit event to show banner
   */
  triggerPreview(): void {
    this.previewTrigger.next();
  }
}
