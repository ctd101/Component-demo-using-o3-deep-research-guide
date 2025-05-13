export interface Coordinates {
  lat: number;
  lng: number;
}

export interface What3WordsSuggestion {
  words: string;
  country: string;
  nearestPlace: string;
  distanceToFocusKm?: number;
  rank?: number;
}

export interface SelectionDetail {
  suggestion: What3WordsSuggestion;
}

export interface SelectionEvent {
  detail: SelectionDetail;
}
