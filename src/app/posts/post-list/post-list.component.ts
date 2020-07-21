import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Observable } from "rxjs";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit {
  @Input() posts: Observable<Post[]>;
  @Output() pageChanged: EventEmitter<{ postsPerPage: number, currentPage: number }> = new EventEmitter();
  @Output() delete: EventEmitter<string> = new EventEmitter();
  @Input() totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  @Input() userIsAuthenticated = false;
  @Input() userId: string;

  constructor(
    public postsService: PostsService,
  ) { }

  ngOnInit() {
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.pageChanged.emit({ postsPerPage: this.postsPerPage, currentPage: this.currentPage });
  }

  onDelete(postId: string) {
    this.delete.emit(postId);
  }
}
