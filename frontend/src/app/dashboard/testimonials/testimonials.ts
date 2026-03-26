import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ITestimonial, TestimonialStatus } from '../../core/models/testimonial.model';
import { TestimonialService } from '../../core/services/testimonial.service';

@Component({
  selector: 'app-testimonials',
  imports: [],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css',
})
export class Testimonials implements OnInit {
  testimonials : ITestimonial[] = [];
  errorMsg: string='';
  successMsg: string='';

  constructor(
    private _testimonialService:TestimonialService,
    private _cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.loadTestimonials();
  }


  loadTestimonials():void {
    this._testimonialService.getAllTestimonials().subscribe({
      next: (res)=>{
        this.testimonials = res.data;
        this._cdr.detectChanges();
      },
      error: (err) => this.errorMsg = err.error.message
    });
  }

  updateStatus(id:string, status: TestimonialStatus):void{
    this._testimonialService.updateStatus(id, status).subscribe({
      next:()=>{
        this.successMsg = 'Status updated!';
        this.loadTestimonials();
      },
      error: (err)=> this.errorMsg = err.error.message
    });
  }
}
