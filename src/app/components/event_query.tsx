import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Search, Database } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { VenueAvailabilityButton } from "./venue_availability_button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Real types matching your PostgreSQL schema
interface Venue {
  venue_id: number;
  name: string;
  city: string;
  state: string;
  venue_type: string;
  base_rental_rate: number;
  max_capacity: number;
  contact_name: string;
  contact_phone: string;
  rating: number;
}

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
  // joined from venues table
  venue_name: string;
  city: string;
  state: string;
  venue_type: string;
  base_rental_rate: number;
  contact_name: string;
  contact_phone: string;
  venue_rating: number;
  // joined from tickets table
  total_tickets: number;
  tickets_sold: number;
  tickets_available: number;
  tickets_reserved: number;
  min_ticket_price: number;
  max_ticket_price: number;
}

const categoryMap: { [key: string]: string } = {
  "concerts-festivals": "Concerts/Festivals",
  "sporting-events": "Sporting Events",
  weddings: "Weddings",
  conventions: "Conventions",
  conferences: "Conferences",
};

export function EventQuery() {
  const { category, userType } = useParams<{
    category: string;
    userType: string;
  }>();
  const categoryName = category ? categoryMap[category] : "";
  const isAttendee = userType === "attendee";
  const isOrganizer = userType === "organizer";
  const isResearcher = userType === "researcher";

  const [filters, setFilters] = useState({
    searchTerm: "",
    dateFrom: "",
    dateTo: "",
    city: "",
    state: "",
    venueType: "",
    minCapacity: "",
    maxCapacity: "",
    minTicketPrice: "",
    maxTicketPrice: "",
    ticketType: "",
    eventStatus: "",
    minEventRating: "",
    minRentalRate: "",
    maxRentalRate: "",
    minVenueRating: "",
    includeCompleted: false,
    showAllStatuses: false,
  });

  const [results, setResults] = useState<Event[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedSQL, setGeneratedSQL] = useState("");

  const handleSearch = async () => {
    setIsLoading(true);
    setError("");

    // Build query params to send to Express
    const params = new URLSearchParams();
    params.append("type", categoryName);

    if (filters.searchTerm) params.append("search", filters.searchTerm);
    if (filters.dateFrom)   params.append("dateFrom", filters.dateFrom);
    if (filters.dateTo)     params.append("dateTo", filters.dateTo);
    if (filters.city)       params.append("city", filters.city);
    if (filters.state)      params.append("state", filters.state);
    if (filters.venueType)  params.append("venueType", filters.venueType);
    if (filters.minCapacity) params.append("minCapacity", filters.minCapacity);
    if (filters.maxCapacity) params.append("maxCapacity", filters.maxCapacity);
    if (filters.minTicketPrice) params.append("minTicketPrice", filters.minTicketPrice);
    if (filters.maxTicketPrice) params.append("maxTicketPrice", filters.maxTicketPrice);
    if (filters.ticketType) params.append("ticketType", filters.ticketType);
    if (filters.minEventRating) params.append("minEventRating", filters.minEventRating);
    if (filters.minRentalRate) params.append("minRentalRate", filters.minRentalRate);
    if (filters.maxRentalRate) params.append("maxRentalRate", filters.maxRentalRate);
    if (filters.minVenueRating) params.append("minVenueRating", filters.minVenueRating);
    if (filters.includeCompleted) params.append("includeCompleted", "true");

    if (filters.eventStatus && filters.eventStatus !== "all") {
      params.append("status", filters.eventStatus);
    } else if (!isResearcher) {
      params.append("status", "scheduled");
    }

    try {
      const res = await fetch(`/api/events?${params}`);
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setResults(data);
      setHasSearched(true);
      generateSQLQuery(params);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSQLQuery = (params: URLSearchParams) => {
    let sql = `SELECT e.*, v.name as venue_name, v.city, v.state,
        v.venue_type, v.base_rental_rate, v.contact_name,
        v.contact_phone, v.rating as venue_rating,
        COUNT(t.ticket_id) as total_tickets,
        SUM(CASE WHEN t.status = 'sold' THEN 1 ELSE 0 END) as tickets_sold,
        SUM(CASE WHEN t.status = 'available' THEN 1 ELSE 0 END) as tickets_available
        FROM events e
        JOIN venues v ON e.venue_id = v.venue_id
        LEFT JOIN tickets t ON e.event_id = t.event_id
        WHERE e.type = '${params.get("type")}'`;

    if (params.get("status"))     sql += `\n  AND e.status = '${params.get("status")}'`;
    if (params.get("search"))     sql += `\n  AND (e.name ILIKE '%${params.get("search")}%' OR v.name ILIKE '%${params.get("search")}%')`;
    if (params.get("dateFrom")) {
      sql += `\n  AND lower(e.event_time_range)::date >= '${params.get("dateFrom")}'`;
    }

    if (params.get("dateTo")) {
      sql += `\n  AND lower(e.event_time_range)::date <= '${params.get("dateTo")}'`;
    }
    if (params.get("city"))       sql += `\n  AND v.city ILIKE '%${params.get("city")}%'`;
    if (params.get("state"))      sql += `\n  AND v.state = '${params.get("state")}'`;
    if (params.get("venueType"))  sql += `\n  AND v.venue_type ILIKE '%${params.get("venueType")}%'`;
    if (params.get("minCapacity")) sql += `\n  AND e.capacity >= ${params.get("minCapacity")}`;
    if (params.get("maxCapacity")) sql += `\n  AND e.capacity <= ${params.get("maxCapacity")}`;
    if (params.get("minEventRating")) sql += `\n  AND e.rating >= ${params.get("minEventRating")}`;
    if (params.get("minRentalRate"))  sql += `\n  AND v.base_rental_rate >= ${params.get("minRentalRate")}`;
    if (params.get("maxRentalRate"))  sql += `\n  AND v.base_rental_rate <= ${params.get("maxRentalRate")}`;
    if (params.get("minVenueRating")) sql += `\n  AND v.rating >= ${params.get("minVenueRating")}`;

    sql += `\nGROUP BY e.event_id, v.venue_id`;

    if (params.get("minTicketPrice")) sql += `\nHAVING MIN(t.face_value_price) >= ${params.get("minTicketPrice")}`;
    if (params.get("maxTicketPrice")) sql += `\n  AND MAX(t.face_value_price) <= ${params.get("maxTicketPrice")}`;

    sql += `\nORDER BY lower(e.event_time_range) ASC;`;
    setGeneratedSQL(sql);
  };

  const handleReset = () => {
    setFilters({
      searchTerm: "",
      dateFrom: "",
      dateTo: "",
      city: "",
      state: "",
      venueType: "",
      minCapacity: "",
      maxCapacity: "",
      minTicketPrice: "",
      maxTicketPrice: "",
      ticketType: "",
      eventStatus: "",
      minEventRating: "",
      minRentalRate: "",
      maxRentalRate: "",
      minVenueRating: "",
      includeCompleted: false,
      showAllStatuses: false,
    });
    setResults([]);
    setHasSearched(false);
    setGeneratedSQL("");
    setError("");
  };

  const userTypeLabel = isAttendee
    ? "Event Attendee"
    : isOrganizer
      ? "Event Organizer/Booker"
      : "Researcher/Analyst";

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

          <div className="mb-8">
            <h1 className="mb-2">{categoryName}</h1>
            <p className="text-muted-foreground">
              Viewing as:{" "}
              <span className="font-medium text-foreground">
                {userTypeLabel}
              </span>{" "}
              - Use the filters below to query events
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Query Filters */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="size-5" />
                    Query Filters
                  </CardTitle>
                  <CardDescription>
                    {isAttendee && "Search for events to attend"}
                    {isOrganizer && "Find and compare venues"}
                    {isResearcher && "Analyze historical event data"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="basic">Basic</TabsTrigger>
                      <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic" className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="searchTerm">Search</Label>
                        <Input
                          id="searchTerm"
                          placeholder={isOrganizer ? "Venue name..." : "Event name, venue..."}
                          value={filters.searchTerm}
                          onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            placeholder="e.g. Boston"
                            value={filters.city}
                            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            placeholder="e.g. MA"
                            maxLength={2}
                            value={filters.state}
                            onChange={(e) => setFilters({ ...filters, state: e.target.value.toUpperCase() })}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="dateFrom">Date From</Label>
                        <Input
                          id="dateFrom"
                          type="date"
                          value={filters.dateFrom}
                          onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="dateTo">Date To</Label>
                        <Input
                          id="dateTo"
                          type="date"
                          value={filters.dateTo}
                          onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                        />
                      </div>

                      {isAttendee && (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="minTicketPrice">Min Price ($)</Label>
                              <Input
                                id="minTicketPrice"
                                type="number"
                                placeholder="0"
                                value={filters.minTicketPrice}
                                onChange={(e) => setFilters({ ...filters, minTicketPrice: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="maxTicketPrice">Max Price ($)</Label>
                              <Input
                                id="maxTicketPrice"
                                type="number"
                                placeholder="1000"
                                value={filters.maxTicketPrice}
                                onChange={(e) => setFilters({ ...filters, maxTicketPrice: e.target.value })}
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="ticketType">Ticket Type</Label>
                            <Select
                              value={filters.ticketType}
                              onValueChange={(value) => setFilters({ ...filters, ticketType: value })}
                            >
                              <SelectTrigger id="ticketType">
                                <SelectValue placeholder="Any type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="All">Any type</SelectItem>
                                <SelectItem value="General Admission">General Admission</SelectItem>
                                <SelectItem value="VIP">VIP</SelectItem>
                                <SelectItem value="Premium">Premium</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}

                      {isOrganizer && (
                        <>
                          <div>
                            <Label htmlFor="venueType">Venue Type</Label>
                            <Input
                              id="venueType"
                              placeholder="e.g. Convention Center"
                              value={filters.venueType}
                              onChange={(e) => setFilters({ ...filters, venueType: e.target.value })}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="minRentalRate">Min Rate ($)</Label>
                              <Input
                                id="minRentalRate"
                                type="number"
                                placeholder="0"
                                value={filters.minRentalRate}
                                onChange={(e) => setFilters({ ...filters, minRentalRate: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="maxRentalRate">Max Rate ($)</Label>
                              <Input
                                id="maxRentalRate"
                                type="number"
                                placeholder="200000"
                                value={filters.maxRentalRate}
                                onChange={(e) => setFilters({ ...filters, maxRentalRate: e.target.value })}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="venueType">Venue Type</Label>
                        <Input
                          id="venueType"
                          placeholder="e.g. Stadium, Arena"
                          value={filters.venueType}
                          onChange={(e) => setFilters({ ...filters, venueType: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="minCapacity">Min Capacity</Label>
                          <Input
                            id="minCapacity"
                            type="number"
                            placeholder="0"
                            value={filters.minCapacity}
                            onChange={(e) => setFilters({ ...filters, minCapacity: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="maxCapacity">Max Capacity</Label>
                          <Input
                            id="maxCapacity"
                            type="number"
                            placeholder="100000"
                            value={filters.maxCapacity}
                            onChange={(e) => setFilters({ ...filters, maxCapacity: e.target.value })}
                          />
                        </div>
                      </div>

                      {(isAttendee || isResearcher) && (
                        <div>
                          <Label htmlFor="minEventRating">Min Event Rating</Label>
                          <Input
                            id="minEventRating"
                            type="number"
                            placeholder="0"
                            min="0"
                            max="5"
                            step="0.1"
                            value={filters.minEventRating}
                            onChange={(e) => setFilters({ ...filters, minEventRating: e.target.value })}
                          />
                        </div>
                      )}

                      {(isOrganizer || isResearcher) && (
                        <>
                          <div>
                            <Label htmlFor="minVenueRating">Min Venue Rating</Label>
                            <Input
                              id="minVenueRating"
                              type="number"
                              placeholder="0"
                              min="0"
                              max="5"
                              step="0.1"
                              value={filters.minVenueRating}
                              onChange={(e) => setFilters({ ...filters, minVenueRating: e.target.value })}
                            />
                          </div>
                          {!isAttendee && (
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label htmlFor="minRentalRate">Min Rental Rate ($)</Label>
                                <Input
                                  id="minRentalRate"
                                  type="number"
                                  placeholder="0"
                                  value={filters.minRentalRate}
                                  onChange={(e) => setFilters({ ...filters, minRentalRate: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="maxRentalRate">Max Rental Rate ($)</Label>
                                <Input
                                  id="maxRentalRate"
                                  type="number"
                                  placeholder="200000"
                                  value={filters.maxRentalRate}
                                  onChange={(e) => setFilters({ ...filters, maxRentalRate: e.target.value })}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {isResearcher && (
                        <>
                          <div>
                            <Label htmlFor="eventStatus">Event Status</Label>
                            <Select
                              value={filters.eventStatus}
                              onValueChange={(value) => setFilters({ ...filters, eventStatus: value })}
                            >
                              <SelectTrigger id="eventStatus">
                                <SelectValue placeholder="All statuses" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All statuses</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="complete">Complete</SelectItem>
                                <SelectItem value="postponed">Postponed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {!isAttendee && (
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label htmlFor="minTicketPrice">Min Ticket Price ($)</Label>
                                <Input
                                  id="minTicketPrice"
                                  type="number"
                                  placeholder="0"
                                  value={filters.minTicketPrice}
                                  onChange={(e) => setFilters({ ...filters, minTicketPrice: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="maxTicketPrice">Max Ticket Price ($)</Label>
                                <Input
                                  id="maxTicketPrice"
                                  type="number"
                                  placeholder="1000"
                                  value={filters.maxTicketPrice}
                                  onChange={(e) => setFilters({ ...filters, maxTicketPrice: e.target.value })}
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </TabsContent>
                  </Tabs>

                  <div className="pt-4 space-y-2">
                    <Button onClick={handleSearch} className="w-full" disabled={isLoading}>
                      <Search className="size-4 mr-2" />
                      {isLoading ? "Loading..." : "Execute Query"}
                    </Button>
                    <Button onClick={handleReset} variant="outline" className="w-full">
                      Reset Filters
                    </Button>
                  </div>

                  {error && (
                    <p className="text-sm text-red-500 mt-2">{error}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Results and SQL */}
            <div className="lg:col-span-2 space-y-6">
              {generatedSQL && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="size-5" />
                      Generated SQL Query
                    </CardTitle>
                    <CardDescription>
                      PostgreSQL query based on your filters
                    </CardDescription>
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
                  <CardTitle>Query Results</CardTitle>
                  <CardDescription>
                    {hasSearched
                      ? `Found ${results.length} event${results.length !== 1 ? "s" : ""}`
                      : "Execute a query to see results"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!hasSearched ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Database className="size-12 mx-auto mb-4 opacity-50" />
                      <p>Configure your filters and click "Execute Query" to search for events</p>
                    </div>
                  ) : results.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Search className="size-12 mx-auto mb-4 opacity-50" />
                      <p>No events found matching your criteria</p>
                      <p className="text-sm mt-2">Try adjusting your filters</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {results.map((event) => {
                        const occupancyRate = event.total_tickets > 0
                          ? ((event.tickets_sold / event.total_tickets) * 100).toFixed(1)
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
                                  <Badge variant={event.status === "scheduled" ? "default" : "secondary"}>
                                    {event.status}
                                  </Badge>
                                  {isOrganizer && (
                                    <Badge variant="outline">
                                      ${Number(event.base_rental_rate).toLocaleString()} rental
                                    </Badge>
                                  )}
                                  {isResearcher && (
                                    <Badge variant={parseFloat(occupancyRate) > 70 ? "default" : "secondary"}>
                                      {occupancyRate}% sold
                                    </Badge>
                                  )}
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
                                    <span className="text-muted-foreground">
                                      {isOrganizer ? "Venue Type:" : "Tickets Available:"}
                                    </span>
                                    <p>
                                      {isOrganizer
                                        ? event.venue_type
                                        : `${Number(event.tickets_available).toLocaleString()} tickets`}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Rating:</span>
                                    <p>⭐ {event.rating ? Number(event.rating).toFixed(1) : "N/A"}</p>
                                  </div>
                                  {isOrganizer && (
                                    <>
                                      <div>
                                        <span className="text-muted-foreground">Venue Rating:</span>
                                        <p>⭐ {event.venue_rating ? Number(event.venue_rating).toFixed(1) : "N/A"}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Contact:</span>
                                        <p>{event.contact_name}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Phone:</span>
                                        <p>{event.contact_phone}</p>
                                      </div>
                                    </>
                                  )}
                                  {isResearcher && (
                                    <>
                                      <div>
                                        <span className="text-muted-foreground">Tickets Sold:</span>
                                        <p>{Number(event.tickets_sold).toLocaleString()}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Reserved:</span>
                                        <p>{Number(event.tickets_reserved).toLocaleString()}</p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">Venue Type:</span>
                                        <p>{event.venue_type}</p>
                                      </div>
                                    </>
                                  )}
                                  {isAttendee && event.status === 'scheduled' && event.tickets_available > 0 && (
                                    <>
                                      <Separator />
                                      <div className="flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">
                                          <span className="font-medium text-foreground">{Number(event.tickets_available).toLocaleString()}</span> tickets available
                                        </div>
                                        <Button asChild>
                                          <Link to={`/${userType}/category/${category}/book-ticket/${event.event_id}`}>
                                            Book Tickets
                                          </Link>
                                        </Button>
                                      </div>
                                    </>
                                  )}
                                  
                                  {isAttendee && event.status === 'scheduled' && event.tickets_available === 0 && (
                                    <>
                                      <Separator />
                                      <div className="text-sm text-muted-foreground text-center py-2 bg-muted rounded">
                                        Sold Out - No tickets available
                                      </div>
                                    </>
                                  )}
                                  
                                  {isOrganizer && event.status === 'scheduled' && (
                                    <>
                                      <Separator />
                                      <VenueAvailabilityButton
                                        eventId={event.event_id}
                                        venueId={event.venue_id}
                                        userType={userType}
                                        category={category}
                                      />
                                    </>
                                  )}
 
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
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