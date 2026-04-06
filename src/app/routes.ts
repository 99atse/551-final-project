import { createBrowserRouter } from 'react-router';
import { UserTypeSelection } from './components/user_type_selection';
import { Home } from './components/home';
import { EventQuery } from './components/event_query';
import { NotFound } from './components/not_found';

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
    path: '*',
    Component: NotFound,
  },
]);