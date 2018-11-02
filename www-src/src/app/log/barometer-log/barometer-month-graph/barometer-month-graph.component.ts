import {Component, OnInit, ElementRef, Input, ViewChild, Inject, AfterViewInit} from '@angular/core';
import {I18NEXT_SERVICE, ITranslationService} from 'angular-i18next';
import {GraphService} from 'src/app/_shared/_services/graph.service';
import * as Highcharts from 'highcharts';
import {GraphTempPoint} from '../../../_shared/_models/graphdata';
import {Utils} from 'src/app/_shared/_utils/utils';
import {ClickPointEvent} from 'src/app/log/device-log/temperature-log-chart/temperature-log-chart.component';
import {Options} from 'highcharts';
import {AxisLabelsFormatterContextObject} from "highcharts";
import {ChartService} from "../../../_shared/_services/chart.service";

@Component({
  selector: 'dz-barometer-month-graph',
  templateUrl: './barometer-month-graph.component.html',
  styleUrls: ['./barometer-month-graph.component.css']
})
export class BarometerMonthGraphComponent implements OnInit, AfterViewInit {

  @Input() idx: string;

  @ViewChild('monthgraph', {static: false}) chartTarget: ElementRef;

  private chart: Highcharts.Chart;

  constructor(
    @Inject(I18NEXT_SERVICE) private translationService: ITranslationService,
    private graphService: GraphService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.loadGraph();
  }

  private loadGraph() {
    const _this = this;
    const options: Options = {
      chart: {
        type: 'spline',
        zoomType: 'x',
        resetZoomButton: {
          position: {
            x: -30,
            y: -36
          }
        },
        marginRight: 10,
        events: {
          load: () => {
            _this.graphService.getData('month', _this.idx, 'temp').subscribe(data => {
              if (typeof data.result !== 'undefined') {
                let series = _this.chart.series[0];
                let datatable = [];
                data.result.forEach((item: GraphTempPoint) => {
                  datatable.push([Utils.GetDateFromString(item.d), Number(item.ba)]);
                });
                series.setData(datatable, false);
                const bHavePrev = (typeof data.resultprev !== 'undefined');
                if (bHavePrev) {
                  datatable = [];
                  series = _this.chart.series[1];
                  data.resultprev.forEach((item: GraphTempPoint) => {
                    datatable.push([Utils.GetPrevDateFromString(item.d), Number(item.ba)]);
                  });
                  _this.chart.addSeries(<any>{ // FIXME type
                    id: 'prev_baro',
                    name: _this.translationService.t('Past') + ' Baro',
                    visible: false,
                    tooltip: {
                      valueSuffix: ' hPA',
                      valueDecimals: 1
                    },
                    point: {
                      events: {
                        click: (event: ClickPointEvent): boolean => {
                          if (event.shiftKey !== true) {
                            return;
                          }

                          _this.graphService.deletePoint(_this.idx, event.point, false).subscribe(() => {
                            _this.loadGraph();
                          });
                        }
                      }
                    }
                  }, false);
                  series = <Highcharts.Series>_this.chart.get('prev_baro');
                  series.setData(datatable, false);
                }
                _this.chart.redraw();
              }
            });
          }
        }
      },
      title: {
        text: this.translationService.t('Barometer') + ' ' + this.translationService.t('Last Month')
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: this.translationService.t('Pressure') + ' (hPa)'
        },
        labels: {
          formatter: function (this: AxisLabelsFormatterContextObject) {
            return this.value.toString();
          }
        }
      },
      tooltip: {
        crosshairs: true,
        shared: true
      },
      plotOptions: {
        spline: {
          lineWidth: 3,
          states: {
            hover: {
              lineWidth: 3
            }
          },
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: true,
                radius: 5,
                lineWidth: 1
              }
            },
            symbol: 'circle'
          }
        }
      },
      series: [
        {
          id: 'baro',
          type: 'spline',
          name: 'Baro',
          tooltip: {
            valueSuffix: ' hPa',
            valueDecimals: 1
          },
          point: {
            events: {
              click: (event: ClickPointEvent): boolean => {
                if (event.shiftKey !== true) {
                  return;
                }

                _this.graphService.deletePoint(_this.idx, event.point, false).subscribe(() => {
                  _this.loadGraph();
                });
              }
            }
          }
        }
      ],
      legend: {
        enabled: true
      },
      navigation: {
        menuItemStyle: {
          fontSize: '10px'
        }
      }
    };

    ChartService.setDeviceIdx(this.idx);
    this.chart = Highcharts.chart(this.chartTarget.nativeElement, options);
  }

}
