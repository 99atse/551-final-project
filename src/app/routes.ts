import { createBrowserRouter } from 'react-router-dom';
import { UserTypeSelection } from './components/user_type_selection';
import { Home } from './components/home';
import { EventQuery } from './components/event_query';
import { NotFound } from './components/not_found';
import { BookingTicket } from './components/ticket_booking'; 
import { BookingVenue } from './components/venue_booking';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: UserTypeSelection,
  },
  {
    path: '/:userType/categories',
    Component: Home,
  },
  {
    path: '/:userType/category/:category',
    Component: EventQuery,
  },
  {
    path: '/:userType/category/:category/book-ticket/:eventId', 
    Component: BookingTicket,
  },
  {
    path: '/:userType/category/:category/book-venue/:eventId', 
    Component: BookingVenue,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);