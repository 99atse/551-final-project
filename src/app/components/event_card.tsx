import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  eventCount: number;
}

export function EventCard({ title, description, icon: Icon, path, eventCount }: CategoryCardProps) {
  return (
    <Link to={path} className="block transition-transform hover:scale-105">
      <Card className="h-full cursor-pointer hover:shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="size-6 text-primary" />
            </div>
            <CardTitle>{title}</CardTitle>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {eventCount} events available
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}