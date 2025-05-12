import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})

export class RegistroComponent {
  form: FormGroup;
  mensaje = '';
  error = '';

  constructor(
    private fb: FormBuilder, 
    private api: ApiService, 
    private router: Router
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContraseña: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('contraseña')?.value;
    const confirmPassword = control.get('confirmarContraseña')?.value;

    if (password !== confirmPassword) {
      control.get('confirmarContraseña')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  registrar() {
    if (this.form.invalid) {
      this.error = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    const { nombre, contraseña, correo } = this.form.value;
    
    this.api.registrarUsuario({ nombre, contraseña, correo }).subscribe({
      next: (msg) => {
        this.mensaje = msg;
        this.error = '';
        this.form.reset();
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        this.error = err.error || 'Error al registrar usuario. Por favor intenta con otro nombre de usuario.';
        this.mensaje = '';
        this.form.get('contraseña')?.reset();
        this.form.get('confirmarContraseña')?.reset();
      }
    });
  }
}