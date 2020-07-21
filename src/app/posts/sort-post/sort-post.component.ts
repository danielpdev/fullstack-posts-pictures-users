import { Component, Input, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { Sort } from './sort.model';
import { PostsService } from "../posts.service";
import { AuthService } from "../../auth/auth.service";


@Component({
  selector: "app-sort-post",
  templateUrl: "./sort-post.component.html",
  styleUrls: ["./sort-post.component.css"]
})
export class SortPostComponent {
  @Input() defaultValue: Sort = {
    name: '--',
    value: null
  };
  @Input() name: string = 'Select sort type';
  @Input() sortTypes: Observable<Sort[]>;
  @Output() selectionChanged: Subject<Sort> = new Subject<Sort>();
  currentSelection: Sort;
  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) { }

  onSelctionChanged(selection: Sort) {
    this.currentSelection = selection;
    this.selectionChanged.next(selection);
  }

  getCurrentSelection(): Sort | undefined {
    return this.currentSelection;
  }

}
