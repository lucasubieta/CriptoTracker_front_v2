import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../../services/coin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  cryptocurrencies: any[] = [];
  filteredCryptos: any[] = [];
  searchTerm: string = '';
  loading = true;
  error: string | null = null;
  today = new Date();

  constructor(private cryptoService: CryptoService) {}

  ngOnInit(): void {
    this.loadCryptocurrencies();
  }

  loadCryptocurrencies(): void {
    this.loading = true;
    this.cryptoService.getLatestListings().subscribe({
      next: (response) => {
        this.cryptocurrencies = response.data;
        this.filteredCryptos = [...response.data];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los datos';
        this.loading = false;
        console.error(err);
      }
    });
  }

  filterCryptos(): void {
    if (!this.searchTerm) {
      this.filteredCryptos = [...this.cryptocurrencies];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredCryptos = this.cryptocurrencies.filter(crypto => 
      crypto.name.toLowerCase().includes(term) || 
      crypto.symbol.toLowerCase().includes(term)
    );
  }
}