import { Component, Input } from "@angular/core";
import { ChartType, GoogleChartsModule } from "angular-google-charts";
import { NgxSpinnerModule } from "ngx-spinner";

@Component({
  selector: "app-grafico-pizza",
  imports: [GoogleChartsModule, NgxSpinnerModule],
  templateUrl: "./grafico-pizza.component.html",
  styleUrl: "./grafico-pizza.component.css",
  standalone: true
})
export class GraficoPizzaComponent {
  @Input() dados: any[] = [];

  isLoading = true;
  pieChartType: ChartType = ChartType.PieChart;

  // A primeira linha do data array define os cabeçalhos das colunas
  pieChartColumns = ["Juiz", "Nº de Processos"];
  pieChartOptions = {
    title: "Distribuição de Processos por Juiz",
    is3D: true
    // sliceVisibilityThreshold: 0.05, // Para agrupar fatias pequenas em "Outros" (ex: 5%)
    // Para mais opções, veja a documentação do Google PieChart:
    // https://developers.google.com/chart/interactive/docs/gallery/piechart
  };
}
