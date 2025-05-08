import {Component, inject, OnInit} from '@angular/core';
import {ChartType, GoogleChartsModule} from 'angular-google-charts';
import {Neo4jService} from './services/neo4j.service';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-inicio',
  imports: [GoogleChartsModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  standalone: true,
})
export class InicioComponent implements OnInit {
  private neo4jService: Neo4jService = inject(Neo4jService);

  type = ChartType.Sankey;
  data: any[] = [];
  columnNames = ['Juiz', 'Processo', 'Peso'];
  options = {};
  width = 900;
  height = 500;

  async ngOnInit(): Promise<void> {
    let response = await firstValueFrom(this.neo4jService.getRedeJuizesProcessos());

    this.data = response.links.map((link: { source: any; target: any; }) => {
      const juiz = response.nodes.find((n: { id: any; }) => n.id === link.source);
      const processo = response.nodes.find((n: { id: any; }) => n.id === link.target);
      return [juiz?.label || link.source, processo?.label || link.target, 1];
    });
  }
}
