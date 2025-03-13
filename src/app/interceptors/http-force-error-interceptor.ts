import {
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

export const httpForceError: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  return next(req).pipe(
    mergeMap(resp => {
      const randomValue = Math.floor(Math.random() * 5);

      if (randomValue < 1) {
        return throwError(() => new HttpErrorResponse({ error: 'Unknown error occurred' }));
      }

      return of(resp);
    }),
    catchError(err => throwError(() => err))
  );
};
