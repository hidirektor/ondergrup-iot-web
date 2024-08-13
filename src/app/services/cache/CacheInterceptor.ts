import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {CacheService} from './cache.service'; // Cache servisini ayrı bir dosyada oluşturabilirsiniz

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

    constructor(private cacheService: CacheService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Sadece GET isteklerini önbelleğe alıyoruz
        if (req.method !== 'GET') {
            return next.handle(req);
        }

        const cachedResponse = this.cacheService.get(req.url);
        if (cachedResponse) {
            return of(cachedResponse);
        }

        return next.handle(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    this.cacheService.put(req.url, event);
                }
            })
        );
    }
}