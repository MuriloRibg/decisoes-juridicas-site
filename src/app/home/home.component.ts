import { Component, inject, OnInit } from "@angular/core";
import { GoogleChartsModule } from "angular-google-charts";
import { firstValueFrom } from "rxjs";
import { Neo4jService } from "./services/neo4j.service";
import { HeaderComponent } from "../shared/header/header.component";
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { GraficoMapaComponent } from "src/app/home/components/grafico-mapa/grafico-mapa.component";
import { GraficoBarraComponent } from "src/app/home/components/grafico-barra/grafico-barra.component";
import { GraficoPizzaComponent } from "src/app/home/components/grafico-pizza/grafico-pizza.component";

@Component({
  selector: "app-home",
  imports: [
    GoogleChartsModule,
    HeaderComponent,
    NgxSpinnerModule,
    GraficoMapaComponent,
    GraficoBarraComponent,
    GraficoPizzaComponent
  ],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
  standalone: true
})
export class HomeComponent implements OnInit {
  private neo4jService: Neo4jService = inject(Neo4jService);
  private spinner = inject(NgxSpinnerService);

  carregandoBar!: boolean;
  carregandoPizza!: boolean;
  carregandoGeo!: boolean;

  dadosBarra: any[] = [];
  dadosMapa: any[] = [];
  dadosPizza: any[] = [];

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      await this.preencherVariaveisGraficoGeoChart();
      await this.preencherVariaveisGraficoBarra();
      await this.preencherVariaveisGraficoPizza();
    } finally {
      this.spinner.hide();
    }
  }
  private async preencherVariaveisGraficoPizza(): Promise<void> {
    this.carregandoPizza = true;

    try {
      const response = await firstValueFrom(this.neo4jService.getQuantidadeProcessosPorJuiz());

      if (response !== null && response !== undefined) {
        this.dadosPizza = response.map((item: { judgeName: any; totalProcesses: any }) => {
          // Capitaliza cada palavra e limita a 3 palavras
          let words = (item.judgeName || "")
            .split(" ")
            .filter((w: string) => w.trim().length > 0)
            .slice(0, 3)
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

          // Remove o último nome se ele tiver duas letras
          if (words.length > 1 && words[words.length - 1].length === 2) {
            words.pop();
          }

          const name = words.join(" ");
          return [name, item.totalProcesses];
        });
      }
    } catch (error) {
      console.error("Erro ao buscar dados do gráfico de pizza:", error);
    } finally {
      this.carregandoPizza = false;
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

        this.dadosMapa = formattedData;
      }
    } catch (error) {
      console.error("Erro ao buscar dados do gráfico GeoChart:", error);
    } finally {
      this.carregandoGeo = false;
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
        this.dadosBarra = Object.entries(contagem).map(([juiz, total]) => {
           // Capitaliza cada palavra e limita a 3 palavras
          let words = (juiz|| "")
            .split(" ")
            .filter((w: string) => w.trim().length > 0)
            .slice(0, 3)
            .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

          // Remove o último nome se ele tiver duas letras
          if (words.length > 1 && words[words.length - 1].length === 2) {
            words.pop();
          }

          const name = words.join(" ");
          return [name, total];
        });
      }
    } catch (error) {
      console.error("Erro ao buscar dados do gráfico de barra:", error);
    } finally {
      this.carregandoBar = false;
    }
  }
}
