import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService, ILoginResponse } from '../../../core/services/auth-service';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../../ui/toast/toast.component';

@Component({
  selector: 'app-c-login',
  imports: [FormsModule,RouterLink,ToastComponent],
  templateUrl: './c-login.html',
  styleUrl: './c-login.scss',
})
export class CLogin {

  username: string = '';
  password: string = '';
  loading: boolean = false;
  error: string = '';
  showToast: boolean = false;
  toastMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {
    if (history.state && history.state['registered']) {
      this.toastMessage = 'Usuario registrado correctamente, inicia sesión';
      this.showToast = true;
      setTimeout(() => this.showToast = false, 4500);
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();

    this.loading = true;
    this.authService.login(this.username, this.password).subscribe({
      next: (response: ILoginResponse) => {
        console.log('Login exitoso:', response);
        this.authService.validateToken(response.token).subscribe({
          next: (user) => {
            if (user) {
              this.authService.setUser(user);
              this.router.navigate(['/main']);
            } else {
              this.error = 'Error al obtener datos del usuario';
              this.loading = false;
            }
          },
          error: (error) => {
            console.error('Error al validar token:', error);
            this.loading = false;
          },
        });
      },
      error: (error: any) => {
        this.error = 'Error de login: credenciales incorrectas o usuario no encontrado';
        console.error('Error de login:', error);
        this.loading = false;
      },
    });
  }
}
