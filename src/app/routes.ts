import { createBrowserRouter } from 'react-router-dom';
import { UserTypeSelection } from './components/user_type_selection';
import { Home } from './components/home';
import { EventQuery } from './components/event_query';
import { NotFound } from './components/not_found';
import { BookingForm } from './components/ticket_booking'; 

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
    path: '/:userType/category/:category/book/:eventId', 
    Component: BookingForm,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);