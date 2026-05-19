import {
  HttpClient,
  HttpContext,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

type ApiParamPrimitive = string | number | boolean;
type ApiParamValue = ApiParamPrimitive | readonly ApiParamPrimitive[] | null | undefined;

export type ApiQueryParams = Record<string, ApiParamValue>;

export interface ApiRequestOptions {
  body?: unknown;
  headers?: HttpHeaders | Record<string, string | string[]>;
  context?: HttpContext;
  params?: HttpParams | ApiQueryParams;
  observe?: 'body';
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  transferCache?: boolean | { includeHeaders?: string[] };
}

@Injectable({
  providedIn: 'root',
})
export class ApiClientService {
  private readonly http = inject(HttpClient);

  request<TResponse>(
    method: string,
    path: string,
    options: ApiRequestOptions = {},
  ): Observable<TResponse> {
    const { params, ...requestOptions } = options;

    return this.http.request<TResponse>(method, this.buildUrl(path), {
      ...requestOptions,
      params: this.buildHttpParams(params),
    });
  }

  get<TResponse>(path: string, options: Omit<ApiRequestOptions, 'body'> = {}): Observable<TResponse> {
    return this.request<TResponse>('GET', path, options);
  }

  post<TRequest, TResponse>(
    path: string,
    body: TRequest,
    options: Omit<ApiRequestOptions, 'body'> = {},
  ): Observable<TResponse> {
    return this.request<TResponse>('POST', path, { ...options, body });
  }

  put<TRequest, TResponse>(
    path: string,
    body: TRequest,
    options: Omit<ApiRequestOptions, 'body'> = {},
  ): Observable<TResponse> {
    return this.request<TResponse>('PUT', path, { ...options, body });
  }

  patch<TRequest, TResponse>(
    path: string,
    body: TRequest,
    options: Omit<ApiRequestOptions, 'body'> = {},
  ): Observable<TResponse> {
    return this.request<TResponse>('PATCH', path, { ...options, body });
  }

  delete<TResponse>(path: string, options: ApiRequestOptions = {}): Observable<TResponse> {
    return this.request<TResponse>('DELETE', path, options);
  }

  private buildUrl(path: string): string {
    if (/^https?:\/\//.test(path)) {
      return path;
    }

    const baseUrl = environment.apiBaseUrl.replace(/\/+$/, '');

    if (!path) {
      return baseUrl;
    }

    if (path.startsWith('?')) {
      return `${baseUrl}${path}`;
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}`;
  }

  private buildHttpParams(params?: HttpParams | ApiQueryParams): HttpParams | undefined {
    if (!params) {
      return undefined;
    }

    if (params instanceof HttpParams) {
      return params;
    }

    let httpParams = new HttpParams();

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) {
        continue;
      }

      if (Array.isArray(value)) {
        for (const item of value) {
          httpParams = httpParams.append(key, String(item));
        }
        continue;
      }

      httpParams = httpParams.set(key, String(value));
    }

    return httpParams;
  }
}
