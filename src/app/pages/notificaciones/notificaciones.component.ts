import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../services/notificaciones.service';
import { AuthService } from '../../services/auth.service';
import { WalletStateService } from '../../services/wallet-state.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSave, faPaperPlane, faBell, faWallet } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DecimalPipe,
    FontAwesomeModule
  ],
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss']
})
export class NotificacionesComponent implements OnInit {
  notificationForm: FormGroup;
  frecuenciaOptions = ['DIARIO', 'SEMANAL', 'MENSUAL'];
  currentWalletValue: number = 0;
  message: string = '';
  error: string = '';
  
  // Iconos
  faSave = faSave;
  faPaperPlane = faPaperPlane;
  faBell = faBell;
  faWallet = faWallet;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private authService: AuthService,
    private walletState: WalletStateService
  ) {
    this.notificationForm = this.fb.group({
      nombreUsuario: [this.authService.usuarioActual || '', Validators.required],
      frecuencia: ['DIARIO', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      umbral: ['', [Validators.required, Validators.min(0)]],
      mensaje: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadWalletValue();
    this.loadUserConfig();
  }

  loadWalletValue(): void {
    this.walletState.getWalletValue().subscribe({
      next: (value) => this.currentWalletValue = value,
      error: (err) => {
        console.error('Error cargando valor de billetera:', err);
        this.error = 'Error al cargar el valor actual';
      }
    });
  }

  loadUserConfig(): void {
    const nombreUsuario = this.authService.usuarioActual;
    if (!nombreUsuario) {
      this.error = 'Usuario no identificado';
      return;
    }

    this.notificationService.getConfig(nombreUsuario).subscribe({
      next: (config) => {
        if (config) {
          this.notificationForm.patchValue({
            frecuencia: config.tipo,
            email: config.email,
            umbral: config.umbral,
            mensaje: config.mensajePersonalizado
          });
        }
      },
      error: (err) => {
        console.error('Error cargando configuración:', err);
        this.error = 'Error al cargar configuración';
      }
    });
  }

  saveConfig(): void {
    if (this.notificationForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const nombreUsuario = this.authService.usuarioActual;
    if (!nombreUsuario) {
      this.error = 'Usuario no identificado';
      return;
    }

    const configData = {
      nombreUsuario: nombreUsuario,
      ...this.notificationForm.value,
      umbral: Number(this.notificationForm.value.umbral)
    };

    this.notificationService.saveConfig(configData).subscribe({
      next: () => {
        this.message = 'Configuración guardada correctamente';
        this.error = '';
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        console.error('Error guardando configuración:', err);
        this.error = 'Error al guardar la configuración';
        this.message = '';
      }
    });
  }

  sendTest(): void {
    const nombreUsuario = this.authService.usuarioActual;
    if (!nombreUsuario) {
      this.error = 'Usuario no identificado';
      return;
    }

    this.notificationService.sendTestNotification(nombreUsuario).subscribe({
      next: () => {
        this.message = 'Notificación de prueba enviada';
        this.error = '';
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        console.error('Error enviando prueba:', err);
        this.error = 'Error al enviar notificación de prueba';
        this.message = '';
      }
    });
  }

  private markAllAsTouched(): void {
    Object.values(this.notificationForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}