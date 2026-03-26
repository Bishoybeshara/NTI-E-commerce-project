import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../shared/sidebar/sidebar';
import { Header as DashHeader} from '../shared/header/header';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet , DashHeader , Sidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}
