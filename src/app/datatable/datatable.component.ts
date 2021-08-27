import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { auditTime, filter, tap } from 'rxjs/operators';
import { TransactionsService } from '../services/transactions.service';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss']
})
export class DatatableComponent implements OnInit {
  displayedColumns: string[] = ['type', 'volume', 'time', 'sender'];
  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  constructor(private spinner: NgxSpinnerService, private _Tran: TransactionsService) {
  }
  AllTransaction;
  notEmptyTransaction = true;
  ngOnInit() {
    this.loadInitTransaction();
  }
  loadInitTransaction() {
    this.spinner.show();
    this._Tran.GetTransaction("")
      .subscribe(res => {
        this.AllTransaction = res.map(item => {
          return { row_id: item[0], time: item[1], type: item[2], sender: item[3], volume: item[4] };
        });
        this.spinner.hide();
      });
  }
  ngAfterViewInit() {
    this.viewPort.elementScrolled().pipe(
      auditTime(300),
      filter(event => this.viewPort.measureScrollOffset('bottom') === 0)
    ).subscribe(event => {
      this.loadNexttrnsaction()
    })

    this.viewPort.scrolledIndexChange.pipe(
      auditTime(300),
      tap((currIndex: number) => {
        console.log('scrolledIndexChange:', currIndex);
      })
    ).subscribe();

  }
  // load th next 10 Transaction
  async loadNexttrnsaction() {
    this.spinner.show();
    const lastPost = this.AllTransaction[this.AllTransaction.length - 1];
    this._Tran.GetTransaction("&cursor.lte=" + lastPost.row_id)
      .subscribe(res => {
        const newPost = res.map(item => {
          return { row_id: item[0], time: item[1], type: item[2], sender: item[3], volume: item[4] };
        });
        if (newPost.length === 0) {
          this.notEmptyTransaction = false;
        }
        // add newly fetched Data to the existing Transaction
        this.AllTransaction = this.AllTransaction.concat(newPost);
        this.spinner.hide();
      });
  }
}
