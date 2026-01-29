import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  standalone: true,
  styleUrl: './toast.component.scss'
})
export class ToastComponent implements OnInit {
  @Input() message: string = '';
  @Input() duration: number = 3000;
  visible = false;

  ngOnInit() {
    this.visible = true;
    setTimeout(() => this.visible = false, this.duration);
  }
}
