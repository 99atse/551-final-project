import { createBrowserRouter } from 'react-router-dom';
import { UserTypeSelection } from './components/user_type_selection';
import { Home } from './components/home';
import { CategoryRouter } from "./components/category_router";
import { BookingTicket } from "./components/ticket_booking";
import { BookingVenue } from "./components/venue_booking";
import { EventAnalytics } from './components/event_analytics';
import { VenueAnalytics } from './components/venue_analytics';
import { NotFound } from "./components/not_found";

export const router = createBrowserRouter([
  { path: "/", Component: UserTypeSelection },
  { path: "/:userType/categories", Component: Home },
  { path: "/:userType/category/:category", Component: CategoryRouter },
  { path: "/:userType/category/:category/book-ticket/:eventId", Component: BookingTicket },
  { path: "/:userType/category/:category/book-venue/:venueId", Component: BookingVenue },
  { path: "/:userType/category/:category/analytics/venue/:venueId", Component: VenueAnalytics },
  { path: "/:userType/category/:category/analytics/:eventId", Component: EventAnalytics },
  { path: "*", Component: NotFound },
]);