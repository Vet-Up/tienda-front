import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-c-resgister',
  imports: [FormsModule,RouterLink],
  templateUrl: './c-resgister.html',
  styleUrl: './c-resgister.scss',
})
export class CResgister {
  username: string = '';
  name: string = '';
  email: string = '';
  address: string = '';
  phone: string = '';
  country: string = '';
  profilePicture: string = '';
  birthdate: string = '';
  password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}



  onSubmit(event: Event) {
    event.preventDefault();
    this.error = '';
    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }
    this.loading = true;
    const data: any = {
      username: this.username,
      name: this.name,
      email: this.email,
      address: this.address,
      phone: this.phone,
      country: this.country,
      profilePicture: this.profilePicture,
      birthdate: this.birthdate,
      password: this.password
    };
    this.authService.register(data).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/login'], { state: { registered: true } });
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Error al registrar usuario';
      }
    });
  }
}
