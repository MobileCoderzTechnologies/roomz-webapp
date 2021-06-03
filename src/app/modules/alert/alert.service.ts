import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private $snackBar: MatSnackBar
  ) { }


  success(message: string, duration: number = 2000): void {
    this.$snackBar.open(message, '', {
      duration,
      verticalPosition: 'top',
      horizontalPosition: 'left',
      panelClass: ['alert', 'alert-success']
    });
  }

  danger(message: string, duration: number = 2000): void {
    this.$snackBar.open(message, '', {
      duration,
      verticalPosition: 'top',
      horizontalPosition: 'left',
      panelClass: ['alert', 'alert-danger']
    });
  }

  info(message: string, duration: number = 1000): void {
    this.$snackBar.open(message, '', {
      duration,
      verticalPosition: 'top',
      horizontalPosition: 'left',
      panelClass: ['alert', 'alert-info']
    });
  }
}
