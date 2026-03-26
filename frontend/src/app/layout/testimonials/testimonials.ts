import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ITestimonial } from '../../core/models/testimonial.model';
import { TestimonialService } from '../../core/services/testimonial.service';

@Component({
  selector: 'app-testimonials',
  imports: [ReactiveFormsModule],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css',
})
export class Testimonials  implements OnInit{
  testimonials:ITestimonial[] = [];
  errorMsg: string = '';
  successMsg: string= '';


  constructor(
    private _testimonialService: TestimonialService,
    private _cdr : ChangeDetectorRef
  ){}

  testimonialForm = new FormGroup({
    content : new FormControl<string>('',[Validators.required , Validators.minLength(10) ]),
    rating : new FormControl<number>(5,[Validators.required , Validators.min(1) , Validators.max(5) ])
  });

  ngOnInit(): void {
    this._testimonialService.getApprovedTestimonials().subscribe({
      next: (res) =>{
        this.testimonials =res.data;
        this._cdr.detectChanges();
      },
      error:(err) => this.errorMsg = err.error.message
    });
  }

  onSubmit():void{
    if (this.testimonialForm.invalid) return;

    this._testimonialService.createTestimonial({
      content: this.testimonialForm.value.content!,
      rating: this.testimonialForm.value.rating!
    }).subscribe({
      next: ()=>{
        this.successMsg = 'Your review has been submitted and is pending approval!';
        this.testimonialForm.reset({rating:5});
        this._cdr.detectChanges();
      },
      error: (err) => this.errorMsg = err.error.message
    });
  }
}
