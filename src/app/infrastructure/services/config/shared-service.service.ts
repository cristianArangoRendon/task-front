import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private successSubject = new Subject<boolean>();
  success$: Observable<boolean> = this.successSubject.asObservable();

  constructor() {}

  setSuccess(value: boolean) {
    this.successSubject.next(value);
  }



}
