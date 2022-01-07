import { PostListComponent } from "./posts/post-list/post-list.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignUpComponent } from "./auth/signup/signup.component";
import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
  { 
    path: "", 
    component: PostListComponent 
  },
  { 
    path: "create", 
    component: PostCreateComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: "edit/:postId", 
    component: PostCreateComponent, 
    canActivate: [AuthGuard] 
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(mod => mod.AuthModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
