import { Component, Input , Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.css']
})
export class StarRatingComponent {
  @Input() rating: number = 0;         // Input for star rating value
  @Input() reviewCount?: number;     // Input for review count
  @Input() interactive: boolean = false; // Enable interaction
  @Output() ratingChange = new EventEmitter<number>(); // Emit new rating to parent

  // Holds the rating displayed visually on hover or when set
  hoveredRating: number | null = null;
  
  // Function to generate an array for star filling
  getStarArray(): number[] {
    const displayRating = this.hoveredRating ?? this.rating;
    const roundedRating = Math.round(displayRating * 2) / 2;
    const fullStars = Math.floor(roundedRating);
    const halfStar = roundedRating % 1 === 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return [
      ...Array(fullStars).fill(1),
      ...Array(halfStar).fill(0.5),
      ...Array(emptyStars).fill(0)
    ];
  }

  // Handle click to set a new rating
  setRating(newRating: number) {
    if (this.interactive) {
      this.rating = newRating;
      this.ratingChange.emit(newRating); // Emit new rating
    }
  }

  // Handle hover for visual feedback
  onHover(newRating: number) {
    if (this.interactive) {
      this.hoveredRating = newRating;
    }
  }

  // Reset hover effect
  onLeave() {
    if (this.interactive) {
      this.hoveredRating = null;
    }
  }
}
