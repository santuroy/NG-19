import { Component, inject } from '@angular/core';
import { UserGridComponent } from '../user-grid/user-grid.component';


import { UserStore } from '../../state/user-store.service'

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [UserGridComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  
  readonly userStore = inject(UserStore);
  ngOnInit(): void {
    this.userStore.loadUsers();
  }

}


// import {
//   Component,
//   OnInit,
//   inject
// } from '@angular/core';

// import { UserStore } from '../../state/user-store.service';
// import { UserGridComponent } from '../user-grid/user-grid.component';

// @Component({
//   selector: 'app-user-list',
//   standalone: true,
//   imports: [UserGridComponent],
//   templateUrl: './user-list.component.html',
//   styleUrl: './user-list.component.css'
// })
// export class UserListComponent implements OnInit {

//   readonly userStore = inject(UserStore);

//   ngOnInit(): void {
//     this.userStore.loadUsers();
//   }

// }