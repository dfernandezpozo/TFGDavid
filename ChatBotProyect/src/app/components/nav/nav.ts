import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './nav.html',
  styleUrl: './nav.css'  
})
export class Nav {
  isScrolled = false;
  menuOpen   = false;

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 10;
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}