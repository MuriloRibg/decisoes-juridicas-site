import { Component, inject, OnInit } from "@angular/core";
import { ChartType, GoogleChartsModule } from "angular-google-charts";
import { firstValueFrom } from "rxjs";
import { Neo4jService } from "./services/neo4j.service";
import { HeaderComponent } from "../shared/header/header.component";
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-home",
  imports: [GoogleChartsModule, HeaderComponent, NgxSpinnerModule],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
  standalone: true
})
export class HomeComponent implements OnInit {
  private neo4jService: Neo4jService = inject(Neo4jService);
  private spinner = inject(NgxSpinnerService);

  columnNamesSankey = ["From", "To", "Weight"];
  sankeyData: any[] = [];

  type1 = ChartType.BarChart;
  barData: any[] = [];
  barOptions = {
    hAxis: { title: "Número de Processos" },
    vAxis: { title: "Juízes" },
    legend: "none"
  };

  geoChartType: ChartType = ChartType.GeoChart;
  geoChartData: any[] = [];
  geoChartColumns = ["Estado", "Nº de Advogados"];
  geoChartOptions = {
    region: "BR", // Foca no Brasil
    displayMode: "regions", // Exibe como regiões (estados)
    resolution: "provinces", // Detalhe para estados
    colorAxis: { colors: ["#e0f7fa", "#00796b"] }
  };

  carregandoBar!: boolean;
  carregandoSankey!: boolean;
  carregandoGeo!: boolean;

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      await this.preencherVariaveisGraficoGeoChart();
      await this.preencherVariaveisGraficoBarra();
    } finally {
      this.spinner.hide();
    }
  }

  private async preencherVariaveisGraficoGeoChart(): Promise<void> {
    this.carregandoGeo = true;

    try {
      const response = await firstValueFrom(this.neo4jService.getEstadosAdvogados());
      
      if (response !== null && response !== undefined) {
        const formattedData = response
          .map((item: { state: string; totalAttorneys: any }) => {
            // Garante que o estado não é nulo e tem 2 caracteres (ex: 'BA', 'SP')
            if (item.state && item.state.length === 2) {
              return ["BR-" + item.state.toUpperCase(), item.totalAttorneys];
            }
            return null; // Ignora estados mal formatados ou nulos
          })
          .filter((item: null) => item !== null); // Remove os nulos

        this.geoChartData = formattedData;
      }
    } catch (error) {
      console.error("Erro ao buscar dados do gráfico GeoChart:", error);
    } finally {
      this.carregandoGeo = false;
    }
  }

  private async preencherVariaveisGraficoSankey(): Promise<void> {
    try {
      let graph = await firstValueFrom(this.neo4jService.getGraph());

      if (graph !== null && graph !== undefined) {
        graph.forEach(
          (item: {
            judicialProcess: { distributedTo: string; number: any };
            appellant: { label: any };
            appellee: { label: any };
          }) => {
            // Extrai apenas o ID do relator (última parte da URL)
            const relator = item.judicialProcess.distributedTo.split("/").pop();
            const processo = item.judicialProcess.number;
            const apelante = item.appellant.label;
            const apelado = item.appellee.label;

            // Relator → Processo
            this.sankeyData.push([relator, processo, 1]);
            // Processo → Apelante
            this.sankeyData.push([processo, apelante, 1]);
            // Processo → Apelado
            this.sankeyData.push([processo, apelado, 1]);
          }
        );
      }
    } catch (error) {
      console.error("Erro ao buscar dados do gráfico Sankey:", error);
    } finally {
      this.carregandoSankey = false;
    }
  }

  private async preencherVariaveisGraficoBarra(): Promise<void> {
    this.carregandoBar = true;

    try {
      let response = await firstValueFrom(this.neo4jService.getRedeJuizesProcessos());

      if (response !== null && response !== undefined) {
        const contagem: { [key: string]: number } = {};
        response.links.forEach((link: any) => {
          const juiz = response.nodes.find((n: any) => n.id === link.source)?.label || link.source;
          contagem[juiz] = (contagem[juiz] || 0) + 1;
        });
        // Converter para formato do Google Charts
        this.barData = Object.entries(contagem).map(([juiz, total]) => [juiz, total]);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do gráfico de barra:", error);
    } finally {
      this.carregandoBar = false;
    }
  }
}
