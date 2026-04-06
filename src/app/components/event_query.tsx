import { useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Search, Database } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
import {
  executeQuery,
  Event,
  getTicketStats,
} from "../data/mock_events";

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
    // Common filters
    searchTerm: "",
    dateFrom: "",
    dateTo: "",
    city: "",
    state: "",
    venueType: "",
    minCapacity: "",
    maxCapacity: "",

    // Attendee-specific filters
    minTicketPrice: "",
    maxTicketPrice: "",
    ticketType: "",
    eventStatus: "",
    minEventRating: "",

    // Organizer-specific filters
    minRentalRate: "",
    maxRentalRate: "",
    minVenueRating: "",

    // Researcher-specific filters
    includeCompleted: false,
    showAllStatuses: false,
  });

  const [results, setResults] = useState<Event[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [generatedSQL, setGeneratedSQL] = useState("");

  const handleSearch = () => {
    const queryFilters = {
      searchTerm: filters.searchTerm || undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
      city: filters.city || undefined,
      state: filters.state || undefined,
      venueType: filters.venueType || undefined,
      minCapacity: filters.minCapacity
        ? parseInt(filters.minCapacity)
        : undefined,
      maxCapacity: filters.maxCapacity
        ? parseInt(filters.maxCapacity)
        : undefined,
      minTicketPrice: filters.minTicketPrice
        ? parseFloat(filters.minTicketPrice)
        : undefined,
      maxTicketPrice: filters.maxTicketPrice
        ? parseFloat(filters.maxTicketPrice)
        : undefined,
      ticketType: filters.ticketType || undefined,
      eventStatus: filters.eventStatus || undefined,
      minEventRating: filters.minEventRating
        ? parseFloat(filters.minEventRating)
        : undefined,
      minRentalRate: filters.minRentalRate
        ? parseFloat(filters.minRentalRate)
        : undefined,
      maxRentalRate: filters.maxRentalRate
        ? parseFloat(filters.maxRentalRate)
        : undefined,
      minVenueRating: filters.minVenueRating
        ? parseFloat(filters.minVenueRating)
        : undefined,
      includeCompleted: filters.includeCompleted || undefined,
    };

    const events = executeQuery(
      categoryName,
      userType!,
      queryFilters,
    );
    setResults(events);
    setHasSearched(true);

    // Generate SQL query for display
    generateSQLQuery(categoryName, queryFilters);
  };

  const generateSQLQuery = (
    category: string,
    queryFilters: any,
  ) => {
    let sql = `SELECT e.*, v.*, COUNT(t.ticket_id) as total_tickets,
       SUM(CASE WHEN t.status = 'sold' THEN 1 ELSE 0 END) as tickets_sold,
       SUM(CASE WHEN t.status = 'available' THEN 1 ELSE 0 END) as tickets_available
FROM events e
JOIN venues v ON e.venue_id = v.venue_id
LEFT JOIN tickets t ON e.event_id = t.event_id
WHERE e.type = '${category}'`;

    if (!isResearcher || !queryFilters.includeCompleted) {
      sql += `\n  AND e.status = 'scheduled'`;
    }

    if (queryFilters.eventStatus) {
      sql += `\n  AND e.status = '${queryFilters.eventStatus}'`;
    }

    if (queryFilters.searchTerm) {
      sql += `\n  AND (e.name LIKE '%${queryFilters.searchTerm}%'`;
      sql += `\n       OR e.description LIKE '%${queryFilters.searchTerm}%'`;
      sql += `\n       OR v.name LIKE '%${queryFilters.searchTerm}%')`;
    }

    if (queryFilters.dateFrom) {
      sql += `\n  AND e.date >= '${queryFilters.dateFrom}'`;
    }

    if (queryFilters.dateTo) {
      sql += `\n  AND e.date <= '${queryFilters.dateTo}'`;
    }

    if (queryFilters.city) {
      sql += `\n  AND v.city LIKE '%${queryFilters.city}%'`;
    }

    if (queryFilters.state) {
      sql += `\n  AND v.state = '${queryFilters.state}'`;
    }

    if (queryFilters.venueType) {
      sql += `\n  AND v.venue_type LIKE '%${queryFilters.venueType}%'`;
    }

    if (queryFilters.minCapacity !== undefined) {
      sql += `\n  AND e.capacity >= ${queryFilters.minCapacity}`;
    }

    if (queryFilters.maxCapacity !== undefined) {
      sql += `\n  AND e.capacity <= ${queryFilters.maxCapacity}`;
    }

    if (queryFilters.minEventRating !== undefined) {
      sql += `\n  AND e.rating >= ${queryFilters.minEventRating}`;
    }

    if (queryFilters.minRentalRate !== undefined) {
      sql += `\n  AND v.base_rental_rate >= ${queryFilters.minRentalRate}`;
    }

    if (queryFilters.maxRentalRate !== undefined) {
      sql += `\n  AND v.base_rental_rate <= ${queryFilters.maxRentalRate}`;
    }

    if (queryFilters.minVenueRating !== undefined) {
      sql += `\n  AND v.rating >= ${queryFilters.minVenueRating}`;
    }

    if (
      queryFilters.minTicketPrice !== undefined ||
      queryFilters.maxTicketPrice !== undefined
    ) {
      sql += `\nGROUP BY e.event_id, v.venue_id\nHAVING 1=1`;
      if (queryFilters.minTicketPrice !== undefined) {
        sql += `\n  AND MAX(t.face_value_price) >= ${queryFilters.minTicketPrice}`;
      }
      if (queryFilters.maxTicketPrice !== undefined) {
        sql += `\n  AND MIN(t.face_value_price) <= ${queryFilters.maxTicketPrice}`;
      }
    } else {
      sql += `\nGROUP BY e.event_id, v.venue_id`;
    }

    if (queryFilters.ticketType) {
      sql = sql.replace(
        "WHERE e.type",
        `WHERE e.event_id IN (\n  SELECT DISTINCT event_id FROM tickets WHERE type LIKE '%${queryFilters.ticketType}%'\n)\nAND e.type`,
      );
    }

    sql += ";";
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
                    {isAttendee &&
                      "Search for events to attend"}
                    {isOrganizer && "Find and compare venues"}
                    {isResearcher &&
                      "Analyze historical event data"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="basic">
                        Basic
                      </TabsTrigger>
                      <TabsTrigger value="advanced">
                        Advanced
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent
                      value="basic"
                      className="space-y-4 mt-4"
                    >
                      <div>
                        <Label htmlFor="searchTerm">
                          Search
                        </Label>
                        <Input
                          id="searchTerm"
                          placeholder={
                            isOrganizer
                              ? "Venue name..."
                              : "Event name, venue..."
                          }
                          value={filters.searchTerm}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              searchTerm: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            placeholder="e.g. Boston"
                            value={filters.city}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                city: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            placeholder="e.g. MA"
                            maxLength={2}
                            value={filters.state}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                state:
                                  e.target.value.toUpperCase(),
                              })
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="dateFrom">
                          Date From
                        </Label>
                        <Input
                          id="dateFrom"
                          type="date"
                          value={filters.dateFrom}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              dateFrom: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="dateTo">Date To</Label>
                        <Input
                          id="dateTo"
                          type="date"
                          value={filters.dateTo}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              dateTo: e.target.value,
                            })
                          }
                        />
                      </div>

                      {isAttendee && (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="minTicketPrice">
                                Min Price ($)
                              </Label>
                              <Input
                                id="minTicketPrice"
                                type="number"
                                placeholder="0"
                                value={filters.minTicketPrice}
                                onChange={(e) =>
                                  setFilters({
                                    ...filters,
                                    minTicketPrice:
                                      e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="maxTicketPrice">
                                Max Price ($)
                              </Label>
                              <Input
                                id="maxTicketPrice"
                                type="number"
                                placeholder="1000"
                                value={filters.maxTicketPrice}
                                onChange={(e) =>
                                  setFilters({
                                    ...filters,
                                    maxTicketPrice:
                                      e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="ticketType">
                              Ticket Type
                            </Label>
                            <Select
                              value={filters.ticketType}
                              onValueChange={(value) =>
                                setFilters({
                                  ...filters,
                                  ticketType: value,
                                })
                              }
                            >
                              <SelectTrigger id="ticketType">
                                <SelectValue placeholder="Any type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="All">
                                  Any type
                                </SelectItem>
                                <SelectItem value="General Admission">
                                  General Admission
                                </SelectItem>
                                <SelectItem value="VIP">
                                  VIP
                                </SelectItem>
                                <SelectItem value="Premium">
                                  Premium
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}

                      {isOrganizer && (
                        <>
                          <div>
                            <Label htmlFor="venueType">
                              Venue Type
                            </Label>
                            <Input
                              id="venueType"
                              placeholder="e.g. Convention Center"
                              value={filters.venueType}
                              onChange={(e) =>
                                setFilters({
                                  ...filters,
                                  venueType: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="minRentalRate">
                                Min Rate ($)
                              </Label>
                              <Input
                                id="minRentalRate"
                                type="number"
                                placeholder="0"
                                value={filters.minRentalRate}
                                onChange={(e) =>
                                  setFilters({
                                    ...filters,
                                    minRentalRate:
                                      e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <Label htmlFor="maxRentalRate">
                                Max Rate ($)
                              </Label>
                              <Input
                                id="maxRentalRate"
                                type="number"
                                placeholder="200000"
                                value={filters.maxRentalRate}
                                onChange={(e) =>
                                  setFilters({
                                    ...filters,
                                    maxRentalRate:
                                      e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </TabsContent>

                    <TabsContent
                      value="advanced"
                      className="space-y-4 mt-4"
                    >
                      <div>
                        <Label htmlFor="venueType">
                          Venue Type
                        </Label>
                        <Input
                          id="venueType"
                          placeholder="e.g. Stadium, Arena"
                          value={filters.venueType}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              venueType: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="minCapacity">
                            Min Capacity
                          </Label>
                          <Input
                            id="minCapacity"
                            type="number"
                            placeholder="0"
                            value={filters.minCapacity}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                minCapacity: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="maxCapacity">
                            Max Capacity
                          </Label>
                          <Input
                            id="maxCapacity"
                            type="number"
                            placeholder="100000"
                            value={filters.maxCapacity}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                maxCapacity: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      {(isAttendee || isResearcher) && (
                        <div>
                          <Label htmlFor="minEventRating">
                            Min Event Rating
                          </Label>
                          <Input
                            id="minEventRating"
                            type="number"
                            placeholder="0"
                            min="0"
                            max="5"
                            step="0.1"
                            value={filters.minEventRating}
                            onChange={(e) =>
                              setFilters({
                                ...filters,
                                minEventRating: e.target.value,
                              })
                            }
                          />
                        </div>
                      )}

                      {(isOrganizer || isResearcher) && (
                        <>
                          <div>
                            <Label htmlFor="minVenueRating">
                              Min Venue Rating
                            </Label>
                            <Input
                              id="minVenueRating"
                              type="number"
                              placeholder="0"
                              min="0"
                              max="5"
                              step="0.1"
                              value={filters.minVenueRating}
                              onChange={(e) =>
                                setFilters({
                                  ...filters,
                                  minVenueRating:
                                    e.target.value,
                                })
                              }
                            />
                          </div>

                          {!isAttendee && (
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label htmlFor="minRentalRate">
                                  Min Rental Rate ($)
                                </Label>
                                <Input
                                  id="minRentalRate"
                                  type="number"
                                  placeholder="0"
                                  value={filters.minRentalRate}
                                  onChange={(e) =>
                                    setFilters({
                                      ...filters,
                                      minRentalRate:
                                        e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="maxRentalRate">
                                  Max Rental Rate ($)
                                </Label>
                                <Input
                                  id="maxRentalRate"
                                  type="number"
                                  placeholder="200000"
                                  value={filters.maxRentalRate}
                                  onChange={(e) =>
                                    setFilters({
                                      ...filters,
                                      maxRentalRate:
                                        e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {isResearcher && (
                        <>
                          <div>
                            <Label htmlFor="eventStatus">
                              Event Status
                            </Label>
                            <Select
                              value={filters.eventStatus}
                              onValueChange={(value) =>
                                setFilters({
                                  ...filters,
                                  eventStatus: value,
                                })
                              }
                            >
                              <SelectTrigger id="eventStatus">
                                <SelectValue placeholder="All statuses" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">
                                  All statuses
                                </SelectItem>
                                <SelectItem value="scheduled">
                                  Scheduled
                                </SelectItem>
                                <SelectItem value="complete">
                                  Complete
                                </SelectItem>
                                <SelectItem value="postponed">
                                  Postponed
                                </SelectItem>
                                <SelectItem value="cancelled">
                                  Cancelled
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {!isAttendee && (
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label htmlFor="minTicketPrice">
                                  Min Ticket Price ($)
                                </Label>
                                <Input
                                  id="minTicketPrice"
                                  type="number"
                                  placeholder="0"
                                  value={filters.minTicketPrice}
                                  onChange={(e) =>
                                    setFilters({
                                      ...filters,
                                      minTicketPrice:
                                        e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="maxTicketPrice">
                                  Max Ticket Price ($)
                                </Label>
                                <Input
                                  id="maxTicketPrice"
                                  type="number"
                                  placeholder="1000"
                                  value={filters.maxTicketPrice}
                                  onChange={(e) =>
                                    setFilters({
                                      ...filters,
                                      maxTicketPrice:
                                        e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </TabsContent>
                  </Tabs>

                  <div className="pt-4 space-y-2">
                    <Button
                      onClick={handleSearch}
                      className="w-full"
                    >
                      <Search className="size-4 mr-2" />
                      Execute Query
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="w-full"
                    >
                      Reset Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results and SQL Query */}
            <div className="lg:col-span-2 space-y-6">
              {/* Generated SQL Query */}
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

              {/* Results */}
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
                      <p>
                        Configure your filters and click
                        "Execute Query" to search for events
                      </p>
                    </div>
                  ) : results.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Search className="size-12 mx-auto mb-4 opacity-50" />
                      <p>
                        No events found matching your criteria
                      </p>
                      <p className="text-sm mt-2">
                        Try adjusting your filters
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {results.map((event) => {
                        const ticketStats = getTicketStats(
                          event.event_id,
                        );
                        const occupancyRate = (
                          (ticketStats.sold /
                            ticketStats.total) *
                          100
                        ).toFixed(1);

                        return (
                          <Card key={event.event_id}>
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle>
                                    {event.name}
                                  </CardTitle>
                                  <CardDescription>
                                    {event.venue?.name}
                                  </CardDescription>
                                </div>
                                <div className="flex gap-2 flex-wrap justify-end">
                                  <Badge
                                    variant={
                                      event.status ===
                                      "scheduled"
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {event.status}
                                  </Badge>
                                  {isOrganizer &&
                                    event.venue && (
                                      <Badge variant="outline">
                                        $
                                        {event.venue.base_rental_rate.toLocaleString()}{" "}
                                        rental
                                      </Badge>
                                    )}
                                  {isResearcher && (
                                    <Badge
                                      variant={
                                        parseFloat(
                                          occupancyRate,
                                        ) > 70
                                          ? "default"
                                          : "secondary"
                                      }
                                    >
                                      {occupancyRate}% sold
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <p className="text-sm">
                                  {event.description}
                                </p>
                                <Separator />
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">
                                      Date:
                                    </span>
                                    <p>
                                      {new Date(
                                        event.date,
                                      ).toLocaleDateString(
                                        "en-US",
                                        {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        },
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      Time:
                                    </span>
                                    <p>
                                      {event.start_time.slice(
                                        0,
                                        5,
                                      )}{" "}
                                      -{" "}
                                      {event.end_time.slice(
                                        0,
                                        5,
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      Location:
                                    </span>
                                    <p>
                                      {event.venue?.city},{" "}
                                      {event.venue?.state}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      Capacity:
                                    </span>
                                    <p>
                                      {event.capacity.toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      {isOrganizer
                                        ? "Venue Type:"
                                        : "Tickets Available:"}
                                    </span>
                                    <p>
                                      {isOrganizer
                                        ? event.venue
                                            ?.venue_type
                                        : `${ticketStats.available.toLocaleString()} tickets`}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">
                                      Rating:
                                    </span>
                                    <p>
                                      ⭐{" "}
                                      {event.rating.toFixed(1)}
                                    </p>
                                  </div>
                                  {isOrganizer &&
                                    event.venue && (
                                      <>
                                        <div>
                                          <span className="text-muted-foreground">
                                            Venue Rating:
                                          </span>
                                          <p>
                                            ⭐{" "}
                                            {event.venue.rating.toFixed(
                                              1,
                                            )}
                                          </p>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">
                                            Contact:
                                          </span>
                                          <p>
                                            {
                                              event.venue
                                                .contact_name
                                            }
                                          </p>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">
                                            Phone:
                                          </span>
                                          <p>
                                            {
                                              event.venue
                                                .contact_phone
                                            }
                                          </p>
                                        </div>
                                      </>
                                    )}
                                  {isResearcher && (
                                    <>
                                      <div>
                                        <span className="text-muted-foreground">
                                          Tickets Sold:
                                        </span>
                                        <p>
                                          {ticketStats.sold.toLocaleString()}
                                        </p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">
                                          Reserved:
                                        </span>
                                        <p>
                                          {ticketStats.reserved.toLocaleString()}
                                        </p>
                                      </div>
                                      <div>
                                        <span className="text-muted-foreground">
                                          Venue Type:
                                        </span>
                                        <p>
                                          {
                                            event.venue
                                              ?.venue_type
                                          }
                                        </p>
                                      </div>
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