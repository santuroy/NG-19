import { Injectable, signal, computed } from '@angular/core';
import { UserService } from '../services/user.service';
// import { User } from '../models/user.model';
import type { User } from '../models/user.model';

import { finalize, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStore {

  // Main application state
  private usersState = signal<User[]>([]);

  // Loading state
  private loadingState = signal<boolean>(false);

  // Error state
  private errorState = signal<string | null>(null);

  // Read-only signals
  readonly users = this.usersState.asReadonly();

  readonly loading = this.loadingState.asReadonly();

  readonly error = this.errorState.asReadonly();

  // Derived state
  readonly totalUsers = computed(
    () => this.users().length
  );

  readonly activeUsers = computed(
    () => this.users().filter(user => user.status === 'Active').length
  );

  readonly inactiveUsers = computed(
    () => this.users().filter(user => user.status === 'Inactive').length
  );

  constructor(private userService: UserService) {}

  // Load users
  loadUsers(): void {

    this.loadingState.set(true);
    this.errorState.set(null);

    this.userService.getUsers()
      .pipe(
        finalize(() => this.loadingState.set(false))
      )
      .subscribe({
        next: (users) => {
          this.usersState.set(users);
        },
        error: () => {
          this.errorState.set('Unable to load users');
        }
      });

  }

    // Add user
    // addUser(user: Omit<User, 'id'>) {

    //     return this.userService.addUser(user).pipe(

    //         tap(newUser => {

    //         this.usersState.update(users => [
    //             ...users,
    //             newUser
    //         ]);

    //         }),

    //         // Keep the error visible to the component
    //         // after recording it in the store
    //         // catchError is added below

    //     );

    // }

    // // Update user
    // updateUser(user: User) {

    //     return this.userService.updateUser(user).pipe(

    //         tap(updatedUser => {

    //         this.usersState.update(users =>
    //             users.map(existingUser =>
    //             existingUser.id === updatedUser.id
    //                 ? updatedUser
    //                 : existingUser
    //             )
    //         );

    //         })

    //     );

    // }

    // // Delete user
    // deleteUser(id: number) {

    //     return this.userService.deleteUser(id).pipe(

    //         tap(() => {

    //         this.usersState.update(users =>
    //             users.filter(user => user.id !== id)
    //         );

    //         })

    //     );

    // }

    

    addUser(user: Omit<User, 'id'>) {
        return this.userService.addUser(user).pipe(
            tap(newUser => {
            this.usersState.update(users => [...users, newUser]);
            })
        );
    }

    updateUser(user: User) {
        return this.userService.updateUser(user).pipe(
            tap(updatedUser => {
            this.usersState.update(users =>
                users.map(existingUser =>
                existingUser.id === updatedUser.id
                    ? updatedUser
                    : existingUser
                )
            );
            })
        );
    }

    deleteUser(id: number) {
        return this.userService.deleteUser(id).pipe(
            tap(() => {
            this.usersState.update(users =>
                users.filter(user => user.id !== id)
            );
            })
        );
    }

}