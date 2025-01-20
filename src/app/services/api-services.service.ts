import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiConfig, apiConfig } from './api-config';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private config!: ApiConfig;
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  setConfig(name: string): void {
    const selectedConfig = apiConfig.find(config => config.name === name);
    if (!selectedConfig) {
      throw new Error(`API config with name '${name}' not found.`);
    }
    this.config = selectedConfig;
    this.setBaseURL(this.config.baseUrl);
    this.createHeaders({
      token: this.config.token ?? undefined,
      username: this.config.username ?? undefined,
      password: this.config.password ?? undefined,
    });
  }

  private setBaseURL(baseURL: string): void {
    this.config.baseUrl = baseURL;
  }

  private createHeaders({ token, username, password }: { token?: string; username?: string; password?: string }): void {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    if (username && password) {
      headers = headers.set('Authorization', `Basic ${btoa(`${username}:${password}`)}`);
    }
    this.headers = headers;
  }

  get<T>(params: any = {}): Observable<T> {
    const options = { headers: this.headers, params: new HttpParams({ fromObject: params }) };
    return this.http.get<T>(`${this.config.baseUrl}/${this.config.path}`, options).pipe(catchError(this.handleError));
  }

  getById<T>(id: string | number): Observable<T> {
    return this.http.get<T>(`${this.config.baseUrl}/${this.config.path}/${id}`, { headers: this.headers }).pipe(catchError(this.handleError));
  }

  post<T>(data: any): Observable<T> {
    if (!this.isValidJson(data)) {
      return throwError('Invalid JSON format in POST data');
    }
    return this.http.post<T>(`${this.config.baseUrl}/${this.config.path}`, data, { headers: this.headers }).pipe(catchError(this.handleError));
  }

  put<T>(id: string | number, data: any): Observable<T> {
    if (!this.isValidJson(data)) {
      return throwError('Invalid JSON format in PUT data');
    }
    return this.http.put<T>(`${this.config.baseUrl}/${this.config.path}/${id}`, data, { headers: this.headers }).pipe(catchError(this.handleError));
  }

  delete<T>(id: string | number): Observable<T> {
    return this.http.delete<T>(`${this.config.baseUrl}/${this.config.path}/${id}`, { headers: this.headers }).pipe(catchError(this.handleError));
  }

  private isValidJson(data: any): boolean {
    try {
      JSON.stringify(data);
      return true;
    } catch (e) {
      console.error('Invalid JSON data:', e);
      return false;
    }
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(error.error || 'Server error');
  }
}

// Example usage:
// const apiService = new ApiService(httpClient);
// apiService.setConfig('ProductsAPI');
// apiService.get().subscribe(data => console.log(data));
