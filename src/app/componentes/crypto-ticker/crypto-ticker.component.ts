import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CryptoService } from '../../services/coin.service';

@Component({
  selector: 'app-crypto-ticker',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './crypto-ticker.component.html',
  styleUrls: ['./crypto-ticker.component.scss']
})
export class CryptoTickerComponent implements OnInit {
  cryptocurrencies: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(private cryptoService: CryptoService) {}

  ngOnInit(): void {
    this.loadCryptocurrencies();
  }

  loadCryptocurrencies(): void {
    this.cryptoService.getLatestListings().subscribe({
      next: (response) => {
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

  trackByCryptoId(index: number, crypto: any): number {
    return crypto.id;
  }
}