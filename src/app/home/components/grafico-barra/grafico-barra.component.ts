import { Component, Input } from "@angular/core";
import { ChartType, GoogleChartsModule } from "angular-google-charts";

@Component({
  selector: "app-grafico-barra",
  imports: [GoogleChartsModule],
  templateUrl: "./grafico-barra.component.html",
  styleUrl: "./grafico-barra.component.css"
})
export class GraficoBarraComponent {
  @Input() dados: any[] = [];

  type = ChartType.BarChart;
  barOptions = {
    hAxis: { title: "Número de Processos" },
    vAxis: { title: "Juízes" },
    legend: "none"
  };
}
