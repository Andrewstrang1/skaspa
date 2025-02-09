import { Injectable, Optional, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { LoggerConfig, LOGGER_CONFIG } from './logger-config';

export type LogType = 'success' | 'warning' | 'fail';

interface ToastMessage {
  id: number;
  type: LogType;
  message: string;
  duration?: number;
}

@Injectable({
  // You can also choose to omit providedIn so that you can override the service
  // in feature components. (If you want the default globally, use providedIn: 'root'.)
  providedIn: 'root'
})
export class LoggerService {
  // A subject to stream toast messages to a toaster component
  private toastSubject = new Subject<{ id: number, type: LogType; message: string; duration?: number }>();
  toast$ = this.toastSubject.asObservable();

  // Internal flag read from configuration (default to false if not provided)
  private useDatabase: boolean;

  constructor(
    @Optional() @Inject(LOGGER_CONFIG) config: LoggerConfig
  ) {
    this.useDatabase = config?.useDatabase ?? false;
  }

  log(type: LogType, message: string, duration = 5000): void {
    const id = Date.now(); // Unique ID based on timestamp
    const toastMessage: ToastMessage = { id, type, message, duration }; // Explicit structure
    this.toastSubject.next(toastMessage);
  
    // Define icons & console styles for different log types
    const icons: Record<LogType, string> = {
      success: "✅",
      warning: "⚠️",
      fail: "❌"
    };
  
    const colors: Record<LogType, string> = {
      success: "color: green; font-weight: bold;",
      warning: "color: orange; font-weight: bold;",
      fail: "color: red; font-weight: bold;"
    };
  
    // Fancy console log output with icons & color styling
    console.log(`%c${icons[type]} [${type.toUpperCase()}]: ${message}`, colors[type]);
  
    // Optionally log to a database (dummy implementation)
    if (this.useDatabase) {
      this.writeToDatabase(type, message);
    }
  }
  private writeToDatabase(type: LogType, message: string): void {
    // Dummy implementation – expand later as needed.
    console.log(`(DB) Writing to database: [${type.toUpperCase()}]: ${message}`);
  }
}
