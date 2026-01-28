import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MotionDirective } from '../../ui/motion.directive';

@Component({
  selector: 'app-c-landingpage',
  imports: [RouterLink, MotionDirective],
  templateUrl: './c-landingpage.html',
  styleUrl: './c-landingpage.scss',
})
export class CLandingpage {}
