import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, TrendingUp, Ticket, Star, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

export function EventAnalytics() {
  const { eventId, userType, category } = useParams<{ eventId: string; userType: string; category: string }>();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [demographics, setDemographics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);

    Promise.all([
      fetch(`/api/analytics/events/${eventId}`),
      fetch(`/api/analytics/events/${eventId}/tickets`),
      fetch(`/api/analytics/events/${eventId}/demographics`),
    ])
      .then(async ([analyticsRes, ticketsRes, demoRes]) => {
        if (!analyticsRes.ok) throw new Error('Event not found');
        const analyticsData = await analyticsRes.json();
        const ticketsData = ticketsRes.ok ? await ticketsRes.json() : [];
        const demoData = demoRes.ok ? await demoRes.json() : null;
        setAnalytics(analyticsData);
        setTickets(ticketsData);
        setDemographics(demoData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [eventId]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Loading event analytics...</p>
    </div>
  );

  if (error || !analytics) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Event Not Found</CardTitle>
          <CardDescription>The event analytics you're looking for doesn't exist.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate(`/${userType}/categories`)}>
            Return to Categories
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const event = analytics.detail;

  const totalDemoCount = (arr: any[]) =>
    arr.reduce((sum, row) => sum + parseInt(row.count), 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">

          <Link
            to={`/${userType}/category/${category}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="size-4" />
            Back to Events
          </Link>

          <div className="mb-8">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h1 className="mb-2">{event.name}</h1>
                <p className="text-muted-foreground">
                  Detailed analytics and performance metrics for this event
                </p>
              </div>
              <Badge variant={event.status === 'scheduled' ? 'default' : 'secondary'} className="ml-4">
                {event.status}
              </Badge>
            </div>
          </div>

          {/* Event Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="size-5" />
                Event Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="size-4" />
                    <span className="text-sm">Date & Time</span>
                  </div>
                  <p className="font-medium">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {event.start_time?.slice(0, 5)} - {event.end_time?.slice(0, 5)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <MapPin className="size-4" />
                    <span className="text-sm">Venue</span>
                  </div>
                  <p className="font-medium">{event.venue_name}</p>
                  <p className="text-sm text-muted-foreground">{event.city}, {event.state}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Users className="size-4" />
                    <span className="text-sm">Capacity</span>
                  </div>
                  <p className="font-medium">{Number(event.capacity).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{event.venue_type}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Star className="size-4" />
                    <span className="text-sm">Rating</span>
                  </div>
                  <p className="font-medium">
                    {event.rating ? `⭐ ${Number(event.rating).toFixed(1)}` : 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">Event rating</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p>{event.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="mb-6">
            <h2 className="mb-4">Key Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${Number(event.total_revenue).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    From {Number(event.tickets_sold).toLocaleString()} tickets sold
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sell-Through Rate</CardTitle>
                  <TrendingUp className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Number(event.sell_through_pct).toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Number(event.tickets_sold).toLocaleString()} of {Number(event.capacity).toLocaleString()} capacity
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Ticket Price</CardTitle>
                  <Ticket className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${Number(event.avg_ticket_price).toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Range: ${Number(event.min_ticket_price).toFixed(2)} - ${Number(event.max_ticket_price).toFixed(2)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tickets Available</CardTitle>
                  <Ticket className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Number(event.tickets_available).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    of {Number(event.total_tickets).toLocaleString()} total
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Ticket Type Breakdown */}
          {tickets.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Ticket Type Breakdown</CardTitle>
                <CardDescription>Performance analysis by ticket category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tickets.map((ticket: any, index: number) => {
                    const sellThroughPct = ticket.total_quantity > 0
                      ? ((ticket.total_sold / ticket.total_quantity) * 100).toFixed(1)
                      : '0.0';
                    const revenue = (ticket.total_sold * ticket.min_price).toLocaleString();

                    return (
                      <div key={ticket.type}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{ticket.type}</h3>
                              {ticket.min_price === ticket.max_price
                                ? <Badge variant="outline">${Number(ticket.min_price).toFixed(2)}</Badge>
                                : <Badge variant="outline">${Number(ticket.min_price).toFixed(2)} - ${Number(ticket.max_price).toFixed(2)}</Badge>
                              }
                            </div>
                            <div className="flex gap-4 mt-2 text-sm flex-wrap">
                              <span className="text-muted-foreground">
                                Sold: <span className="font-medium text-foreground">{Number(ticket.total_sold).toLocaleString()}</span>
                              </span>
                              <span className="text-muted-foreground">
                                Available: <span className="font-medium text-foreground">{Number(ticket.total_available).toLocaleString()}</span>
                              </span>
                              <span className="text-muted-foreground">
                                Total: <span className="font-medium text-foreground">{Number(ticket.total_quantity).toLocaleString()}</span>
                              </span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-lg font-bold">${revenue}</div>
                            <div className="text-sm text-muted-foreground">Revenue</div>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div className="bg-primary h-full transition-all" style={{ width: `${sellThroughPct}%` }} />
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>{sellThroughPct}% sold</span>
                          <span>{Number(ticket.total_sold).toLocaleString()} / {Number(ticket.total_quantity).toLocaleString()} tickets</span>
                        </div>
                        {index < tickets.length - 1 && <Separator className="mt-4" />}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Demographics */}
          {demographics && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Attendee Demographics</CardTitle>
                <CardDescription>Breakdown of ticket purchasers for this event</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                  {/* Gender */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Gender</h3>
                    <div className="space-y-2">
                      {demographics.gender.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No data available</p>
                      ) : demographics.gender.map((row: any) => {
                        const pct = totalDemoCount(demographics.gender) > 0
                          ? ((parseInt(row.count) / totalDemoCount(demographics.gender)) * 100).toFixed(1)
                          : '0';
                        return (
                          <div key={row.gender}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground capitalize">{row.gender}</span>
                              <span className="font-medium">{pct}% <span className="text-muted-foreground font-normal">({Number(row.count).toLocaleString()})</span></span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                              <div className="bg-primary h-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Age Group</h3>
                    <div className="space-y-2">
                      {demographics.age.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No data available</p>
                      ) : demographics.age.map((row: any) => {
                        const pct = totalDemoCount(demographics.age) > 0
                          ? ((parseInt(row.count) / totalDemoCount(demographics.age)) * 100).toFixed(1)
                          : '0';
                        return (
                          <div key={row.age_group}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">{row.age_group}</span>
                              <span className="font-medium">{pct}% <span className="text-muted-foreground font-normal">({Number(row.count).toLocaleString()})</span></span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                              <div className="bg-primary h-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Race */}
                  <div>
                    <h3 className="text-sm font-medium mb-3">Race / Ethnicity</h3>
                    <div className="space-y-2">
                      {demographics.race.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No data available</p>
                      ) : demographics.race.map((row: any) => {
                        const pct = totalDemoCount(demographics.race) > 0
                          ? ((parseInt(row.count) / totalDemoCount(demographics.race)) * 100).toFixed(1)
                          : '0';
                        return (
                          <div key={row.race}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">{row.race}</span>
                              <span className="font-medium">{pct}% <span className="text-muted-foreground font-normal">({Number(row.count).toLocaleString()})</span></span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                              <div className="bg-primary h-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          )}

          {/* Venue Information */}
          <Card>
            <CardHeader>
              <CardTitle>Venue Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Venue Name</span>
                    <p className="font-medium">{event.venue_name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Location</span>
                    <p className="font-medium">{event.city}, {event.state}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Venue Type</span>
                    <p className="font-medium">{event.venue_type}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Max Capacity</span>
                    <p className="font-medium">{Number(event.max_capacity).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Base Rental Rate</span>
                    <p className="font-medium">${Number(event.base_rental_rate).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Venue Rating</span>
                    <p className="font-medium">⭐ {Number(event.venue_rating).toFixed(1)}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button asChild variant="outline">
                  <Link to={`/${userType}/category/${category}/analytics/venue/${event.venue_id}`}>
                    View Venue Analytics
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}