import { Component, OnInit, OnDestroy, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { CommentsService } from "./comments.service";
import { Comment } from "../comments/comment.model";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-comment-create",
  templateUrl: "./comment-create.component.html",
  styleUrls: ["./comment-create.component.css"]
})
export class CommentCreateComponent implements OnInit, OnDestroy {
  comment: Comment;
  isLoading = false;
  form: FormGroup;
  private postId: string;
  private addCommentSubscription: Subscription;
  @Output() saveComment: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    public commentsService: CommentsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) { }
  userIsAuthenticated = false;
  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.postId = paramMap.get("postId");
        this.isLoading = false;
      }
    });
  }

  onSaveComment() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;
    this.addCommentSubscription = this.commentsService.addComment(
      this.form.value.email,
      this.form.value.name,
      this.form.value.content,
      this.postId
    ).subscribe(res => {
      this.saveComment.next(res.comment);
      this.isLoading = false;
    });
    this.form.reset();
  }

  ngOnDestroy() {
    if (this.addCommentSubscription) {
      this.addCommentSubscription.unsubscribe();
    }
  }
}
