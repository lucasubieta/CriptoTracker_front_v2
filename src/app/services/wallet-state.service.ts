import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalletStateService {
  private walletValueSubject = new BehaviorSubject<number>(0);
  
  constructor() {}

  // Actualizar el valor de la billetera
  updateWalletValue(value: number): void {
    this.walletValueSubject.next(value);
  }

  // Obtener el valor actual de la billetera
  getWalletValue(): Observable<number> {
    return this.walletValueSubject.asObservable();
  }
}
