import { Component, OnInit } from '@angular/core';
import { LoggerService } from 'src/app/services/logger.service';
import { LOGGER_CONFIG } from 'src/app/services/logger-config';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster-test.component.html',
  styleUrls: ['./toaster-test.component.css']
})
export class ToasterTestComponent implements OnInit {

  constructor( private logger: LoggerService) { }

  ngOnInit(): void {
  }

  showSuccessToast(): void {
   const message: string = 'This is an elongated Success message which will hopefully cause it to wrap and truncate after a certain width';
   this.logger.log('success', message);
    // Implement logic to show a success toast
  } 

  showFailureToast(): void {
    const message: string = 'Failure message';
    this.logger.log('fail', message);
    // Implement logic to show an error toast
  }

  showWarningToast(): void {
    this.logger.log('warning', 'Warning message');
    const message: string = 'Warning message';
    // Implement logic to show a warning toast
  }

}
