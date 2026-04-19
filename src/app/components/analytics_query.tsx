import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Search, Database, BarChart3, Building2,
  DollarSign, TrendingUp, Users, Star, Ticket, Calendar,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "./ui/select";

// ── Types ─────────────────────────────────────────────────

interface Event {
  event_id: number;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  type: string;
  status: string;
  description: string;
  rating: number;
  venue_id: number;
  venue_name: string;
  city: string;
  state: string;
  venue_type: string;
  base_rental_rate: number;
  total_tickets: number;
  tickets_sold: number;
  tickets_available: number;
  min_ticket_price: number;
  max_ticket_price: number;
}

interface VenueResult {
  venue_id: number;
  venue_name: string;
  city: string;
  state: string;
  venue_type: string;
  max_capacity: number;
  base_rental_rate: number;
  venue_rating: number;
  total_events: number;
  total_tickets_sold: number;
  avg_sell_through_pct: number;
  avg_ticket_price: number;
  total_revenue: number;
  avg_event_rating: number;
}

interface EventSummary {
  event_count: number;
  avg_capacity: number;
  avg_event_rating: number;
  avg_ticket_price: number;
  avg_sell_through_pct: number;
  total_tickets_sold: number;
  total_capacity: number;
  total_revenue: number;
}

interface VenueSummary {
  total_venues: number;
  total_events: number;
  avg_venue_rating: number;
  avg_sell_through_pct: number;
  total_tickets_sold: number;
  total_capacity: number;
  total_revenue: number;
  breakdown: VenueResult[];
}

const categoryMap: { [key: string]: string } = {
  "concerts-festivals": "Concerts/Festivals",
  "sporting-events": "Sporting Events",
  weddings: "Weddings",
  conventions: "Conventions",
  conferences: "Conferences",
};

// ── Inlined summary cards ─────────────────────────────────

function EventSummaryCards({ summary }: { summary: EventSummary }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="mb-1">Analytics Summary</h2>
        <p className="text-sm text-muted-foreground">Aggregate statistics across all queried events</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <BarChart3 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.event_count}</div>
            <p className="text-xs text-muted-foreground mt-1">Events matching query</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Capacity</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(summary.avg_capacity).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Average event capacity</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Event Rating</CardTitle>
            <Star className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">⭐ {Number(summary.avg_event_rating).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Average event rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Ticket Price</CardTitle>
            <Ticket className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Number(summary.avg_ticket_price).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all ticket types</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sell-Through</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(summary.avg_sell_through_pct).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Number(summary.total_tickets_sold).toLocaleString()} of {Number(summary.total_capacity).toLocaleString()} tickets sold
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Number(summary.total_revenue).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all events</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function VenueSummaryCards({ summary }: { summary: VenueSummary }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="mb-1">Analytics Summary</h2>
        <p className="text-sm text-muted-foreground">Aggregate statistics across all queried venues</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Venues</CardTitle>
            <Building2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total_venues}</div>
            <p className="text-xs text-muted-foreground mt-1">Matching query</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events Hosted</CardTitle>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(summary.total_events).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all venues</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Venue Rating</CardTitle>
            <Star className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">⭐ {Number(summary.avg_venue_rating).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Average venue rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sell-Through</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(summary.avg_sell_through_pct).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Number(summary.total_tickets_sold).toLocaleString()} of {Number(summary.total_capacity).toLocaleString()} tickets sold
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Number(summary.total_revenue).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all venues</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────

