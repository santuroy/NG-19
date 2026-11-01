import {
  Component,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';

import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { UserStore } from '../../state/user-store.service';
import type { User } from '../../models/user.model';

@Component({
  selector: 'app-user-grid',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-grid.component.html',
  styleUrl: './user-grid.component.css'
})
export class UserGridComponent {

  private fb = inject(FormBuilder);

  readonly store = inject(UserStore);

  // Track which existing rows are being edited
  editingIds = signal<Set<number>>(new Set());

  // Main reactive form
  form = this.fb.group({
    users: this.fb.array<FormGroup>([])
  });

  // Access FormArray
  get userRows(): FormArray<FormGroup> {
  return this.form.controls.users as FormArray<FormGroup>;
}

  constructor() {

    // Populate the grid when users become available
    effect(() => {

      const users = this.store.users();

      if (users.length > 0 && this.userRows.length === 0) {

        users.forEach(user => {
          this.userRows.push(this.createUserForm(user));
        });

      }

    });

  }

  // Create individual user form
  private createUserForm(user?: User): FormGroup {

    return this.fb.group({

      id: [user?.id ?? null],

      name: [
        user?.name ?? '',
        [Validators.required, Validators.minLength(3)]
      ],

      email: [
        user?.email ?? '',
        [Validators.required, Validators.email]
      ],

      phone: [
        user?.phone ?? '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)]
      ],

      role: [
        user?.role ?? 'User',
        Validators.required
      ],

      status: [
        user?.status ?? 'Active',
        Validators.required
      ],

      createdAt: [user?.createdAt ?? new Date().toISOString().slice(0, 10)]

    });

  }

  // Check whether a row is editable
  isEditing(row: FormGroup): boolean {

    const id = row.get('id')?.value;

    return id === null || this.editingIds().has(id);

  }

  // Enable editing
  editRow(row: FormGroup): void {

    const id = row.get('id')?.value;

    if (id !== null) {

      this.editingIds.update(ids => {
        const updated = new Set(ids);
        updated.add(id);
        return updated;
      });

    }

  }

  // Add new user row
  addRow(): void {

    const newRow = this.createUserForm();

    this.userRows.push(newRow);

  }

  // Save individual row
  saveRow(row: FormGroup, index: number): void {

    if (row.invalid) {

      row.markAllAsTouched();
      return;

    }

    const value = row.getRawValue();

    const userData = {
      name: value.name,
      email: value.email,
      phone: value.phone,
      role: value.role,
      status: value.status,
      createdAt: value.createdAt
    };

    if (value.id === null) {

      // Add new user
      this.store.addUser(userData).subscribe({

        next: (createdUser) => {

          row.patchValue({
            id: createdUser.id
          });

        },

        error: (error) => {
          console.error('Unable to add user', error);
        }

      });

    } else {

      // Update existing user
      const updatedUser: User = {
        id: value.id,
        ...userData
      };

      this.store.updateUser(updatedUser).subscribe({

        next: () => {
          this.removeEditingState(value.id);
        },

        error: (error) => {
          console.error('Unable to update user', error);
        }

      });

    }

  }

  // Cancel editing
  cancelRow(row: FormGroup, index: number): void {

    const id = row.get('id')?.value;

    // New unsaved row
    if (id === null) {

      this.userRows.removeAt(index);
      return;

    }

    // Restore original data
    const originalUser = this.store.users().find(
      user => user.id === id
    );

    if (originalUser) {

      row.reset({
        ...originalUser
      });

    }

    this.removeEditingState(id);

  }

  // Remove editing state
  private removeEditingState(id: number): void {

    this.editingIds.update(ids => {

      const updated = new Set(ids);
      updated.delete(id);

      return updated;

    });

  }

  // Delete user
  deleteRow(row: FormGroup, index: number): void {

    const id = row.get('id')?.value;

    if (id === null) {

      this.userRows.removeAt(index);
      return;

    }

    this.store.deleteUser(id).subscribe({

      next: () => {
        this.userRows.removeAt(index);
      },

      error: (error) => {
        console.error('Unable to delete user', error);
      }

    });

  }

}