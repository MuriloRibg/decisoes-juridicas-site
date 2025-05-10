import { Component, inject, OnInit } from '@angular/core';
import { ChartType, GoogleChartsModule } from 'angular-google-charts';
import { firstValueFrom } from 'rxjs';
import { Neo4jService } from './services/neo4j.service';
import { HeaderComponent } from "../shared/header/header.component";

@Component({
  selector: 'app-home',
  imports: [GoogleChartsModule, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
})
export class HomeComponent implements OnInit {
  private neo4jService: Neo4jService = inject(Neo4jService);

  type = ChartType.Sankey;
  sankeyData: any[] = [];
  sankeyOptions = {};

  type1 = ChartType.BarChart;
  barData: any[] = [];
  barOptions = {
    hAxis: { title: 'Número de Processos' },
    vAxis: { title: 'Juízes' },
    legend: 'none',
  };

  async ngOnInit(): Promise<void> {
    let response = await firstValueFrom(
      this.neo4jService.getRedeJuizesProcessos()
    );

    if (response !== null && response !== undefined) {
      this.sankeyData = response.links.map(
        (link: { source: any; target: any }) => {
          const juiz =
            response.nodes.find((n: any) => n.id === link.source)?.label ||
            link.source;
          const processo =
            response.nodes.find((n: any) => n.id === link.target)?.label ||
            link.target;
          return [juiz, processo, 1]; // [De, Para, Peso]
        }
      );

      const contagem: { [key: string]: number } = {};
      response.links.forEach((link: any) => {
        const juiz =
          response.nodes.find((n: any) => n.id === link.source)?.label ||
          link.source;
        contagem[juiz] = (contagem[juiz] || 0) + 1;
      });
      // Converter para formato do Google Charts
      this.barData = Object.entries(contagem).map(([juiz, total]) => [
        juiz,
        total,
      ]);
    }
  }
}
