import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'mat-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css'],

})
export class StarRatingComponent implements OnInit {
  @Input('rating') private rating: number = 0;
  @Input('starCount') private starCount: number = 5;
  @Input('color') private color: string = 'accent';
  @Input() private disabled: boolean = false;
  @Output() private ratingUpdated = new EventEmitter();
  private ratingStars = [];

  constructor() {
  }
  ngOnInit() {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingStars.push(index);
    }
  }
  onClick(rating: number) {
    this.rating = rating;
    this.ratingUpdated.emit(rating);
  }

  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
}
