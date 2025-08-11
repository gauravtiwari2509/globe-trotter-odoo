interface Recommendations {
  recommendedPlaces: RecommendedPlace[];
  suggestions: string;
}

interface PlaceData {
  id: string;
  name: string;
  slug: string;
  lat: number;
  lng: number;
  costIndex: number;
  popularity: number;
  meta: {
    theme: string;
    description: string;
    best_time_to_visit: string;
  };
  country: {
    id: string;
    name: string;
    code: string;
    currency: string;
  };
  activities: Activity[];
}

interface Activity {
  id: string;
  title: string;
  description: string;
  type: string;
  avgDurationMin: number;
  price: number;
  images: {
    url: string;
    altText: string;
  }[];
  tags: string[];
  meta: {
    traveler_tips: string;
  };
}

interface TripPlan {
  places: (PlaceData & { selectedActivities: Activity[] })[];
}
interface RecommendedPlace {
  placeName: string;
  description: string;
  bestTimeToVisit: string;
}
