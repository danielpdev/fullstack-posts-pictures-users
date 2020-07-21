import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { Observable } from "rxjs";

import { environment } from "../../environments/environment";
import { Comment } from "./comment.model";

const BACKEND_URL = environment.apiUrl + "/comments/";

@Injectable({ providedIn: "root" })
export class CommentsService {
  private comment: Comment[] = [];
  constructor(private http: HttpClient, private router: Router) { }

  addComment(email: string, name: string, content: string, postId: string): Observable<any> {
    const comment = {
      email,
      name,
      content,
      postId
    };
    return this.http
      .post<{ message: string; comment: Comment }>(
        BACKEND_URL,
        comment
      );
  }

}
