import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { retry, catchError, tap } from 'rxjs/operators';
import { Transaction } from '../models/transaction';
@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private datasize = 10;
  private _getTransactionList = "https://api.tzstats.com/tables/op?columns=row_id,time,type,sender,volume&receiver=tz1gfArv665EUkSg2ojMBzcbfwuPxAvqPvjo&limit=";

  constructor(private http: HttpClient) { }
  GetTransaction(request: any): Observable<Transaction> {
    return this.http.get<any>(this._getTransactionList + this.datasize + request).pipe(
      retry(1),
      tap(Data => console.log('fetched Data')),
      catchError(this.handleError),
    );
  }
  handleError(err: any) {

    if (err instanceof HttpErrorResponse) {
      if (err.status == 401) {
      }
      if (err.status == 400) {
      }
      if (err.status == 404) {
      }
    }
    else {
      alert("Client side error")
    }
    return throwError(err)
  }

}
