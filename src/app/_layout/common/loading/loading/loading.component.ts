import { Component, Input, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgClass, NgIf } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    MatProgressBarModule,
    NgClass,
    NgIf
  ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
  animations: [
    trigger('overlayAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class LoadingComponent implements OnInit {
  @Input() message: string = "";
  @Input() type: 'spinner' | 'bar' = 'spinner';
  @Input() showLogo: boolean = true;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() theme: 'light' | 'dark' = 'light';

  ngOnInit(): void {
    if (this.showLogo) {
      const img = new Image();
      img.src = 'assets/img/logo.png';
    }
  }
}