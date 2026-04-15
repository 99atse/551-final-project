import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from './ui/button';

export function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4">404 - Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button>
            <Home className="size-4 mr-2" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}