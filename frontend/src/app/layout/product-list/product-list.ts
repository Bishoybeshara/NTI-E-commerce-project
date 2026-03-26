import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IProduct } from '../../core/models/product.model';
import { environment } from '../../../environment/environment';
import { ProductService } from '../../core/services/product.service';
import { FormsModule } from '@angular/forms';
import { ICategory, ISubcategory } from '../../core/models/category.model';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-product-list',
  imports: [RouterLink , FormsModule ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  products : IProduct[] = [];
  categories: ICategory[] = [];
  subcategories: ISubcategory[] = [];
  errorMsg:string ='';
  staticURL = environment.staticFilesURL;

  // filters
  selectedCategory: string = '';
  selectedSubcategory: string = '';
  searchText: string = '';

  constructor(private _productService : ProductService,
              private _categortService : CategoryService,
              private _cdr:ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.loadProducts()
    this._categortService.getCategories().subscribe({
      next: (res) => {this.categories = res.data;
        this._cdr.detectChanges();
      },
      error:(err)=> this.errorMsg  = err.error.message
    });
  }


  loadProducts(): void {
    this._productService.getProducts({
      category: this.selectedCategory || undefined,
      subcategory: this.selectedSubcategory || undefined,
      search: this.searchText || undefined
    }).subscribe({
      next: (res) => {
        this.products = res.data;
        this._cdr.detectChanges();
      },
      error: (err) => this.errorMsg = err.error.message
    });
  }

  onCategoryChange(): void {
    this.selectedSubcategory = '';
    this.subcategories = [];
    if (this.selectedCategory) {
      this._categortService.getSubCategories(this.selectedCategory).subscribe({
        next: (res) => {
          this.subcategories = res.data;
          this._cdr.detectChanges();
        }
      });
    }
    this.loadProducts();
  }

  onSubcategoryChange(): void {
    this.loadProducts();
  }

  onSearch(): void {
    this.loadProducts();
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.selectedSubcategory = '';
    this.searchText = '';
    this.subcategories = [];
    this.loadProducts();
  }
}
