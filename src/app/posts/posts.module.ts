import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../angular-material.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { CommentsModule } from "./../comments/comments.module";

import { PostCreateComponent } from "./post-create/post-create.component";
import { PostViewComponent } from "./post-view/post-view.component";
import { PostListComponent } from "./post-list/post-list.component";
import { StarRatingComponent } from "./star-rating/star-rating.component";
import { SortPostComponent } from "./sort-post/sort-post.component";
import { PostManagerComponent } from "./post-manager/post-manager.component";
import { PostSearchComponent } from "./post-search/post-search.component";
import { TranslateModule } from "../translate/translate.module";



@NgModule({
  declarations: [PostCreateComponent,
                 PostListComponent,
                 PostViewComponent,
                 StarRatingComponent,
                 SortPostComponent, 
                 PostManagerComponent,
                 PostSearchComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    CommentsModule,
    TranslateModule
  ]
})
export class PostsModule {}
