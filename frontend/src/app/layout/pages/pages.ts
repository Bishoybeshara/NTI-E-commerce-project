import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IPage, PageService } from '../../core/services/page.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pages',
  imports: [],
  templateUrl: './pages.html',
  styleUrl: './pages.css',
})
export class Pages implements OnInit {
  page: IPage | null = null;
  errorMsg:string ='';

  constructor(
    private _pageService: PageService,
    private _activatedRoute: ActivatedRoute,
    private _cdr: ChangeDetectorRef
  ){}


  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe(params => {
      const slug = params.get('slug') as 'about' | 'contact' | 'faq';
      this._pageService.getPage(slug).subscribe({
        next: (res) =>{
          this.page = res.data;
          this._cdr.detectChanges();
        },
        error: (err) => this.errorMsg =err.error.message
      });
    });
  }
}
