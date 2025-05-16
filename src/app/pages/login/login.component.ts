import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { iUsuario } from '../../interfaces/iUsuario';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup; // FormGroup para manejar el formulario de inicio de sesión

  mensaje = '';

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {

    this.form = this.fb.group({
      nombre: ['', Validators.required],
      contraseña: ['', Validators.required]
    });
  }

  login() {
    if (this.form.invalid) {
      this.mensaje = 'Por favor completa todos los campos';
      return;
    }
  
    const { nombre, contraseña } = this.form.value;
    this.api.login(nombre!, contraseña!).subscribe({
      next: (usuario: iUsuario) => { // <--- Recibir el objeto usuario completo
        this.auth.login(usuario); // <--- Pasar el objeto completo al AuthService
        this.router.navigate(['/billetera']);
      },
      error: () => {
        this.mensaje = 'Usuario o contraseña incorrectos';
        this.form.controls['contraseña'].reset();
      }
    });
  }}