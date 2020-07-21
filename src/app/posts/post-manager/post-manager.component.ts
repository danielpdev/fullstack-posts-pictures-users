import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from "@angular/core";
import { Subscription, Observable, of, BehaviorSubject, Subject } from "rxjs";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { AuthService } from "../../auth/auth.service";
import { Sort } from '../sort-post/sort.model';
import { switchMap, map, combineLatest, startWith } from 'rxjs/operators';
import { locationSort, dataSort } from './../sort-post/sort-data';
import { SortPostComponent } from "../sort-post/sort-post.component";
@Component({
  selector: "app-post-manager",
  templateUrl: "./post-manager.component.html",
  styleUrls: ["./post-manager.component.css"]
})
export class PostManagerComponent implements OnInit, OnDestroy {
  posts: BehaviorSubject<Post[]>  = new BehaviorSubject<Post[]>(null);
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  @ViewChildren(SortPostComponent) sortPostComponents: QueryList<SortPostComponent>;
  dateSort: Observable<Sort[]> = of(dataSort);
  locationSort: Observable<Sort[]> = of(locationSort);
  sorting$ : Subject<any>  = new Subject<any>();
  search$ : Subject<any> = new Subject<any>();
  listPageChanged$ : Subject<any> = new Subject<any>();
  subscriptions: Subscription[] = [];
  constructor(
    public postsService: PostsService,
    private authService: AuthService
  ) {}
  ngOnInit() { 
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.subscriptions.push(this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
    }));
      
    this.subscriptions.push(this.postsService
    .getPostUpdateListener()
    .subscribe((postData: { posts: Post[]; postCount: number }) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts.next(postData.posts);
    }));

    this.subscriptions.push(this.search$.pipe(
      startWith(''),
      map(searchQuery => ({searchQuery})),
      combineLatest(this.sorting$.pipe(startWith(''), map(sorting => ({sorting})))),
      combineLatest(this.listPageChanged$.pipe(startWith({}))),
      switchMap((finalData: [[{ searchQuery: string; }, { sorting: any; }], {postsPerPage: number, currentPage: number}]) => {
        this.isLoading = true;
        return  this.postsService.getPosts(
          finalData[1].postsPerPage || 5, finalData[1].currentPage || 1,
          finalData[0][0].searchQuery || '', finalData[0][1].sorting || '')
    })
    ).subscribe((res) => {
      this.isLoading = false;
    }));
  }
  onSearchChanged(value: string) {
    this.search$.next(value);
  }
  sortingChanged(event: any) {
    const sorting = this.sortPostComponents.map(sort => {
      if(sort.getCurrentSelection())
        return sort.getCurrentSelection().value
    }).filter(sort => sort);

    this.sorting$.next(sorting);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(res => {
      this.isLoading = false;
      this.search$.next();
    })
  }

  onChangedPage(pageData: any) {
    this.listPageChanged$.next({postsPerPage: pageData.postsPerPage, currentPage: pageData.currentPage});
  }

  ngOnDestroy() {
    this.subscriptions.filter(sub => sub).forEach(sub => sub.unsubscribe());
  }
}
