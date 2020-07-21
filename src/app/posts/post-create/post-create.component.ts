import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { CustomValidators } from './custom-validators/custom.validator';

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";
import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Tag } from '../tag.model';


@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit, OnDestroy {
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  mode = "create";
  private postId: string;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON];
  tags: Tag[] = [];
  private paramMapSubscription: Subscription

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.form = new FormGroup({
      description: new FormControl(null, { validators: [Validators.required] }),
      tags: new FormControl(null, { validators: [CustomValidators.validateRequired] }),
      dateTaken: new FormControl(null, { validators: [Validators.required] }),
      location: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.paramMapSubscription = this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            description: postData.description,
            imagePath: postData.imagePath,
            creator: postData.creator,
            tags: postData.tags,
            dateTaken: postData.dateTaken,
            location: postData.location,
            comments: postData.comments
          };
          this.form.setValue({
            description: this.post.description,
            tags: null,
            image: this.post.imagePath,
            dateTaken: new Date(this.post.dateTaken),
            location: this.post.location
          });
          this.tags = this.post.tags.map(tag => ({ name: tag }));
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.get("tags").value === null) {
      this.form.get("tags").setValue(this.tags);
    }
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.description,
        this.form.value.image,
        this.form.value.location,
        this.form.value.dateTaken,
        this.tags.map(({ name }) => name).join(";")
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.description,
        this.form.value.image,
        this.form.value.location,
        this.form.value.dateTaken,
        this.tags.map(({ name }) => name).join(";")
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.paramMapSubscription.unsubscribe();
  }

  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.tags.push({ name: value.trim() });
    }

    if (input) {
      input.value = '';
    }
  }

  remove(tag: Tag): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
    if (this.tags.length === 0)
      this.form.get('tags').setValue(this.tags);
  }
}
