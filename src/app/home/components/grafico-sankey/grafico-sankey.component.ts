import { Component, Input } from "@angular/core";
import { ChartType, GoogleChartsModule } from "angular-google-charts";
import { NgxSpinnerModule } from "ngx-spinner";

@Component({
  selector: "app-grafico-sankey",
  imports: [GoogleChartsModule, NgxSpinnerModule],
  templateUrl: "./grafico-sankey.component.html",
  styleUrl: "./grafico-sankey.component.css",
  standalone: true
})
export class GraficoSankeyComponent {
  @Input() carregandoSankey!: boolean;
  @Input() columnNamesSankey!: string[];
  @Input() sankeyData!: any[];

  type = ChartType.Sankey;
  sankeyOptions = {};
}
