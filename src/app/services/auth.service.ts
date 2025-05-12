import { Injectable, signal } from '@angular/core';
import { iUsuario } from '../interfaces/iUsuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _usuario = signal<iUsuario | null>(this.cargarUsuarioDesdeLocalStorage()); // Cargamos el usuario si ya existe

  // Getter para acceder al usuario
  get usuarioActual() {
    return this._usuario();
  }

  // Comprobar si el usuario está logueado
  estaLogueado(): boolean {
    return this._usuario() !== null;
  }

  // Login: guardamos el usuario en signal y en localStorage
  login(usuario: iUsuario) {
    this._usuario.set(usuario);
    this.guardarUsuarioEnLocalStorage(usuario);  // Guardar en localStorage
  }

  // Logout: limpiamos el usuario en signal y en localStorage
  logout() {
    this._usuario.set(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('usuario');  // Limpiamos localStorage
    }
  }

  // Función para guardar el usuario en localStorage
  private guardarUsuarioEnLocalStorage(usuario: iUsuario) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('usuario', JSON.stringify(usuario)); // Guardamos como JSON
    }
  }

  // Función para cargar el usuario desde localStorage
  private cargarUsuarioDesdeLocalStorage(): iUsuario | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const usuarioGuardado = localStorage.getItem('usuario');
      return usuarioGuardado ? JSON.parse(usuarioGuardado) : null; // Si existe, lo parseamos y lo devolvemos
    }
    return null; // Si no está disponible localStorage (en SSR), devolvemos null
  }
}
