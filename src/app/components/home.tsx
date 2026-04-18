import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Music,
  Trophy,
  Heart,
  Users,
  Briefcase,
  ArrowLeft
} from 'lucide-react';
import { EventCard } from './event_card';
import { VenueCard } from './venue_card';

export function Home() {
  const { userType } = useParams<{ userType: string }>();

  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch("/api/categories/counts");
        if (!res.ok) throw new Error("Failed to fetch counts");

        const data = await res.json();
        setCounts(data);
      } catch (err) {
        console.error("Error fetching category counts:", err);
      }
    };

    fetchCounts();
  }, []);

  const categories = [
    {
      title: "Concerts/Festivals",
      description: "Live music events, festivals, and performances",
      icon: Music,
      path: `/${userType}/category/concerts-festivals`,
    },
    {
      title: "Sporting Events",
      description: "Professional sports games and competitions",
      icon: Trophy,
      path: `/${userType}/category/sporting-events`,
    },
    {
      title: "Weddings",
      description: "Wedding ceremonies and receptions",
      icon: Heart,
      path: `/${userType}/category/weddings`,
    },
    {
      title: "Conventions",
      description: "Pop culture, gaming, and entertainment conventions",
      icon: Users,
      path: `/${userType}/category/conventions`,
    },
    {
      title: "Conferences",
      description: "Professional conferences and business events",
      icon: Briefcase,
      path: `/${userType}/category/conferences`,
    }
  ];

  const userTypeLabel =
    userType === 'attendee'
      ? 'Event Attendee'
      : userType === 'organizer'
      ? 'Event Organizer/Booker'
      : 'Researcher/Analyst';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="size-4" />
            Change User Type
          </Link>

          <div className="text-center mb-12">
            <h1 className="mb-2">Select Event Category</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              You are browsing as:{" "}
              <span className="font-medium text-foreground">
                {userTypeLabel}
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <EventCard
                key={category.path}
                title={category.title}
                description={category.description}
                icon={category.icon}
                path={category.path}
                eventCount={counts[category.title] ?? 0}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}