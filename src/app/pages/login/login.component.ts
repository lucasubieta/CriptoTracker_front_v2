import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  form; // Declaramos la propiedad sin inicializar

  mensaje = '';

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {
    // Inicializamos en el constructor
    this.form = this.fb.group({
      nombre: '',
      contraseña: ''
    });
  }

  login() {
    const { nombre, contraseña } = this.form.value!;
    this.api.login(nombre!, contraseña!).subscribe({
      next: () => {
        this.auth.login(nombre!);
        this.router.navigate(['/billetera']);
      },
      error: () => this.mensaje = 'Usuario o contraseña incorrectos'
    });
  }
}