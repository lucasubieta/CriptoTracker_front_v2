import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { BilleteraComponent } from './pages/billetera/billetera.component';
import { LoginComponent } from './pages/login/login.component';
import { InfoComponent } from './pages/info/info.component';
import { NotificacionesComponent } from './pages/notificaciones/notificaciones.component';
import { RegistroComponent } from './pages/registro/registro.component';


export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'billetera', component: BilleteraComponent },
  { path: 'informacion', component: InfoComponent },
  { path: 'notificaciones', component: NotificacionesComponent },
  { path: 'registro', component: RegistroComponent}
];