export function AnalyticsQuery() {
  const { category, userType } = useParams<{ category: string; userType: string }>();
  const categoryName = category ? categoryMap[category] : "";

  const [mode, setMode] = useState<"event" | "venue">("event");

  const [eventFilters, setEventFilters] = useState({
    searchTerm: "", dateFrom: "", dateTo: "", city: "", state: "",
    venueType: "", minCapacity: "", maxCapacity: "", minTicketPrice: "",
    maxTicketPrice: "", eventStatus: "", minEventRating: "", minVenueRating: "",
  });

  const [venueFilters, setVenueFilters] = useState({
    city: "", state: "", venueType: "", minCapacity: "", maxCapacity: "",
    minRentalRate: "", maxRentalRate: "", minVenueRating: "",
    minTotalEvents: "", minSellThrough: "", minTotalRevenue: "",
  });

  const [eventResults, setEventResults] = useState<Event[]>([]);
  const [venueResults, setVenueResults] = useState<VenueResult[]>([]);
  const [eventSummary, setEventSummary] = useState<EventSummary | null>(null);
  const [venueSummary, setVenueSummary] = useState<VenueSummary | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedSQL, setGeneratedSQL] = useState("");

  // ── Event search ───────────────────────────────────────

  const handleEventSearch = async () => {
    setIsLoading(true);
    setError("");

    const params = new URLSearchParams();
    params.append("type", categoryName);
    if (eventFilters.searchTerm)     params.append("search", eventFilters.searchTerm);
    if (eventFilters.dateFrom)       params.append("dateFrom", eventFilters.dateFrom);
    if (eventFilters.dateTo)         params.append("dateTo", eventFilters.dateTo);
    if (eventFilters.city)           params.append("city", eventFilters.city);
    if (eventFilters.state)          params.append("state", eventFilters.state);
    if (eventFilters.venueType)      params.append("venueType", eventFilters.venueType);
    if (eventFilters.minCapacity)    params.append("minCapacity", eventFilters.minCapacity);
    if (eventFilters.maxCapacity)    params.append("maxCapacity", eventFilters.maxCapacity);
    if (eventFilters.minTicketPrice) params.append("minTicketPrice", eventFilters.minTicketPrice);
    if (eventFilters.maxTicketPrice) params.append("maxTicketPrice", eventFilters.maxTicketPrice);
    if (eventFilters.minEventRating) params.append("minEventRating", eventFilters.minEventRating);
    if (eventFilters.minVenueRating) params.append("minVenueRating", eventFilters.minVenueRating);
    if (eventFilters.eventStatus && eventFilters.eventStatus !== "all") {
      params.append("status", eventFilters.eventStatus);
    }

    const summaryParams = new URLSearchParams();
    summaryParams.append("type", categoryName);
    if (eventFilters.state)     summaryParams.append("state", eventFilters.state);
    if (eventFilters.city)      summaryParams.append("city", eventFilters.city);
    if (eventFilters.venueType) summaryParams.append("venueType", eventFilters.venueType);
    if (eventFilters.eventStatus && eventFilters.eventStatus !== "all") {
      summaryParams.append("status", eventFilters.eventStatus);
    }

    generateEventSQL(params);

    try {
      const [eventsRes, summaryRes] = await Promise.all([
        fetch(`/api/events?${params}`),
        fetch(`/api/analytics/summary?${summaryParams}`),
      ]);
      if (!eventsRes.ok) throw new Error("Failed to fetch events");
      if (!summaryRes.ok) throw new Error("Failed to fetch summary");
      const [eventsData, summaryData] = await Promise.all([
        eventsRes.json(),
        summaryRes.json(),
      ]);
      setEventResults(eventsData);
      setEventSummary(summaryData);
      setHasSearched(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Venue search ───────────────────────────────────────

  const handleVenueSearch = async () => {
    setIsLoading(true);
    setError("");

    const params = new URLSearchParams();
    params.append("type", categoryName);
    if (venueFilters.city)            params.append("city", venueFilters.city);
    if (venueFilters.state)           params.append("state", venueFilters.state);
    if (venueFilters.venueType)       params.append("venueType", venueFilters.venueType);
    if (venueFilters.minCapacity)     params.append("minCapacity", venueFilters.minCapacity);
    if (venueFilters.maxCapacity)     params.append("maxCapacity", venueFilters.maxCapacity);
    if (venueFilters.minRentalRate)   params.append("minRentalRate", venueFilters.minRentalRate);
    if (venueFilters.maxRentalRate)   params.append("maxRentalRate", venueFilters.maxRentalRate);
    if (venueFilters.minVenueRating)  params.append("minVenueRating", venueFilters.minVenueRating);
    if (venueFilters.minTotalEvents)  params.append("minTotalEvents", venueFilters.minTotalEvents);
    if (venueFilters.minSellThrough)  params.append("minSellThrough", venueFilters.minSellThrough);
    if (venueFilters.minTotalRevenue) params.append("minTotalRevenue", venueFilters.minTotalRevenue);

    generateVenueSQL(params);

    try {
      const res = await fetch(`/api/analytics/venues/summary?${params}`);
      if (!res.ok) throw new Error("Failed to fetch venues");
      const data: VenueSummary = await res.json();
      setVenueResults(data.breakdown ?? []);
      setVenueSummary(data);
      setHasSearched(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── SQL generators ─────────────────────────────────────

  const generateEventSQL = (params: URLSearchParams) => {
    let sql = `-- Analytics Summary (materialized view)\nSELECT * FROM event_analytics_summary\nWHERE type = '${params.get("type")}'`;
    if (params.get("status"))    sql += `\n  AND status = '${params.get("status")}'`;
    if (params.get("city"))      sql += `\n  AND city ILIKE '%${params.get("city")}%'`;
    if (params.get("state"))     sql += `\n  AND state = '${params.get("state")}'`;
    if (params.get("venueType")) sql += `\n  AND venue_type ILIKE '%${params.get("venueType")}%'`;
    sql += `;`;
    setGeneratedSQL(sql);
  };

  const generateVenueSQL = (params: URLSearchParams) => {
    let sql = `SELECT * FROM venue_analytics_summary\nWHERE venue_id IN (\n  SELECT DISTINCT venue_id FROM events WHERE type = '${params.get("type")}'\n)`;
    if (params.get("city"))            sql += `\n  AND city ILIKE '%${params.get("city")}%'`;
    if (params.get("state"))           sql += `\n  AND state = '${params.get("state")}'`;
    if (params.get("venueType"))       sql += `\n  AND venue_type ILIKE '%${params.get("venueType")}%'`;
    if (params.get("minCapacity"))     sql += `\n  AND max_capacity >= ${params.get("minCapacity")}`;
    if (params.get("maxCapacity"))     sql += `\n  AND max_capacity <= ${params.get("maxCapacity")}`;
    if (params.get("minRentalRate"))   sql += `\n  AND base_rental_rate >= ${params.get("minRentalRate")}`;
    if (params.get("maxRentalRate"))   sql += `\n  AND base_rental_rate <= ${params.get("maxRentalRate")}`;
    if (params.get("minVenueRating"))  sql += `\n  AND venue_rating >= ${params.get("minVenueRating")}`;
    if (params.get("minTotalEvents"))  sql += `\n  AND total_events >= ${params.get("minTotalEvents")}`;
    if (params.get("minSellThrough"))  sql += `\n  AND avg_sell_through_pct >= ${params.get("minSellThrough")}`;
    if (params.get("minTotalRevenue")) sql += `\n  AND total_revenue >= ${params.get("minTotalRevenue")}`;
    sql += `\nORDER BY total_revenue DESC;`;
    setGeneratedSQL(sql);
  };

  // ── Reset ──────────────────────────────────────────────

  const handleReset = () => {
    setEventFilters({
      searchTerm: "", dateFrom: "", dateTo: "", city: "", state: "",
      venueType: "", minCapacity: "", maxCapacity: "", minTicketPrice: "",
      maxTicketPrice: "", eventStatus: "", minEventRating: "", minVenueRating: "",
    });
    setVenueFilters({
      city: "", state: "", venueType: "", minCapacity: "", maxCapacity: "",
      minRentalRate: "", maxRentalRate: "", minVenueRating: "",
      minTotalEvents: "", minSellThrough: "", minTotalRevenue: "",
    });
    setEventResults([]);
    setVenueResults([]);
    setEventSummary(null);
    setVenueSummary(null);
    setHasSearched(false);
    setGeneratedSQL("");
    setError("");
  };

  const handleModeSwitch = (newMode: "event" | "venue") => {
    setMode(newMode);
    handleReset();
  };

  // ── Render ─────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">

          <Link
            to={`/${userType}/categories`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="size-4" />
            Back to Categories
          </Link>

          <div className="mb-6">
            <h1 className="mb-2">{categoryName}</h1>
            <p className="text-muted-foreground">
              Viewing as:{" "}
              <span className="font-medium text-foreground">Researcher/Analyst</span>
              {" "}- Use the filters below to query {mode === "event" ? "events" : "venues"}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Filter panel */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="size-5" />
                    Query Filters
                  </CardTitle>
                  <CardDescription>Analyze historical event data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                  {/* Analytics type dropdown */}
                  <div>
                    <Label>Analytics Type</Label>
                    <Select value={mode} onValueChange={(v) => handleModeSwitch(v as "event" | "venue")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="event">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="size-4" />
                            Events
                          </div>
                        </SelectItem>
                        <SelectItem value="venue">
                          <div className="flex items-center gap-2">
                            <Building2 className="size-4" />
                            Venues
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Event filters */}
                  {mode === "event" && (
                    <>
                      <div>
                        <Label>Search</Label>
                        <Input placeholder="Event name, venue..." value={eventFilters.searchTerm} onChange={(e) => setEventFilters({ ...eventFilters, searchTerm: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>City</Label>
                          <Input placeholder="e.g. Boston" value={eventFilters.city} onChange={(e) => setEventFilters({ ...eventFilters, city: e.target.value })} />
                        </div>
                        <div>
                          <Label>State</Label>
                          <Input placeholder="e.g. MA" maxLength={2} value={eventFilters.state} onChange={(e) => setEventFilters({ ...eventFilters, state: e.target.value.toUpperCase() })} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Date From</Label>
                          <Input type="date" value={eventFilters.dateFrom} onChange={(e) => setEventFilters({ ...eventFilters, dateFrom: e.target.value })} />
                        </div>
                        <div>
                          <Label>Date To</Label>
                          <Input type="date" value={eventFilters.dateTo} onChange={(e) => setEventFilters({ ...eventFilters, dateTo: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <Label>Venue Type</Label>
                        <Input placeholder="e.g. Stadium, Arena" value={eventFilters.venueType} onChange={(e) => setEventFilters({ ...eventFilters, venueType: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Min Capacity</Label>
                          <Input type="number" placeholder="0" value={eventFilters.minCapacity} onChange={(e) => setEventFilters({ ...eventFilters, minCapacity: e.target.value })} />
                        </div>
                        <div>
                          <Label>Max Capacity</Label>
                          <Input type="number" placeholder="100000" value={eventFilters.maxCapacity} onChange={(e) => setEventFilters({ ...eventFilters, maxCapacity: e.target.value })} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Min Ticket ($)</Label>
                          <Input type="number" placeholder="0" value={eventFilters.minTicketPrice} onChange={(e) => setEventFilters({ ...eventFilters, minTicketPrice: e.target.value })} />
                        </div>
                        <div>
                          <Label>Max Ticket ($)</Label>
                          <Input type="number" placeholder="1000" value={eventFilters.maxTicketPrice} onChange={(e) => setEventFilters({ ...eventFilters, maxTicketPrice: e.target.value })} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Min Event Rating</Label>
                          <Input type="number" placeholder="0" min="0" max="5" step="0.1" value={eventFilters.minEventRating} onChange={(e) => setEventFilters({ ...eventFilters, minEventRating: e.target.value })} />
                        </div>
                        <div>
                          <Label>Min Venue Rating</Label>
                          <Input type="number" placeholder="0" min="0" max="5" step="0.1" value={eventFilters.minVenueRating} onChange={(e) => setEventFilters({ ...eventFilters, minVenueRating: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <Label>Event Status</Label>
                        <Select value={eventFilters.eventStatus} onValueChange={(v) => setEventFilters({ ...eventFilters, eventStatus: v })}>
                          <SelectTrigger><SelectValue placeholder="All statuses" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="complete">Complete</SelectItem>
                            <SelectItem value="postponed">Postponed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {/* Venue filters */}
                  {mode === "venue" && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>City</Label>
                          <Input placeholder="e.g. Boston" value={venueFilters.city} onChange={(e) => setVenueFilters({ ...venueFilters, city: e.target.value })} />
                        </div>
                        <div>
                          <Label>State</Label>
                          <Input placeholder="e.g. MA" maxLength={2} value={venueFilters.state} onChange={(e) => setVenueFilters({ ...venueFilters, state: e.target.value.toUpperCase() })} />
                        </div>
                      </div>
                      <div>
                        <Label>Venue Type</Label>
                        <Input placeholder="e.g. Stadium, Arena" value={venueFilters.venueType} onChange={(e) => setVenueFilters({ ...venueFilters, venueType: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Min Capacity</Label>
                          <Input type="number" placeholder="0" value={venueFilters.minCapacity} onChange={(e) => setVenueFilters({ ...venueFilters, minCapacity: e.target.value })} />
                        </div>
                        <div>
                          <Label>Max Capacity</Label>
                          <Input type="number" placeholder="100000" value={venueFilters.maxCapacity} onChange={(e) => setVenueFilters({ ...venueFilters, maxCapacity: e.target.value })} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Min Rental ($)</Label>
                          <Input type="number" placeholder="0" value={venueFilters.minRentalRate} onChange={(e) => setVenueFilters({ ...venueFilters, minRentalRate: e.target.value })} />
                        </div>
                        <div>
                          <Label>Max Rental ($)</Label>
                          <Input type="number" placeholder="200000" value={venueFilters.maxRentalRate} onChange={(e) => setVenueFilters({ ...venueFilters, maxRentalRate: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <Label>Min Venue Rating</Label>
                        <Input type="number" placeholder="0" min="0" max="5" step="0.1" value={venueFilters.minVenueRating} onChange={(e) => setVenueFilters({ ...venueFilters, minVenueRating: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Min Events Hosted</Label>
                          <Input type="number" placeholder="0" value={venueFilters.minTotalEvents} onChange={(e) => setVenueFilters({ ...venueFilters, minTotalEvents: e.target.value })} />
                        </div>
                        <div>
                          <Label>Min Sell-Through (%)</Label>
                          <Input type="number" placeholder="0" min="0" max="100" step="1" value={venueFilters.minSellThrough} onChange={(e) => setVenueFilters({ ...venueFilters, minSellThrough: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <Label>Min Total Revenue ($)</Label>
                        <Input type="number" placeholder="0" value={venueFilters.minTotalRevenue} onChange={(e) => setVenueFilters({ ...venueFilters, minTotalRevenue: e.target.value })} />
                      </div>
                    </>
                  )}

                  <div className="pt-2 space-y-2">
                    <Button onClick={mode === "event" ? handleEventSearch : handleVenueSearch} className="w-full" disabled={isLoading}>
                      <Search className="size-4 mr-2" />
                      {isLoading ? "Loading..." : "Execute Query"}
                    </Button>
                    <Button onClick={handleReset} variant="outline" className="w-full">
                      Reset Filters
                    </Button>
                  </div>

                  {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                </CardContent>
              </Card>
            </div>

            {/* Results panel */}
            <div className="lg:col-span-2 space-y-6">

              {hasSearched && mode === "event" && eventSummary && (
                <EventSummaryCards summary={eventSummary} />
              )}
              {hasSearched && mode === "venue" && venueSummary && (
                <VenueSummaryCards summary={venueSummary} />
              )}

              {generatedSQL && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="size-5" />
                      Generated SQL Query
                    </CardTitle>
                    <CardDescription>PostgreSQL query based on your filters</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
                      <code>{generatedSQL}</code>
                    </pre>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>{mode === "event" ? "Event Results" : "Venue Results"}</CardTitle>
                  <CardDescription>
                    {hasSearched
                      ? `Found ${mode === "event" ? eventResults.length : venueResults.length} ${mode === "event" ? "event" : "venue"}${(mode === "event" ? eventResults.length : venueResults.length) !== 1 ? "s" : ""}`
                      : "Execute a query to see results"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!hasSearched ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Database className="size-12 mx-auto mb-4 opacity-50" />
                      <p>Configure your filters and click "Execute Query" to search</p>
                    </div>
                  ) : mode === "event" && eventResults.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Search className="size-12 mx-auto mb-4 opacity-50" />
                      <p>No events found matching your criteria</p>
                    </div>
                  ) : mode === "venue" && venueResults.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Search className="size-12 mx-auto mb-4 opacity-50" />
                      <p>No venues found matching your criteria</p>
                    </div>
                  ) : mode === "event" ? (
                    <div className="space-y-4">
                      {eventResults.map((event) => {
                        const sellThrough = event.capacity > 0
                          ? ((event.tickets_sold / event.capacity) * 100).toFixed(1)
                          : "0.0";
                        return (
                          <Card key={event.event_id}>
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle>{event.name}</CardTitle>
                                  <CardDescription>{event.venue_name}</CardDescription>
                                </div>
                                <div className="flex gap-2 flex-wrap justify-end">
                                  <Badge variant={event.status === "scheduled" ? "default" : "secondary"}>{event.status}</Badge>
                                  <Badge variant={parseFloat(sellThrough) > 70 ? "default" : "secondary"}>{sellThrough}% sold</Badge>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <p className="text-sm">{event.description}</p>
                                <Separator />
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Date:</span>
                                    <p>{new Date(event.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Time:</span>
                                    <p>{event.start_time?.slice(0, 5)} - {event.end_time?.slice(0, 5)}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Location:</span>
                                    <p>{event.city}, {event.state}</p>
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
                                    <span className="text-muted-foreground">Tickets Available:</span>
                                    <p>{Number(event.tickets_available).toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Venue Type:</span>
                                    <p>{event.venue_type}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Rating:</span>
                                    <p>⭐ {event.rating ? Number(event.rating).toFixed(1) : "N/A"}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Ticket Price:</span>
                                    <p>${Number(event.min_ticket_price).toFixed(2)} - ${Number(event.max_ticket_price).toFixed(2)}</p>
                                  </div>
                                </div>
                                <Separator />
                                <div className="flex justify-end">
                                  <Button asChild variant="outline" size="sm">
                                    <Link to={`/${userType}/category/${category}/analytics/${event.event_id}`}>
                                      View Event Analytics
                                    </Link>
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {venueResults.map((venue) => (
                        <Card key={venue.venue_id}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle>{venue.venue_name}</CardTitle>
                                <CardDescription>{venue.city}, {venue.state} · {venue.venue_type}</CardDescription>
                              </div>
                              <Badge variant="outline">⭐ {Number(venue.venue_rating).toFixed(1)}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Max Capacity:</span>
                                  <p>{Number(venue.max_capacity).toLocaleString()}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Base Rental Rate:</span>
                                  <p>${Number(venue.base_rental_rate).toLocaleString()}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Total Events:</span>
                                  <p>{Number(venue.total_events).toLocaleString()}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Tickets Sold:</span>
                                  <p>{Number(venue.total_tickets_sold).toLocaleString()}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Avg Sell-Through:</span>
                                  <p>{Number(venue.avg_sell_through_pct).toFixed(1)}%</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Total Revenue:</span>
                                  <p>${Number(venue.total_revenue).toLocaleString()}</p>
                                </div>
                              </div>
                              <Separator />
                              <div className="flex justify-end">
                                <Button asChild variant="outline" size="sm">
                                  <Link to={`/${userType}/category/${category}/analytics/venue/${venue.venue_id}`}>
                                    View Venue Analytics
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}