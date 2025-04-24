import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { iCripto } from '../../interfaces/iCripto'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-billetera',
  templateUrl: './billetera.component.html',
  imports: [CommonModule, ReactiveFormsModule]
})
export class BilleteraComponent implements OnInit {
  criptos: iCripto[] = [];
  form: FormGroup;  // Declaración sin inicialización
  
  mensaje = '';
  error = '';

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private fb: FormBuilder
  ) {
    // Inicialización en el constructor
    this.form = this.fb.group({
      nombre: '',
      cantidad: 0
    });
  }

  ngOnInit() {
    this.cargarBilletera();
  }

  cargarBilletera() {
    const user = this.auth.usuarioActual!;
    this.api.obtenerBilletera(user).subscribe(data => this.criptos = data);
  }

  agregar() {
    const user = this.auth.usuarioActual!;
    const cripto = this.form.value as iCripto;
    this.api.agregarCripto(user, cripto).subscribe({
      next: msg => {
        this.mensaje = msg;
        this.form.reset();
        this.cargarBilletera();
      },
      error: err => this.error = 'Error al agregar'
    });
  }

  modificar(cripto: iCripto) {
    const user = this.auth.usuarioActual!;
    const nuevaCantidad = prompt(`Modificar cantidad de ${cripto.nombre}`, cripto.cantidad.toString());
    if (nuevaCantidad === null) return;

    this.api.modificarCripto(user, { nombre: cripto.nombre, cantidad: Number(nuevaCantidad) }).subscribe({
      next: msg => {
        this.mensaje = msg;
        this.cargarBilletera();
      },
      error: err => this.error = 'Error al modificar'
    });
  }

  eliminar(nombre: string) {
    const user = this.auth.usuarioActual!;
    if (!confirm(`¿Eliminar ${nombre}?`)) return;

    this.api.eliminarCripto(user, nombre).subscribe({
      next: msg => {
        this.mensaje = msg;
        this.cargarBilletera();
      },
      error: err => this.error = 'Error al eliminar'
    });
  }
}