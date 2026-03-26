import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IUser } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  users: IUser[]= [];
  errorMsg: string = '';
  successMsg:string = '';

  constructor(
    private _userService: UserService,
    private _cdr : ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers():void{
    this._userService.getAllUsers().subscribe({
      next:(res) =>{
        this.users = res.data;
        this._cdr.detectChanges()
      },
      error: (err) => this.errorMsg = err.error.message
    });
  }



  toggleStatus(id:string):void{
    this._userService.toggoleUserStatus(id).subscribe({
      next:() =>{
        this.successMsg = 'User status updated!';
        this.loadUsers();
      },
      error: (err) => this.errorMsg = err.error.message
    });
  }
}
