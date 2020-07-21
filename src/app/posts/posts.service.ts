import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Post } from "./post.model";
import { Comment } from "./../comments/comment.model";
import { Rating } from "./rating.model";
import { Observable } from "rxjs";
import { Sort } from './sort-post/sort.model';

const BACKEND_URL = environment.apiUrl + "/posts/";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number, searchQuery?: string, sortFilter?: Sort[]) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}&searchQuery=${searchQuery}&sortFilter=${sortFilter && sortFilter.map(sort=>{
      return `${sort.name.split(' ')[0]}=${sort.value}`; 
    }).join(';')}`;
    return this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(post => {
              return {
                description: post.description,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
                tags: post.tags,
                dateTaken: post.dateTaken,
                location: post.location,
                comments: post.comments
              };
            }),
            maxPosts: postData.maxPosts
          };
        }),
        tap(transformedPostData => {
          this.posts = transformedPostData.posts;
          this.postsUpdated.next({
            posts: [...this.posts],
            postCount: transformedPostData.maxPosts
          })
        })
      );
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{
      _id: string;
      description: string;
      imagePath: string;
      creator: string;
      tags: string[];
      dateTaken: string;
      location: string;
      comments?: Comment[];
      ratings?: Rating[];
    }>(BACKEND_URL + id);
  }

  addPost(description: string, image: File, 
           location: string, dateTaken: string, tags: string) {
    const postData = new FormData();
    postData.append("description", description);
    postData.append("location", location);
    postData.append("dateTaken", dateTaken);
    postData.append("tags", tags);
    postData.append("image", image, image.name);
    this.http
      .post<{ message: string; post: Post }>(
        BACKEND_URL,
        postData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, description: string, image: File | string,
             location: string, dateTaken: string, tags: string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("description", description);
      postData.append("location", location);
      postData.append("dateTaken", dateTaken);
      postData.append("tags", tags);
      postData.append("image", image, image.name);
    } else {
      postData = {
        id: id,
        description: description,
        imagePath: image,
        creator: null,
        tags: tags as any,
        dateTaken: dateTaken,
        location: location
      };
    }
    this.http
      .put(BACKEND_URL + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }
  
  updateStarRating(id: string, stars: number): Observable<Post> {
    return this.http
      .put<Post>(BACKEND_URL + "rate/"+ id, {id, stars});
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }
}
