import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Subscription } from "rxjs";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { AuthService } from "../../auth/auth.service";
import { StarRatingComponent } from "./../star-rating/star-rating.component";
import { Comment } from './../../comments/comment.model';

@Component({
  selector: "app-view-post",
  templateUrl: "./post-view.component.html",
  styleUrls: ["./post-view.component.css"]
})
export class PostViewComponent implements OnInit, OnDestroy {
  @ViewChild(StarRatingComponent, {static: false}) ratingComponent: StarRatingComponent;
  userIsAuthenticated = false;
  post: Post;
  isLoading = false;
  imagePreview: string;
  private postId: string;
  private authStatusSub: Subscription;
  userId: string;
  deleteSubscription: Subscription;
  
  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
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
            comments: postData.comments,
            ratings: {
              rate: postData.ratings.reduce((sum, rating ) => sum + rating.stars, 0) / postData.ratings.length,
              no: postData.ratings.length,
              userRating: postData.ratings.reverse().find(rating => rating.ratedBy === this.authService.getUserId())
            } as any
          };
        
        });
      } else {
        this.postId = null;
      }
    });
  }
  
  onRatingUpdated(stars: number) {
    this.postsService.updateStarRating(this.postId, stars).subscribe((res: any) => {
      if(res.post){
        (<any>this.post.ratings).rate = res.post.ratings.reduce((sum, rating ) => sum + rating.stars, 0) / res.post.ratings.length; 
        (<any>this.post.ratings).no = res.post.ratings.length; 
        (<any>this.post.ratings).userRating = { stars: res.post.ratings.pop().stars }; 
      }
    });
  }

  onSavedComment(comment: Comment) {
    if(comment){
      this.post.comments.push(comment);
    }
  }

  onDelete(postId: string) {
    this.deleteSubscription = this.postsService.deletePost(postId).subscribe((res: any) => {
      if(res.message === "Deletion successful!") {
        this.router.navigate(['/']);
      }
    });
  }
  ngOnDestroy() {
    if(this.authStatusSub) {
      this.authStatusSub.unsubscribe();
    }
    if(this.deleteSubscription){
      this.deleteSubscription.unsubscribe();
    }
  }
  
  
}
