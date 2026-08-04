import { inject, Injectable } from '@angular/core';
import { LoginRequest, LoginResponse } from './auth.interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  http = inject(HttpClient);


  login(request:LoginRequest):Observable<LoginResponse> { 
    return this.http.post<LoginResponse>('https://localhost:7147/api/Users/login', request);
  }
}
