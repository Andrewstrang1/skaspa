import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig } from './api-config'; // Import your config type

@Injectable({
  providedIn: 'root',
})
export class ApiServicesService {
  constructor(private http: HttpClient) {}

  private createHeaders(token?: string, username?: string, password?: string): HttpHeaders {
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    if (username && password) {
      headers = headers.set('Authorization', `Basic ${btoa(`${username}:${password}`)}`);
    }
    headers = headers.set('Content-Type', 'application/json');
    return headers;
  }

  get(baseUrl: string, path: string, token?: string, username?: string, password?: string): Observable<any> {
    const headers = this.createHeaders(token, username, password);
    const options = { headers };
    return this.http.get(`${baseUrl}/${path}`, options);
  }

  post(baseUrl: string, path: string, body: any, token?: string, username?: string, password?: string): Observable<any> {
    const headers = this.createHeaders(token, username, password);
    const options = { headers };
    return this.http.post(`${baseUrl}/${path}`, body, options);
  }

  put(baseUrl: string, path: string, body: any, token?: string, username?: string, password?: string): Observable<any> {
    const headers = this.createHeaders(token, username, password);
    const options = { headers };
    return this.http.put(`${baseUrl}/${path}`, body, options);
  }

  delete(baseUrl: string, path: string, token?: string, username?: string, password?: string): Observable<any> {
    const headers = this.createHeaders(token, username, password);
    const options = { headers };
    return this.http.delete(`${baseUrl}/${path}`, options);
  }
}
