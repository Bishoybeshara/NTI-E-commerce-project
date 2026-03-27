import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';
import { ICategory } from '../../core/models/category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {
  categories: ICategory[] = [];
  errorMsg: string = '';
  successMsg: string = '';

  // Main Category Form
  categoryForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    slug: new FormControl('', [Validators.required])
  });

  // Subcategory Form - UPDATED to include slug
  subcategoryForm = new FormGroup({
    categoryId: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    slug: new FormControl('', [Validators.required]) // Added slug control
  });

  constructor(
    private _categoryService: CategoryService,
    private _Cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this._categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        this._Cdr.detectChanges();
      },
      error: (err) => (this.errorMsg = err.error.message),
    });
  }

  // Generate slug for Main Category
  generateSlug(): void {
    const nameValue = this.categoryForm.get('name')?.value || '';
    this.categoryForm.patchValue({ slug: this._slugify(nameValue) });
  }

  // Generate slug for Subcategory
  generateSubSlug(): void {
    const nameValue = this.subcategoryForm.get('name')?.value || '';
    this.subcategoryForm.patchValue({ slug: this._slugify(nameValue) });
  }

  // Private helper to avoid repeating logic
  private _slugify(text: string): string {
    return text.toLowerCase().trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  onCreateCategory(): void {
    if (this.categoryForm.invalid) return;

    const categoryData = {
      name: this.categoryForm.value.name as string,
      slug: this.categoryForm.value.slug as string
    };

    this._categoryService.addCategory(categoryData).subscribe({
      next: () => {
        this.successMsg = 'Category created successfully';
        this.categoryForm.reset();
        this.loadCategories();
      },
      error: (err) => (this.errorMsg = err.error.message),
    });
  }

  // Handle Subcategory Submission

  onCreateSubcategory(): void {
    if (this.subcategoryForm.invalid) return;

  const catId = this.subcategoryForm.value.categoryId as string;

  const subData = {
    name: this.subcategoryForm.value.name as string,
    slug: this.subcategoryForm.value.slug as string,
    category: catId
  };

  this._categoryService.addSubcategory(catId, subData).subscribe({
    next: () => {
      this.successMsg = 'Subcategory added successfully';
      this.subcategoryForm.reset();
      this.loadCategories(); // Refresh list
      this._Cdr.detectChanges();
    },
    error: (err) => (this.errorMsg = err.error.message),
  });
}
}
