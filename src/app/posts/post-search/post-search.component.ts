import { Component, OnDestroy, Output, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import {  Subject, fromEvent } from "rxjs";

import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: "app-post-search",
  templateUrl: "./post-search.component.html",
  styleUrls: ["./post-search.component.css"]
})
export class PostSearchComponent implements OnDestroy, AfterViewInit {

  @Output() searchChanged: Subject<any> = new Subject<any>();
  @ViewChild('input', { static: false }) searchInput: ElementRef;
  private subscriptions = [];

  ngAfterViewInit() {
    const keyUp$ = fromEvent(this.searchInput.nativeElement, 'keyup').pipe(
      map((event: any) => event.target.value),
      debounceTime(400),
      distinctUntilChanged(),
    );

    this.searchChanged.observers.forEach(observer => {
      this.subscriptions.push(keyUp$.subscribe(observer));
    })
  }

  ngOnDestroy() {
    this.subscriptions.filter(sub => sub).forEach(sub => sub.unsubscribe());
  }

}
