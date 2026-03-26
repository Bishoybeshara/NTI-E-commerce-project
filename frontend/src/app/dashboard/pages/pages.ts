import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageService } from '../../core/services/page.service';

@Component({
  selector: 'app-pages',
  imports: [ReactiveFormsModule],
  templateUrl: './pages.html',
  styleUrl: './pages.css',
})
export class Pages implements OnInit{
  currentSlug:'about' | 'contact' | 'faq' = 'about';
  errorMsg:string ='';
  successMsg:string='';

  constructor(
    private _pageService : PageService,
    private _cdr : ChangeDetectorRef
  ){}

  pageForm = new FormGroup({
    title : new FormControl<string>('' , [Validators.required]),
    content: new FormControl<string>('',[Validators.required])
  });

  ngOnInit(): void {
    this.loadPage('about')
  }

  loadPage(slug:'about' | 'contact' | 'faq'):void{
    this.currentSlug = slug;
    this.successMsg = '';
    this.errorMsg = '';
    this._pageService.getPage(slug).subscribe({
      next:(res)=>{
        this.pageForm.patchValue({
          title: res.data.title,
          content: res.data.content
        });
        this._cdr.detectChanges();
      },
      error : (err)=>this.errorMsg= err.error.message
    });
  }

  onSubmit():void{
    if(this.pageForm.invalid) return;

    this._pageService.updatePage(this.currentSlug,{
      title:this.pageForm.value.title!,
      content:this.pageForm.value.content!
    }).subscribe({
      next:()=>{
        this.successMsg= 'Page updated successfully!';
        this._cdr.detectChanges();
      },
      error:(err) => this.errorMsg =err.error.message
    });
  }
}
