import { Component, Input } from "@angular/core";
import { ChartType, GoogleChartsModule } from "angular-google-charts";

@Component({
  selector: "app-grafico-mapa",
  imports: [GoogleChartsModule],
  templateUrl: "./grafico-mapa.component.html",
  styleUrl: "./grafico-mapa.component.css"
})
export class GraficoMapaComponent {
  @Input() dados: any[] = [];

  geoChartType: ChartType = ChartType.GeoChart;
  geoChartColumns = ["Estado", "Nº de Advogados"];
  geoChartOptions = {
    region: "BR", // Foca no Brasil
    displayMode: "regions", // Exibe como regiões (estados)
    resolution: "provinces", // Detalhe para estados
    colorAxis: { colors: ["#e0f7fa", "#00796b"] }
  };
}
