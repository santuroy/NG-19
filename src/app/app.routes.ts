import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'users',
		loadChildren: () => import('./features/users/user.routes').then((module) => module.USER_ROUTES)
	},

//     {
//     path: 'users',
//     loadChildren: () =>
//       import('./features/users/user.routes')
//         .then(m => m.USER_ROUTES)
//   },

  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'users'
  }
];
