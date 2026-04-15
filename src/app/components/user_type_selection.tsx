import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Users, Briefcase, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';

export function UserTypeSelection() {
  const navigate = useNavigate();

  const userTypes = [
    {
      type: 'attendee',
      title: 'Event Attendee',
      description: 'I am looking to attend events',
      icon: Users,
      features: [
        'Search for events to attend',
        'Filter by ticket price and type',
        'Find events by date and location',
        'View venue details and capacity'
      ]
    },
    {
      type: 'organizer',
      title: 'Event Organizer/Booker',
      description: 'I am organizing or booking events',
      icon: Briefcase,
      features: [
        'Search and book venues',
        'Check venue availability',
        'Compare venue rental rates',
        'Manage event bookings'
      ]
    },
    {
      type: 'researcher',
      title: 'Researcher/Analyst',
      description: 'I am analyzing historical event data',
      icon: BarChart3,
      features: [
        'Access historical event data',
        'Analyze transaction patterns',
        'View aggregate statistics',
        'Research demographic trends'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="mb-4">Event Management System</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Welcome! Please select your user type to access customized event search and management tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userTypes.map((userType) => {
              const Icon = userType.icon;
              return (
                <Card key={userType.type} className="flex flex-col transition-all hover:shadow-lg hover:scale-[1.02]">
                  <CardHeader>
                    <div className="flex flex-col items-center text-center mb-4">
                      <div className="p-4 rounded-full bg-primary/10 mb-4">
                        <Icon className="size-12 text-primary" />
                      </div>
                      <CardTitle className="text-2xl">{userType.title}</CardTitle>
                      <CardDescription className="mt-2">{userType.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1 mb-6">
                      <p className="text-sm mb-3">Features:</p>
                      <ul className="space-y-2">
                        {userType.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-primary mt-0.5">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button 
                      onClick={() => navigate(`/${userType.type}/categories`)}
                      size="lg"
                      className="w-full transition-all hover:scale-105"
                    >
                      Continue as {userType.title}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}