import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CryptoService } from '../../services/coin.service';
import { CryptoTickerComponent } from "../../componentes/crypto-ticker/crypto-ticker.component";
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, CryptoTickerComponent, RouterLink],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent {

}
