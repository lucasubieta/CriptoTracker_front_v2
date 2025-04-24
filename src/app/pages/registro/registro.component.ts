import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent {
  form: FormGroup;
  mensaje = '';
  error = '';

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  registrar() {
    if (this.form.invalid) {
      this.error = 'Por favor, completa todos los campos correctamente.';
      return;
    }

    const datos = this.form.value;
    this.api.registrarUsuario(datos).subscribe({
      next: (msg) => {
        this.mensaje = msg;
        this.error = '';
        this.form.reset();
        this.router.navigate(['/login']);
        alert('Usuario registrado con éxito. Puedes iniciar sesión ahora.');
      },
      error: (err) => {
        this.error = err.error || 'Error al registrar usuario.';
        this.mensaje = '';
      }
    });
  }
}