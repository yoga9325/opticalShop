import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(false);
  public darkMode$ = this.darkModeSubject.asObservable();

  constructor() {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.enableDarkMode();
    } else {
      this.disableDarkMode();
    }
  }

  toggleTheme() {
    if (this.darkModeSubject.value) {
      this.disableDarkMode();
    } else {
      this.enableDarkMode();
    }
  }

  enableDarkMode() {
    document.body.classList.add('dark-mode');
    this.darkModeSubject.next(true);
    localStorage.setItem('theme', 'dark');
  }

  disableDarkMode() {
    document.body.classList.remove('dark-mode');
    this.darkModeSubject.next(false);
    localStorage.setItem('theme', 'light');
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }
}