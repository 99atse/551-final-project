import { useState } from "react";
import { useParams, Link } from "react-router-dom";
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

interface VenueResult {
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

  total_events: number;
  avg_event_rating: number;
  tickets_sold: number;
}

const categoryMap: { [key: string]: string } = {
  "concerts-festivals": "Concerts/Festivals",
  "sporting-events": "Sporting Events",
  weddings: "Weddings",
  conventions: "Conventions",
  conferences: "Conferences",
};

export function VenueQuery() {
  const { category, userType } = useParams<{
    category: string;
    userType: string;
  }>();
const categoryName = category ? categoryMap[category] : "";

  const [filters, setFilters] = useState({
    searchTerm: "",
    city: "",
    state: "",
    venueType: "",
    minCapacity: "",
    maxCapacity: "",
    minRentalRate: "",
    maxRentalRate: "",
    minVenueRating: "",
  });

  const [results, setResults] = useState<VenueResult[]>([]);
  const [generatedSQL, setGeneratedSQL] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState()

  const handleSearch = async () => {
    setIsLoading(true);

    const params = new URLSearchParams();

    if (filters.searchTerm) params.append("search", filters.searchTerm);
    if (filters.city) params.append("city", filters.city);
    if (filters.state) params.append("state", filters.state);
    if (filters.venueType) params.append("venueType", filters.venueType);
    if (filters.minCapacity) params.append("minCapacity", filters.minCapacity);
    if (filters.maxCapacity) params.append("maxCapacity", filters.maxCapacity);
    if (filters.minRentalRate) params.append("minRentalRate", filters.minRentalRate);
    if (filters.maxRentalRate) params.append("maxRentalRate", filters.maxRentalRate);
    if (filters.minVenueRating) params.append("minVenueRating", filters.minVenueRating);

    const res = await fetch(`/api/venues?${params}`);
    const data = await res.json();

    setResults(data);
    setHasSearched(true);
    generateSQL(params);
    setIsLoading(false);
  };

  const generateSQL = (params: URLSearchParams) => {
    let sql = `
        SELECT 
            v.*,
            COUNT(DISTINCT e.event_id) AS total_events,
            AVG(e.rating) AS avg_event_rating
        FROM venues v
        LEFT JOIN events e ON v.venue_id = e.venue_id
        WHERE 1=1
        GROUP BY v.venue_id
        `;

    if (params.get("search"))
      sql += `\n AND v.name ILIKE '%${params.get("search")}%'`;

    if (params.get("city"))
      sql += `\n AND v.city ILIKE '%${params.get("city")}%'`;

    if (params.get("state"))
      sql += `\n AND v.state = '${params.get("state")}'`;

    if (params.get("venueType"))
      sql += `\n AND v.venue_type ILIKE '%${params.get("venueType")}%'`;

    if (params.get("minCapacity"))
      sql += `\n AND v.max_capacity >= ${params.get("minCapacity")}`;

    if (params.get("maxCapacity"))
      sql += `\n AND v.max_capacity <= ${params.get("maxCapacity")}`;

    if (params.get("minRentalRate"))
      sql += `\n AND v.base_rental_rate >= ${params.get("minRentalRate")}`;

    if (params.get("maxRentalRate"))
      sql += `\n AND v.base_rental_rate <= ${params.get("maxRentalRate")}`;

    if (params.get("minVenueRating"))
      sql += `\n AND v.rating >= ${params.get("minVenueRating")}`;

    sql += `\nGROUP BY v.venue_id`;
    sql += `\nORDER BY v.rating DESC;`;

    setGeneratedSQL(sql);
  };

  const handleReset = () => {
    setFilters({
      searchTerm: "",
      city: "",
      state: "",
      venueType: "",
      minCapacity: "",
      maxCapacity: "",
      minRentalRate: "",
      maxRentalRate: "",
      minVenueRating: "",
    });
    setResults([]);
    setHasSearched(false);
    setGeneratedSQL("");
    // setError("");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <Link to={`/${userType}/categories`} className="flex items-center gap-2 mb-4 text-sm">
        <ArrowLeft className="size-4" />
        Back to Categories
      </Link>

      <div className="mb-8">
            <h1 className="mb-2">{categoryName}</h1>
            <p className="text-muted-foreground">
              Viewing as:{" "}
              <span className="font-medium text-foreground">
                Event Organizer
              </span>{" "}
              - Use the filters below to query venues
            </p>
    </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* FILTERS */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                    <Search className="size-5" />
                    Venue Filters
                    </CardTitle>
            <CardDescription>Search for venues to attend</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">

            <Label htmlFor="searchTerm">Search</Label>
            <div>
                <Input
                    className="bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-primary"
                    placeholder="Venue name..."
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
                <Label htmlFor="state">Venue Type</Label>
                <Input
                placeholder="e.g Amphitheater"
                value={filters.venueType}
                onChange={(e) => setFilters({ ...filters, venueType: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <Label htmlFor="state">Min Capacity</Label>
                    <Input
                    type="number"
                    placeholder="0"
                    value={filters.minCapacity}
                    onChange={(e) => setFilters({ ...filters, minCapacity: e.target.value })}
                    />
                </div>

                <div>
                    <Label htmlFor="state">Max Capacity</Label>
                    <Input
                    type="number"
                    placeholder="1000"
                    value={filters.maxCapacity}
                    onChange={(e) => setFilters({ ...filters, maxCapacity: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div>
                    <Label htmlFor="state">Min Rental Rate</Label>
                    <Input
                    type="number"
                    placeholder="5000"
                    value={filters.minRentalRate}
                    onChange={(e) => setFilters({ ...filters, minRentalRate: e.target.value })}
                    />
                </div>

                <div>
                    <Label htmlFor="state">Max Rental Rate</Label>
                    <Input
                    type="number"
                    placeholder="200000"
                    value={filters.maxRentalRate}
                    onChange={(e) => setFilters({ ...filters, maxRentalRate: e.target.value })}
                    />
                </div>
            </div>

            <div>
                <Label htmlFor="state">Min Ratimg</Label>
                <Input
                type="number"
                placeholder="4.5"
                value={filters.minVenueRating}
                onChange={(e) => setFilters({ ...filters, minVenueRating: e.target.value })}
                />
            </div>

            <Button onClick={handleSearch} disabled={isLoading} className="w-full">
              <Search className="size-4 mr-2" />
              {isLoading ? "Loading..." : "Search"}
            </Button>
            <Button onClick={handleReset} variant="outline" className="w-full">
                      Reset Filters
            </Button>
          </CardContent>
        </Card>

        {/* RESULTS */}
        <div className="lg:col-span-2 space-y-6">

          {generatedSQL && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="size-5" />
                  Generated SQL
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-muted p-4 rounded">
                  {generatedSQL}
                </pre>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                {hasSearched
                  ? `${results.length} venues found`
                  : "SQL query for filters"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="text-center py-12 text-muted-foreground">
                      <Database className="size-12 mx-auto mb-4 opacity-50" />
                      <p>Configure your filters and click "Search" to search for venues</p>
                </div>
              {results.map((venue) => (
                <Card key={venue.venue_id}>
                  <CardHeader>
                    <CardTitle>{venue.name}</CardTitle>
                    <CardDescription>
                      {venue.city}, {venue.state}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">

                      <div>
                        <span className="text-muted-foreground">Type</span>
                        <p>{venue.venue_type}</p>
                      </div>

                      <div>
                        <span className="text-muted-foreground">Capacity</span>
                        <p>{venue.max_capacity.toLocaleString()}</p>
                      </div>

                      <div>
                        <span className="text-muted-foreground">Rental Rate</span>
                        <p>${venue.base_rental_rate.toLocaleString()}</p>
                      </div>

                      <div>
                        <span className="text-muted-foreground">Rating</span>
                        <p>⭐ {Number(venue.rating)?.toFixed(1) || "N/A"}</p>
                      </div>

                      <div>
                        <span className="text-muted-foreground">Events Hosted</span>
                        <p>{venue.total_events}</p>
                      </div>

                      <div>
                        <span className="text-muted-foreground">Contact</span>
                        <p>{venue.contact_name}</p>
                      </div>

                      <div>
                        <span className="text-muted-foreground">Phone</span>
                        <p>{venue.contact_phone}</p>
                      </div>

                    </div>

                    <Separator className="my-3" />

                    <Badge variant="outline">
                      Avg Event Rating: ⭐ {venue.avg_event_rating?.toFixed(1) || "N/A"}
                    </Badge>

                    <div>
                        <Button asChild>
                            <Link to={`/${userType}/category/${category}/book-venue/${venue.venue_id}`}>
                            Book Venue
                            </Link>
                        </Button>
                    </div>

                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}