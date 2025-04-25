import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { iCripto } from '../../interfaces/iCripto'; 
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faEdit, faTrash, faWallet, faSearch } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-billetera',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './billetera.component.html',
  styleUrls: ['./billetera.component.scss']
})
export class BilleteraComponent implements OnInit {
  criptos: iCripto[] = [];
  form: FormGroup;
  
  mensaje = '';
  error = '';

  // Iconos
  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faWallet = faWallet;
  faSearch = faSearch;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      cantidad: [0, [Validators.required, Validators.min(0.000001)]]
    });
  }

  ngOnInit() {
    this.cargarBilletera();
  }

  cargarBilletera() {
    const user = this.auth.usuarioActual!;
    this.api.obtenerBilletera(user).subscribe({
      next: (data) => this.criptos = data,
      error: (err) => this.error = 'Error al cargar la billetera'
    });
  }

  agregar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.auth.usuarioActual!;
    const cripto = this.form.value as iCripto;
    
    this.api.agregarCripto(user, cripto).subscribe({
      next: (msg) => {
        this.mensaje = msg;
        this.error = '';
        this.form.reset({ cantidad: 0 });
        this.cargarBilletera();
      },
      error: (err) => {
        this.error = err.error || 'Error al agregar criptomoneda';
        this.mensaje = '';
      }
    });
  }

  modificar(cripto: iCripto) {
    const nuevaCantidad = prompt(`Modificar cantidad de ${cripto.nombre}`, cripto.cantidad.toString());
    if (nuevaCantidad === null || isNaN(Number(nuevaCantidad))) return;

    const user = this.auth.usuarioActual!;
    const criptoActualizada = { nombre: cripto.nombre, cantidad: Number(nuevaCantidad) };

    this.api.modificarCripto(user, criptoActualizada).subscribe({
      next: (msg) => {
        this.mensaje = msg;
        this.error = '';
        this.cargarBilletera();
      },
      error: (err) => {
        this.error = err.error || 'Error al modificar criptomoneda';
        this.mensaje = '';
      }
    });
  }

  eliminar(nombre: string) {
    if (!confirm(`¿Estás seguro de eliminar ${nombre} de tu billetera?`)) return;

    const user = this.auth.usuarioActual!;
    this.api.eliminarCripto(user, nombre).subscribe({
      next: (msg) => {
        this.mensaje = msg;
        this.error = '';
        this.cargarBilletera();
      },
      error: (err) => {
        this.error = err.error || 'Error al eliminar criptomoneda';
        this.mensaje = '';
      }
    });
  }
}