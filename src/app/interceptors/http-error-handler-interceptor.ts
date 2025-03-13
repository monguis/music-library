import {
  HttpRequest,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
} from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const httpErrorHandler: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Unknown error occurred';

      if (error.status === 404) {
        errorMessage = 'Content not found';
      } else if (error.status === 500) {
        errorMessage = 'Internal server error';
      }

      console.error({ url: req.url, status: error.status, message: errorMessage });

      return throwError(() => new Error(errorMessage));
    })
  );
};
