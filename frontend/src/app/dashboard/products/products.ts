import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IProduct } from '../../core/models/product.model';
import { ICategory, ISubcategory } from '../../core/models/category.model';
import { environment } from '../../../environment/environment';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-products',
  imports: [ReactiveFormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit{
  products: IProduct[]=[];
  categories: ICategory[]=[];
  subcategories: ISubcategory[]=[];
  errorMsg:string='';
  successMsg:string='';
  staticURL = environment.staticFilesURL;
  selectedFile: File | null = null;
  isEditing:boolean = false;
  editingId:string = '';


  constructor(
    private _productService : ProductService,
    private _categoryService: CategoryService,
    private _cdr: ChangeDetectorRef
  ){}

  productForm = new FormGroup({
    name : new FormControl<string>('',[Validators.required]),
    slug: new FormControl<string>('',[Validators.required]),
    description: new FormControl<string>('',[Validators.required]),
    price: new FormControl<number>(0,[Validators.required , Validators.min(0)]),
    priceAfterDiscount: new FormControl<number |null> (null),
    stock_quantity: new FormControl<number>(0 , [Validators.required ,Validators.min(0) ]),
    category: new FormControl<string>('',[Validators.required]),
    subcategory: new FormControl<string>('', [Validators.required])
  });


  ngOnInit(): void {
    this.loadProducts();
    this.localCatergories();
  }

  loadProducts():void{
    this._productService.getProducts().subscribe({
      next:(res) =>{
        this.products = res.data;
        this._cdr.detectChanges();
      },
      error: (err) => this.errorMsg =err.error.message
    });
  }

  localCatergories():void{
    this._categoryService.getCategories().subscribe({
      next:(res)=>{
        this.categories = res.data;
        this._cdr.detectChanges();
      },
      error:(err)=> this.errorMsg = err.error.message
    });
  }

  onFileChange(event: Event):void{
    const input = event.target as HTMLInputElement;
    if(input.files?.length){
      this.selectedFile = input.files[0];
    }
  }

  onSubmit():void{
    if(this.productForm.invalid) return;

    const formData = new FormData();
    const values = this.productForm.value;

    Object.entries(values).forEach(([key , value])=>{
      if(value !== null && value !== undefined && value !== ''){
        formData.append(key , value.toString());
      }
    });

    if(this.selectedFile){
      formData.append('image' , this.selectedFile);
    }

    const request$ = this.isEditing
      ?this._productService.updateProduct(this.editingId, formData)
      :this._productService.addProduct(formData);

    request$.subscribe({
      next: ()=>{
        this.successMsg = this.isEditing ? 'Product updtated!' : 'Product added!';
        this.resetForm();
        this.loadProducts();
      },
        error:(err) => this.errorMsg = err.error.message
    });
    // formData.append('name', this.productForm.value.name!);
    // formData.append('slug', this.productForm.value.slug!);
    // formData.append('description', this.productForm.value.description!);
    // formData.append('price', this.productForm.value.price!.toString());
    // formData.append('stock_quantity', this.productForm.value.stock_quantity!.toString());
    // formData.append('category', this.productForm.value.category!);
    // formData.append('subcategory', this.productForm.value.subcategory!);
    // if(this.productForm.value.priceAfterDiscount){
    //   formData.append('priceAfterDiscount' , this.productForm.value.priceAfterDiscount.toString());
    // }
    // if(this.selectedFile){
    //   formData.append('image' , this.selectedFile);
    // }

    // if(this.isEditing){
    //   this._productService.updateProduct(this.editingId , formData).subscribe({
    //     next:()=>{
    //       this.successMsg = 'Product updated!'
    //       this.resetForm();
    //       this.loadProducts();
  }


  editProduct(product:IProduct):void{
    this.isEditing = true;
    this.editingId = product._id;
    this.productForm.patchValue({
      name:product.name,
      slug: product.slug,
      description:product.description,
      price:product.price,
      priceAfterDiscount:product.priceAfterDiscount || null,
      stock_quantity:product.stock_quantity,
      category:product.category._id,
      subcategory:product.subcategory._id
    });
    this._categoryService.getSubCategories(product.category._id).subscribe({
      next:(res)=>{
        this.subcategories = res.data;
        this._cdr.detectChanges();
      }
    })
  }

  deleteProduct(id:string):void{
    this._productService.deleteProduct(id).subscribe({
      next:()=>{
        this.successMsg = 'Product deleted!';
        this.loadProducts();
      },
      error: (err) => this.errorMsg = err.error.message
    });
  }


  // link category with subcatergory
  onCategoryChange(event:Event):void{
    const categoryId = (event.target as HTMLSelectElement).value;
    this.productForm.patchValue({subcategory:''});
    this.subcategories =[];
    if(!categoryId) return
    this._categoryService.getSubCategories(categoryId).subscribe({
      next:(res)=>{
        this.subcategories = res.data;
        this._cdr.detectChanges();
      }
    })
  }




  resetForm():void{
    this.isEditing = false;
    this.editingId = '';
    this.selectedFile = null;
    this.subcategories=[]
    this.productForm.reset();
    this._cdr.detectChanges();
  }
}
