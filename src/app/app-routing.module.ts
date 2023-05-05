import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddUsersComponent } from './components/add-users/add-users.component';
import { EditUsersComponent } from './components/edit-users/edit-users.component';
import { DeleteUsersComponent } from './components/delete-users/delete-users.component';

const routes: Routes = [
  { path: 'addUsers', component: AddUsersComponent },
  { path: 'editUsers', component: EditUsersComponent },
  { path: 'deleteUsers', component: DeleteUsersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
