import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule
  ],
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss']
})

export class NotificacionesComponent implements OnInit {
  Notificacionesform: FormGroup; 

  constructor(private fb: FormBuilder, private auth: AuthService) {
    
    this.Notificacionesform = this.fb.group({
      tipo: [''],
      usuario: [auth.usuarioActual],
      email: [''],
      umbral: ['', [Validators.required]],
      mensajePersonalizado: ['']
    }
    );
  }

  ngOnInit(): void {
    
  }


  handleSubmit(){
    console.log(this.Notificacionesform.value)
  }

}
