import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { CommentsService } from './comments.service';
import { CommentCreateComponent } from './comment-create.component';
import { ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../angular-material.module";
import { TranslateModule } from "../translate/translate.module";

@NgModule({
  declarations: [
    CommentCreateComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    TranslateModule
  ],
  exports: [
      CommentCreateComponent
  ],
  providers: [
    CommentsService
  ],
})
export class CommentsModule {}
