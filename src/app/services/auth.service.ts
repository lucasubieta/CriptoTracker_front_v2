import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _usuario = signal<string | null>(null);

  get usuarioActual() {
    return this._usuario();
  }

  estaLogueado(): boolean {
    return this._usuario() !== null;
  }

  login(nombre: string) {
    this._usuario.set(nombre);
  }

  logout() {
    this._usuario.set(null);
  }
}