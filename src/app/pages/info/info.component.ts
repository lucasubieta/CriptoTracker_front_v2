import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../../services/coin.service';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  cryptocurrencies: any[] = [];
  loading = true;
  error: string | null = null;
today: string | number | Date | undefined;

  constructor(private cryptoService: CryptoService) {}

  ngOnInit(): void {
    console.log("Cargando información...");
    this.loadCryptocurrencies();
  }
  
  loadCryptocurrencies(): void {
    this.cryptoService.getLatestListings().subscribe({
      next: (response) => {
        console.log(response); // Verifica la respuesta
        this.cryptocurrencies = response.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los datos de criptomonedas';
        this.loading = false;
        console.error(err);
      }
    });
  }
}  
