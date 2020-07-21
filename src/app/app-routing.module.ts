import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostManagerComponent } from "./posts/post-manager/post-manager.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { PostViewComponent } from "./posts/post-view/post-view.component";
import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
  { path: "", component: PostManagerComponent },
  { path: "create", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "edit/:postId", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "view/:postId", component: PostViewComponent},
  { path: "auth", loadChildren: "./auth/auth.module#AuthModule"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
