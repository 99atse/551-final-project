import { useParams } from "react-router-dom";
import { EventQuery } from "./event_query";
import { VenueQuery } from "./venue_query";

const CATEGORY_MODE_MAP: Record<string, "events" | "venues"> = {
  "sporting-events": "venues",
  "weddings": "venues",
  "concerts-festivals": "events",
  "conventions": "events",
  "conferences": "events",
};

export function CategoryRouter() {
  const { userType, category } = useParams<{
    userType: string;
    category: string;
  }>();

  if (!category || !userType) return null;

  // default fallback
  const mode = CATEGORY_MODE_MAP[category] ?? "events";

  // organizer override (optional rule you had earlier)
  const isOrganizer = userType === "organizer";

  if (isOrganizer) {
    return <VenueQuery />;
  }

  return mode === "venues" ? <VenueQuery /> : <EventQuery />;
}