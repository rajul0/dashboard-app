import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService } from 'src/app/core/services/dashboard.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('donutChart', { static: true }) donutChart!: ElementRef;
  @ViewChild('barChart', { static: true }) barChart!: ElementRef;

  users: any[] = [];

  constructor(
    private dashboard: DashboardService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.dashboard.getDashboardData().subscribe((data) => {
      this.users = data.tableUsers;
      this.renderBarChart(data.chartBar);
      this.renderDonutChart(data.chartDonut);
    });
    console.log(this.barChart);
  }

  renderDonutChart(data: any[]) {
    const svg = d3
      .select(this.donutChart.nativeElement)
      .append('svg')
      .attr('width', 300)
      .attr('height', 300)
      .append('g')
      .attr('transform', 'translate(150,150)');

    const radius = 100;
    const color = d3
      .scaleOrdinal<string>()
      .domain(data.map((_, i) => i.toString()))
      .range(['#BEBEBE', '#AEAEAE', '#CDCDCD', '#9E9E9E']);

    const pie = d3.pie<any>().value((d) => d.value);
    const arc = d3
      .arc<d3.PieArcDatum<any>>()
      .innerRadius(50)
      .outerRadius(radius);

    const arcs = svg.selectAll('arc').data(pie(data)).enter().append('g');

    arcs
      .append('path')
      .attr('d', arc as any)
      .attr('fill', (_, i) => color(i.toString()));
  }

  renderBarChart(data: any[]) {
    let root = am5.Root.new(this.barChart.nativeElement);
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        layout: root.verticalLayout,
      })
    );

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: 'name',
        renderer: am5xy.AxisRendererX.new(root, {}),
      })
    );

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    xAxis.data.setAll(data);

    let series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: 'Value',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        categoryXField: 'name',
      })
    );

    series.columns.template.setAll({
      width: am5.percent(70),
      tooltipText: '{name}: {valueY}',
      fill: am5.color(0x9e9e9e),
      stroke: am5.color(0x9e9e9e),
    });

    series.data.setAll(data);
    series.appear(1000);
    chart.appear(1000, 100);
  }

  signOut() {
    const confirmed = window.confirm('Apakah Anda yakin ingin keluar?');
    if (confirmed) {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }
}
