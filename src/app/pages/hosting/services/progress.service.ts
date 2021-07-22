import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  public header = new BehaviorSubject({
    progress: 1,
    heading: 'Property and guests'
  });
  constructor() { }
}
