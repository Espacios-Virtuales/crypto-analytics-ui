import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CryptoRevealDirective } from '../../shared/directives/crypto-reveal.directive';

@Component({
  selector: 'app-public-landing',
  standalone: true,
  imports: [RouterLink, CryptoRevealDirective],
  templateUrl: './public-landing.component.html',
  styleUrl: './public-landing.component.scss',
})
export class PublicLandingComponent {}
