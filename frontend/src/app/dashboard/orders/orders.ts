import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IOrder, OrderStatus } from '../../core/models/order.model';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-orders',
  imports: [],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  orders: IOrder[]=[];
  errorMsg: string='';
  successMsg:string='';

  statuses: OrderStatus[] = [
    'pending',
    'prepared',
    'shipped',
    'delivered',
    'cancelled_by_admin',
    'rejected'
  ];

  constructor(
    private _orderService:OrderService,
    private _Cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.loadOrders();
  }


  loadOrders():void{
    this._orderService.getAllOrders().subscribe({
      next: (res) =>{
        this.orders = res.data;
        this._Cdr.detectChanges();
      },
      error:(err) => this.errorMsg = err.error.message
    });
  }

  updateStatus(id:string, status: OrderStatus):void{
    this._orderService.updateOrderStatus(id , status).subscribe({
      next: () =>{
        this.successMsg = 'Order status updates';
        this.loadOrders();
      },
      error: (err) =>this.errorMsg = err.error.message
    });
  }
}
