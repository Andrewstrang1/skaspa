import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoggerService, LogType } from '../../services/logger.service';
import { ChangeDetectorRef } from '@angular/core';
import { LOGGER_CONFIG } from '../../services/logger-config';

interface Toast {
  id: number;
  type: LogType;
  message: string;
  removing?: boolean;
}

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css']
})
export class ToasterComponent implements OnInit, OnDestroy {
  @Input() position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right';
  toasts: Toast[] = [];
  private toastSub!: Subscription;
  private toastCounter = 0;

  constructor(private logger: LoggerService, private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.toastSub = this.logger.toast$.subscribe(toastData => {
      this.addToast(toastData);
    });
  }

  addToast(toastData: { id: number, type: LogType, message: string, duration?: number }): void {
   
   // Truncate message to 89 characters and add "..." if it's longer
   const maxLength = 89;
   if (toastData.message.length > maxLength) {
     toastData.message = toastData.message.substring(0, maxLength) + "... (see console for more info)";
   }
    this.toasts.push(toastData);
    
    this.cdRef.detectChanges(); // Force UI update
  
    // Remove the toast after a delay
    setTimeout(() => {
      
      this.removeToast(toastData.id);
    }, toastData.duration || 3000);
  }
  
  removeToast(id: number): void {
   
    const toastIndex = this.toasts.findIndex(toast => toast.id === id);
  
    if (toastIndex !== -1) {
      this.toasts[toastIndex] = { ...this.toasts[toastIndex], removing: true };
      this.cdRef.detectChanges(); // Force UI update
  
      setTimeout(() => {
        requestAnimationFrame(() => {
          
          this.toasts = this.toasts.filter(toast => toast.id !== id);
          this.cdRef.detectChanges();
        });
      }, 500); // Matches the fade-out animation duration
    }
  }
  
  trackById(index: number, toast: { id: number }): number {
    return toast.id;
  }
  getToastClass(toast: { type: string, removing?: boolean }): any {
    return {
      [toast.type]: true, // e.g., 'success', 'fail', 'warning'
      'removing': toast.removing
    };
  }
  

  ngOnDestroy(): void {
    this.toastSub.unsubscribe();
  }

  getIcon(type: LogType): string {
    switch (type) {
      case 'success': return '✔'; // Checkmark
      case 'warning': return '⚠'; // Warning sign
      case 'fail': return '✖'; // Cross mark
      default: return 'ℹ'; // Info icon
    }
  }

}


