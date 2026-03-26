import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IUser } from '../../core/models/user.model';
import { IOrder } from '../../core/models/order.model';
import { UserService } from '../../core/services/user.service';
import { OrderService } from '../../core/services/order.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-account',
  imports: [RouterLink , ReactiveFormsModule],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account implements OnInit{
  user: IUser | null =null;
  orders: IOrder[] =[];
  errorMsg: string='';
  successMsg:string='';
  isEditing:boolean = false;

  constructor(
    private _userService : UserService,
    private _orderService: OrderService,
    private _cdr : ChangeDetectorRef
  ){}


  profileForm = new FormGroup({
    name: new FormControl<string>('',[Validators.required , Validators.minLength(3)]),
    phone:new FormControl<string>('',[
      Validators.required,
      Validators.pattern(/^01[0125][0-9]{8}$/)
    ]),
    address:new FormControl<string>('')
  });





  ngOnInit(): void {
    this._userService.getMyProfile().subscribe({
      next:(res)=>{
        this.user = res.data;
        this.profileForm.patchValue({
          name: res.data.name,
          phone: res.data.phone,
          address: res.data.address || ''
        });
        this._cdr.detectChanges();
      },
      error: (err)=>this.errorMsg= err.error.message
    });

    this._orderService.getMyOrders().subscribe({
      next:(res)=>{
        this.orders = res.data;
        this._cdr.detectChanges();
      },
      error: (err)=> this.errorMsg = err.error.message
    });
  }


  onUpdateProfile(): void {
    if (this.profileForm.invalid) return;
    this._userService.updateMyProfile({
      name: this.profileForm.value.name!,
      phone: this.profileForm.value.phone!,
      address: this.profileForm.value.address || undefined
    }).subscribe({
      next: (res) => {
        this.user = res.data;
        this.successMsg = 'Profile updated successfully!';
        this.isEditing = false;
        this._cdr.detectChanges();
      },
      error: (err) => this.errorMsg = err.error.message
    });
  }


  cancelOrder(id:string):void{
    this._orderService.cancelOrder(id).subscribe({
      next:()=>{
        const order = this.orders.find(o => o._id === id);
        if(order) order.status = 'cancelled_by_user';
        this._cdr.detectChanges();
      },
      error: (err) => this.errorMsg = err.error.message
    });
  }
}
