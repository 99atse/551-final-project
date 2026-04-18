import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Users, DollarSign, TrendingUp, Star, Building2, Phone, Mail, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

export function VenueAnalytics() {
  const { venueId, userType, category } = useParams<{ venueId: string; userType: string; category: string }>();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!venueId) return;
    setLoading(true);
    fetch(`/api/analytics/venues/${venueId}`)
      .then(res => {
        if (!res.ok) throw new Error('Venue not found');
        return res.json();
      })
      .then(data => { setAnalytics(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [venueId]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Loading venue analytics...</p>
    </div>
  );

  if (error || !analytics) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Venue Not Found</CardTitle>
          <CardDescription>The venue analytics you're looking for doesn't exist.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate(`/${userType}/categories`)}>Return to Categories</Button>
        </CardContent>
      </Card>
    </div>
  );

  const venue = analytics.detail;
  const events = analytics.events ?? [];

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

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h1 className="mb-2">{venue.venue_name}</h1>
                <p className="text-muted-foreground">
                  Detailed analytics and performance metrics for this venue
                </p>
              </div>
              <Badge variant="outline" className="ml-4 text-base px-3 py-1">
                ⭐ {Number(venue.venue_rating).toFixed(1)}
              </Badge>
            </div>
          </div>

          {/* Venue Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="size-5" />
                Venue Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <MapPin className="size-4" />
                    <span className="text-sm">Location</span>
                  </div>
                  <p className="font-medium">{venue.city}, {venue.state}</p>
                  <p className="text-sm text-muted-foreground">{venue.address}</p>
                  <p className="text-sm text-muted-foreground">{venue.zipcode}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Building2 className="size-4" />
                    <span className="text-sm">Venue Type</span>
                  </div>
                  <p className="font-medium">{venue.venue_type}</p>
                  <p className="text-sm text-muted-foreground">
                    Max capacity: {Number(venue.max_capacity).toLocaleString()}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <DollarSign className="size-4" />
                    <span className="text-sm">Base Rental Rate</span>
                  </div>
                  <p className="font-medium">${Number(venue.base_rental_rate).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Per event</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="size-4" />
                    <span className="text-sm">Total Events Hosted</span>
                  </div>
                  <p className="font-medium">{Number(venue.total_events).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Across all time</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Contact</p>
                  <p className="font-medium">{venue.contact_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-muted-foreground" />
                  <p className="text-sm">{venue.contact_phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />
                  <p className="text-sm">{venue.contact_email}</p>
                </div>
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
                  <div className="text-2xl font-bold">${Number(venue.total_revenue).toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    From {Number(venue.total_tickets_sold).toLocaleString()} tickets sold
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Sell-Through</CardTitle>
                  <TrendingUp className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{Number(venue.avg_sell_through_pct).toFixed(1)}%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Number(venue.total_tickets_sold).toLocaleString()} of {Number(venue.total_capacity).toLocaleString()} total capacity
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Ticket Price</CardTitle>
                  <Users className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${Number(venue.avg_ticket_price).toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Range: ${Number(venue.min_ticket_price).toFixed(2)} - ${Number(venue.max_ticket_price).toFixed(2)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Event Rating</CardTitle>
                  <Star className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">⭐ {Number(venue.avg_event_rating).toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Across {Number(venue.total_events).toLocaleString()} events
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Events at this venue */}
          <Card>
            <CardHeader>
              <CardTitle>Events at This Venue</CardTitle>
              <CardDescription>
                All events hosted at {venue.venue_name}, sorted by most recent
              </CardDescription>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No events found for this venue.</p>
              ) : (
                <div className="space-y-4">
                  {events.map((event: any, index: number) => (
                    <div key={event.event_id}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{event.name}</p>
                            <Badge variant={event.status === "scheduled" ? "default" : "secondary"} className="text-xs">
                              {event.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mt-2">
                            <div>
                              <span className="text-muted-foreground">Date:</span>
                              <p>{new Date(event.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Capacity:</span>
                              <p>{Number(event.capacity).toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Tickets Sold:</span>
                              <p>{Number(event.tickets_sold).toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Sell-Through:</span>
                              <p>{Number(event.sell_through_pct).toFixed(1)}%</p>
                            </div>
                          </div>
                          <div className="mt-2 w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-primary h-full transition-all"
                              style={{ width: `${Math.min(Number(event.sell_through_pct), 100)}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm text-muted-foreground">Rating</p>
                          <p className="font-medium">⭐ {event.rating ? Number(event.rating).toFixed(1) : "N/A"}</p>
                          <Button asChild variant="outline" size="sm" className="mt-2">
                            <Link to={`/${userType}/category/${category}/analytics/${event.event_id}`}>
                              Event Analytics
                            </Link>
                          </Button>
                        </div>
                      </div>
                      {index < events.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}