import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ISalesReport, ReportService } from '../../core/services/report.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reports',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports {
  report: ISalesReport | null = null;
  errorMsg :string = '';

  constructor(
    private _reportService : ReportService,
    private _cdr : ChangeDetectorRef
  ){}

  reportForm = new FormGroup({
    startDate : new FormControl<string>('' , [Validators.required]),
    endDate: new FormControl<string>('' , [Validators.required])
  });

  onSubmit():void{
    if(this.reportForm.invalid) return;

    this._reportService.getSalesReport(
      this.reportForm.value.startDate!,
      this.reportForm.value.endDate!
    ).subscribe({
      next: (res) =>{
        this.report = res.data;
        this._cdr.detectChanges();
      },
      error : (err) => this.errorMsg = err.error.message
    });
  }
}
