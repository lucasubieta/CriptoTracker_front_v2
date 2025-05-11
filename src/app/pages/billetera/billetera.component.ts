import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { iCripto } from '../../interfaces/iCripto'; 
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faEdit, faTrash, faWallet, faSearch } from '@fortawesome/free-solid-svg-icons';
import { CryptoService } from '../../services/coin.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { WalletStateService } from '../../services/wallet-state.service';

@Component({
  selector: 'app-billetera',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, RouterLink],
  templateUrl: './billetera.component.html',
  styleUrls: ['./billetera.component.scss']
})
export class BilleteraComponent implements OnInit {
  criptos: iCripto[] = [];
  form: FormGroup;
  availableCryptos: string[] = [];
  valorBilletera$!: Observable<number>;
  
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
    private fb: FormBuilder,
    private cryptoService: CryptoService,
    private walletState: WalletStateService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, this.validateCrypto.bind(this)]],
      cantidad: [0, [Validators.required, Validators.min(0.000001)]]
    });
  }

  ngOnInit() {
    this.cargarBilletera();
    this.cargarCryptosDisponibles();
    this.valorBilletera$ = this.calcularValorBilletera();
  }

  cargarCryptosDisponibles() {
    this.cryptoService.getLatestListings().subscribe({
      next: () => {
        this.availableCryptos = this.cryptoService.getAvailableCryptos();
        // Forzar validación después de cargar las criptos disponibles
        this.form.get('nombre')?.updateValueAndValidity();
      },
      error: (err) => console.error('Error al cargar criptomonedas disponibles', err)
    });
  }

  validateCrypto(control: any): {[key: string]: any} | null {
    if (!control.value) return null;
    const symbol = control.value.toUpperCase();
    if (this.availableCryptos.length > 0 && !this.cryptoService.isCryptoAvailable(symbol)) {
      return { 'invalidCrypto': true };
    }
    return null;
  }

  cargarBilletera() {
    const user = this.auth.usuarioActual!;
    this.api.obtenerBilletera(user).subscribe({
      next: (data) => {
        this.criptos = data;
        // Recalcular el valor cuando se actualiza la billetera
        this.valorBilletera$ = this.calcularValorBilletera();
      },
      error: (err) => this.error = 'Error al cargar la billetera'
    });
  }

  calcularValorBilletera(): Observable<number> {
    return this.cryptoService.getLatestListings().pipe(
      map((response: any) => {
        let total = 0;
        const prices: {[key: string]: number} = {};
        
        response.data.forEach((crypto: any) => {
          prices[crypto.symbol] = crypto.quote.USD.price;
        });
        
        this.criptos.forEach(cripto => {
          const symbol = cripto.nombre.toUpperCase();
          if (prices[symbol]) {
            total += cripto.cantidad * prices[symbol];
          }
        });
        
        // Actualizar el servicio compartido
        this.walletState.updateWalletValue(total);
        return total;
      })
    );
  }

  agregar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.auth.usuarioActual!;
    const cripto = this.form.value as iCripto;
    
    if (!this.cryptoService.isCryptoAvailable(cripto.nombre.toUpperCase())) {
      this.error = 'La criptomoneda no está disponible';
      return;
    }
    
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