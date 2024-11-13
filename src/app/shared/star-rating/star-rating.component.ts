import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent {
  @Input() rating: number = 0;         // Input for star rating value
  @Input() reviewCount: number = 0;     // Input for review count

  // Method to generate the star array based on the rating
  getStarArray(rating: number): number[] {
    const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
    const fullStars = Math.floor(roundedRating);
    const halfStar = roundedRating % 1 ? 0.5 : 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return [
      ...Array(fullStars).fill(1),     // Full stars
      ...Array(halfStar ? 1 : 0).fill(0.5), // Half star if applicable
      ...Array(emptyStars).fill(0)     // Empty stars
    ];
  }
}
