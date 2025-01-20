import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css', '../shared-styles/data-table-h.component.css', '../shared-styles/data-table-h-green-theme.css'
    , '../shared-styles/data-table-h-purple-theme.css', '../shared-styles/data-table-h-blue-theme.css'
  ]
})
export class SpinnerComponent implements OnInit {

  @Input() labelText: string = 'Loading';
  @Input() themeClass: string = 'blue-theme';
  dots = 1;
  label = '';
  constructor(private elementRef: ElementRef) { }

  ngOnInit() { }
  ngAfterViewInit() {
    setInterval(() => {
      this.dots = (this.dots + 1) % 6; // 6 because we want to reset to 0 after 5 dots
      this.label = this.labelText + '.'.repeat(this.dots);
    }, 500); // update every 0.5 seconds
  }

}