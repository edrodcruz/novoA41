import { Component, inject } from '@angular/core';
import { TotvsService } from 'src/app/services/totvs-service.service';

@Component({
  selector: 'app-resumofinal',
  standalone: true,
  imports: [],
  templateUrl: './resumofinal.component.html',
  styleUrl: './resumofinal.component.css'
})
export class ResumofinalComponent {
  private srvTotvs = inject(TotvsService)

  ngOnInit(): void {
    this.srvTotvs.EmitirParametros({ tituloTela: 'HTMLA41 - RESUMO FINAL DO PROCESSO'});

  }

}
