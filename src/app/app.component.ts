import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NeoServiceService } from './neo-service.service';
import { DatePipe } from '@angular/common';
import { Chart, registerables } from 'node_modules/chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'neo-app';
  model: any;
  startDate: any;
  datepicker: any;
  endDate: any;
  response: any;
  arrData: any = [];
  arrTmp: {};
  dataSource: any;
  highestValue: any;
  minavg: any;
  maxavg: any;
  datesArr: any = [];
  labels: any = [];
  speed: any = [];
  tmpmin: any = [];
  tmpmax: any = [];
  arrDataset: any = [];
  totalcounts: any = [];
  objectkeys = Object.keys;
  chart: any = [];
  ctx: any;
  showLoader: Boolean = false;
  displayedColumns: string[] = ['id', 'speed', 'avg'];
  rangeForm = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  @ViewChild('canvas')
  private canvasRef: ElementRef<HTMLCanvasElement>;
  context: CanvasRenderingContext2D;
  constructor(
    private NeoServiceService: NeoServiceService,
    private datePipe: DatePipe
  ) {}
  ngOnInit() {}

  ngAfterViewInit(): void {}

  handleStartDate(event: any) {
    this.startDate = this.datePipe.transform(event.target.value, 'yyyy-MM-dd');
    this.rangeForm.controls.start.setValue(this.startDate);
  }
  handleEndDate(event: any) {
    this.endDate = this.datePipe.transform(event.target.value, 'yyyy-MM-dd');
    this.rangeForm.controls.end.setValue(this.endDate);
  }

  // calling an Api
  handleSubmit(event: any) {
    this.showLoader = true;
    this.NeoServiceService.getDataFromNeoApi(
      this.startDate,
      this.endDate
    ).subscribe((res) => {
      this.response = res;
      for (const key in this.response.near_earth_objects) {
        if (
          Object.prototype.hasOwnProperty.call(
            this.response.near_earth_objects,
            key
          )
        ) {
          const element = this.response.near_earth_objects[key];
          // pushing the date
          this.labels.push(key);
          // pushing the total count based on date
          this.totalcounts.push(element.length);
          if (key in this.datesArr === false) {
            this.datesArr.push({
              date: key,
              count: element.length,
            });
          }

          // iterating the inner for loop
          // collecting data for showing in the table
          for (const k in element) {
            if (Object.prototype.hasOwnProperty.call(element, k)) {
              const ele = element[k];

              let tmpData = {
                date: key,
                id: ele.id,
                speed:
                  ele.close_approach_data[0].relative_velocity
                    .kilometers_per_hour,
                min: ele.estimated_diameter.kilometers.estimated_diameter_min,
                max: ele.estimated_diameter.kilometers.estimated_diameter_max,
              };

              this.arrData.push(tmpData);
              this.highestValue = Math.max(...this.arrData.map((o) => o.speed));
            }
          }
          this.minavg = this.findMinAverage(this.arrData);
          this.maxavg = this.findMaxAverage(this.arrData);
        }
      }

      // getting the count

      // creating charts

      const canvas = this.canvasRef.nativeElement;
      this.context = canvas.getContext('2d');
      const data = {
        labels: this.labels,
        datasets: [
          {
            label: 'Neo App Dataset',
            data: this.totalcounts,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)',
            ],
            borderWidth: 1,
          },
        ],
      };
      this.chart = new Chart(this.context, {
        type: 'bar',
        data: data,
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });
  }

  findMinAverage = (arr) => {
    const length = this.arrData.length;
    arr = this.arrData;
    return arr.reduce((acc, val) => {
      return acc + val.min / length;
    }, 0);
  };

  findMaxAverage = (arr) => {
    const length = this.arrData.length;
    arr = this.arrData;
    return arr.reduce((acc, val) => {
      return acc + val.max / length;
    }, 0);
  };
}
