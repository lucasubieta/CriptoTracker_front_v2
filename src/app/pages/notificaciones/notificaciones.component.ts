import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notificaciones.service';
import { ApiService } from '../../services/api.service';
import { iCripto } from '../../interfaces/iCripto';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss']
})
export class NotificacionesComponent implements OnInit {
  Notificacionesform: FormGroup;
  mensaje: string = '';
  error: string = '';
  isSubmitting: boolean = false;
  currentUsername: string = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private notificationService: NotificationService,
    private api: ApiService
  ) {
    this.currentUsername = this.auth.usuarioActual?.nombre || '';
    this.Notificacionesform = this.fb.group({
      tipo: ['DIARIO', Validators.required],
      email: [this.auth.usuarioActual?.correo || '', [Validators.required, Validators.email]],
      umbral: [0, [Validators.required, Validators.min(0.000001)]],
      mensajePersonalizado: ['']
    });
  }

  ngOnInit(): void {
    this.cargarConfiguracionExistente();
  }

  cargarConfiguracionExistente() {
    this.notificationService.getConfig(this.currentUsername).subscribe({
      next: (config) => {
        if (config) {
          this.Notificacionesform.patchValue({
            tipo: config.tipo,
            email: config.email,
            umbral: config.umbral,
            mensajePersonalizado: config.mensajePersonalizado
          });
        }
      },
      error: (err) => {
        console.error('Error al cargar configuración:', err);
      }
    });
  }

  // notificaciones.component.ts

handleSubmit() {
  if (this.Notificacionesform.invalid) {
    this.Notificacionesform.markAllAsTouched();
    this.error = 'Por favor completa todos los campos requeridos';
    return;
  }

  this.isSubmitting = true;
  this.error = '';
  this.mensaje = '';

  // 1) Primero, carga tu billetera del backend
  this.api.obtenerBilletera(this.currentUsername).subscribe({
    next: (wallet) => {
      // 2) Construye el payload incluyendo la billetera
      const payload = {
        nombreUsuario: this.currentUsername,
        tipo: this.Notificacionesform.value.tipo,
        email: this.Notificacionesform.value.email,
        umbral: this.Notificacionesform.value.umbral,
        mensajePersonalizado: this.Notificacionesform.value.mensajePersonalizado,
        billetera: wallet.map(c => ({
          nombre: c.nombre,
          cantidad: c.cantidad
        }))
      };

      // 3) Llama al servicio de notificaciones
      this.notificationService.saveConfig(payload).subscribe({
        next: (response) => {
          this.mensaje = '✅ Configuración guardada correctamente';
          this.isSubmitting = false;
        },
        error: (err) => {
          console.error('Error:', err);
          this.error = err.error?.message || err.message || 'Error al guardar la configuración';
          this.isSubmitting = false;
        }
      });
    },
    error: (err) => {
      console.error('No pude cargar la billetera:', err);
      this.error = 'No pude cargar la billetera, inténtalo más tarde';
      this.isSubmitting = false;
    }
  });
}

}