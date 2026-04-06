import { useParams, Link } from 'react-router';
import { Music, Trophy, Heart, Users, Briefcase } from 'lucide-react';
import { CategoryCard } from './category_card';
import { mockEvents } from '../data/mock_events';
import { ArrowLeft } from 'lucide-react';

export function Home() {
  const { userType } = useParams<{ userType: string }>();
  
  const categories = [
    {
      title: "Concerts/Festivals",
      description: "Live music events, festivals, and performances",
      icon: Music,
      path: `/${userType}/category/concerts-festivals`,
      count: mockEvents.filter(e => e.type === "Concerts/Festivals").length
    },
    {
      title: "Sporting Events",
      description: "Professional sports games and competitions",
      icon: Trophy,
      path: `/${userType}/category/sporting-events`,
      count: mockEvents.filter(e => e.type === "Sporting Events").length
    },
    {
      title: "Weddings",
      description: "Wedding ceremonies and receptions",
      icon: Heart,
      path: `/${userType}/category/weddings`,
      count: mockEvents.filter(e => e.type === "Weddings").length
    },
    {
      title: "Conventions",
      description: "Pop culture, gaming, and entertainment conventions",
      icon: Users,
      path: `/${userType}/category/conventions`,
      count: mockEvents.filter(e => e.type === "Conventions").length
    },
    {
      title: "Conferences",
      description: "Professional conferences and business events",
      icon: Briefcase,
      path: `/${userType}/category/conferences`,
      count: mockEvents.filter(e => e.type === "Conferences").length
    }
  ];

  const userTypeLabel = userType === 'attendee' ? 'Event Attendee' : 
                       userType === 'organizer' ? 'Event Organizer/Booker' : 
                       'Researcher/Analyst';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="size-4" />
            Change User Type
          </Link>

          <div className="text-center mb-12">
            <h1 className="mb-2">Select Event Category</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              You are browsing as: <span className="font-medium text-foreground">{userTypeLabel}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.path}
                title={category.title}
                description={category.description}
                icon={category.icon}
                path={category.path}
                eventCount={category.count}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}