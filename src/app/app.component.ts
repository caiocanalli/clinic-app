import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs/operators';
import { LoadingService } from './shared/services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Clinic';
  loading = false;

  public constructor(private loadingService: LoadingService) { }

  public ngOnInit(): void {
    this.loadingService.loadingSub.pipe(delay(0))
      .subscribe((loading) => {
        this.loading = loading;
      });
  }
}
