import { AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class HomeComponent implements AfterViewInit {
  isLoggedIn = false;
  @ViewChild('glasses', { static: true }) glassesElm!: ElementRef<HTMLImageElement>;
  @ViewChildren('featureCard') featureCards!: QueryList<ElementRef>;
  @ViewChildren('card') cards!: QueryList<ElementRef>;

  constructor(
    private hostRef: ElementRef,
    private authService: AuthService,
    private router: Router
  ) {
    gsap.registerPlugin(ScrollTrigger);
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.authStateChange.subscribe(
      (loggedIn: boolean) => this.isLoggedIn = loggedIn
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  ngAfterViewInit(): void {
    // floating glasses animation
    gsap.to(this.glassesElm.nativeElement, {
      y: -12,
      duration: 3.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    // features entrance stagger
    const features = this.hostRef.nativeElement.querySelectorAll('.feature');
    gsap.from(features, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out'
    });

    // cards scroll animation
    const cards = this.hostRef.nativeElement.querySelectorAll('.card');
    gsap.from(cards, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: this.hostRef.nativeElement.querySelector('.showcase'),
        start: 'top 80%'
      }
    });

    // simple carousel autoplay
    const slides = Array.from(this.hostRef.nativeElement.querySelectorAll('#heroCarousel .slide')) as HTMLElement[];
    // replace interval with GSAP timeline for smooth crossfades and sync with other animations
    const slideTl = gsap.timeline({ repeat: -1, repeatDelay: 0.6 });
    slides.forEach((s, i) => {
      // ensure starting state
      gsap.set(s, { autoAlpha: 0, scale: 0.98 });
      // reveal
      slideTl.to(s, { autoAlpha: 1, scale: 1, duration: 0.8, ease: 'power2.out' });
      // hold on screen
      slideTl.to(s, { duration: 1.6 });
      // hide
      slideTl.to(s, { autoAlpha: 0, scale: 0.98, duration: 0.6, ease: 'power3.in' });
    });

    // subtle parallax on mouse move
    const hero = this.hostRef.nativeElement.querySelector('.hero-visual');
    window.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(this.glassesElm.nativeElement, { x: relX * 8, y: -12 + relY * 8, duration: 0.8, ease: 'power2.out' });
    });

    // hero copy entrance
    gsap.from(this.hostRef.nativeElement.querySelectorAll('.hero-copy h1, .hero-copy p, .hero-ctas'), {
      y: 24,
      opacity: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: 'power2.out'
    });

    // gentle blob rotation to feel organic
    const blob1 = this.hostRef.nativeElement.querySelector('.blob-1');
    const blob2 = this.hostRef.nativeElement.querySelector('.blob-2');
    gsap.to(blob1, { rotation: 6, duration: 6, yoyo: true, repeat: -1, transformOrigin: '50% 50%', ease: 'sine.inOut' });
    gsap.to(blob2, { rotation: -6, duration: 7.5, yoyo: true, repeat: -1, transformOrigin: '50% 50%', ease: 'sine.inOut' });
  }

}
