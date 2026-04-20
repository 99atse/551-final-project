import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Search, Database } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"

interface Venue {
  venue_id: number
  name: string
  city: string
  state: string
  venue_type: string
  base_rental_rate: number
  max_capacity: number
  contact_name: string
  contact_phone: string
  rating: number
  total_events: number
  avg_event_rating: number | null
  booking_time_range: string | null
  status: string | null
}

const categoryMap: Record<string, string> = {
  "concerts-festivals": "Concerts/Festivals",
  "sporting-events": "Sporting Events",
  weddings: "Weddings",
  conventions: "Conventions",
  conferences: "Conferences",
}

export function VenueQuery() {
  const { category, userType } = useParams<{
    category: string
    userType: string
  }>()

  const categoryName = category ? categoryMap[category] ?? "Venues" : "Venues"

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
    bookingTimeRange: "",
  })

  const [results, setResults] = useState<Venue[]>([])
  const [generatedSQL, setGeneratedSQL] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams()

      if (filters.searchTerm) params.append("search", filters.searchTerm)
      if (filters.city) params.append("city", filters.city)
      if (filters.state) params.append("state", filters.state)
      if (filters.venueType) params.append("venueType", filters.venueType)
      if (filters.minCapacity) params.append("minCapacity", filters.minCapacity)
      if (filters.maxCapacity) params.append("maxCapacity", filters.maxCapacity)
      if (filters.minRentalRate) params.append("minRentalRate", filters.minRentalRate)
      if (filters.maxRentalRate) params.append("maxRentalRate", filters.maxRentalRate)
      if (filters.minVenueRating) params.append("minVenueRating", filters.minVenueRating)
      if (filters.bookingTimeRange) params.append("bookingTimeRange", filters.bookingTimeRange)

      const res = await fetch(`/api/venues?${params.toString()}`)
      if (!res.ok) {
        throw new Error("Failed to fetch venues")
      }

      const data = await res.json()
      setResults(data)
      setHasSearched(true)
      generateSQL(params)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const generateSQL = (params: URLSearchParams) => {
    let sql = `
        SELECT
        v.venue_id,
        v.name,
        v.city,
        v.state,
        v.venue_type,
        v.base_rental_rate,
        v.max_capacity,
        v.contact_name,
        v.contact_phone,
        v.rating,
        COUNT(DISTINCT e.event_id) AS total_events,
        AVG(e.rating) AS avg_event_rating,
        '[' ||
        TO_CHAR(lower(va.booking_time_range), 'YYYY-MM-DD HH24:MI:SS') ||
        ', ' ||
        TO_CHAR(upper(va.booking_time_range), 'YYYY-MM-DD HH24:MI:SS') ||
        ')' AS booking_time_range,
        va.status
        FROM venues v
        LEFT JOIN events e
        ON v.venue_id = e.venue_id
        LEFT JOIN venue_availability va
        ON v.venue_id = va.venue_id
        WHERE 1=1
        AND va.status = 'available'
    `

    if (params.get("search")) {
      sql += `\n  AND v.name ILIKE '%${params.get("search")}%'`
    }

    if (params.get("city")) {
      sql += `\n  AND v.city ILIKE '%${params.get("city")}%'`
    }

    if (params.get("state")) {
      sql += `\n  AND v.state = '${params.get("state")}'`
    }

    if (params.get("venueType")) {
      sql += `\n  AND v.venue_type ILIKE '%${params.get("venueType")}%'`
    }

    if (params.get("minCapacity")) {
      sql += `\n  AND v.max_capacity >= ${params.get("minCapacity")}`
    }

    if (params.get("maxCapacity")) {
      sql += `\n  AND v.max_capacity <= ${params.get("maxCapacity")}`
    }

    if (params.get("minRentalRate")) {
      sql += `\n  AND v.base_rental_rate >= ${params.get("minRentalRate")}`
    }

    if (params.get("maxRentalRate")) {
      sql += `\n  AND v.base_rental_rate <= ${params.get("maxRentalRate")}`
    }

    if (params.get("minVenueRating")) {
      sql += `\n  AND v.rating >= ${params.get("minVenueRating")}`
    }

    if (params.get("bookingTimeRange")) {
      sql += `\n  AND va.booking_time_range::text ILIKE '%${params.get("bookingTimeRange")}%'`
    }

    sql += `
        GROUP BY
        v.venue_id,
        v.name,
        v.city,
        v.state,
        v.venue_type,
        v.base_rental_rate,
        v.max_capacity,
        v.contact_name,
        v.contact_phone,
        v.rating,
        va.booking_time_range,
        va.status
        ORDER BY v.rating DESC;
    `

    setGeneratedSQL(sql.trim())
  }

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
      bookingTimeRange: "",
    })
    setResults([])
    setHasSearched(false)
    setGeneratedSQL("")
    setError(null)
  }

  function parseTimeRange(range: string | null) {
    if (!range) return null

    const match = range.match(
      /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}).*?(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/
    )

    if (!match) return null

    const start = new Date(match[1].replace(" ", "T"))
    const end = new Date(match[2].replace(" ", "T"))

    return { start, end }
  }

  function groupByDate(venues: Venue[]) {
    const groups: Record<string, Venue[]> = {}

    for (const v of venues) {
      const parsed = parseTimeRange(v.booking_time_range)
      if (!parsed) continue

      const dateKey = parsed.start.toISOString().split("T")[0]

      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(v)
    }

    return groups
  }

  const groupedResults = groupByDate(results)

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
            <h1 className="mb-2">Find a Venue</h1>
            <p className="text-muted-foreground">
              Search available venues for your event
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Filters */}
            <Card className="lg:col-span-1 h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="size-5" />
                  Venue Filters
                </CardTitle>
                <CardDescription>Search for available venues</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="searchTerm">Search</Label>
                  <Input
                    id="searchTerm"
                    placeholder="Venue name..."
                    value={filters.searchTerm}
                    onChange={(e) =>
                      setFilters({ ...filters, searchTerm: e.target.value })
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
                        setFilters({ ...filters, city: e.target.value })
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
                        setFilters({ ...filters, state: e.target.value.toUpperCase() })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="venueType">Venue Type</Label>
                  <Input
                    id="venueType"
                    placeholder="e.g. Amphitheater"
                    value={filters.venueType}
                    onChange={(e) =>
                      setFilters({ ...filters, venueType: e.target.value })
                    }
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
                      onChange={(e) =>
                        setFilters({ ...filters, minCapacity: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxCapacity">Max Capacity</Label>
                    <Input
                      id="maxCapacity"
                      type="number"
                      placeholder="1000"
                      value={filters.maxCapacity}
                      onChange={(e) =>
                        setFilters({ ...filters, maxCapacity: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="minRentalRate">Min Rental Rate</Label>
                    <Input
                      id="minRentalRate"
                      type="number"
                      placeholder="5000"
                      value={filters.minRentalRate}
                      onChange={(e) =>
                        setFilters({ ...filters, minRentalRate: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxRentalRate">Max Rental Rate</Label>
                    <Input
                      id="maxRentalRate"
                      type="number"
                      placeholder="200000"
                      value={filters.maxRentalRate}
                      onChange={(e) =>
                        setFilters({ ...filters, maxRentalRate: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="minVenueRating">Min Rating</Label>
                  <Input
                    id="minVenueRating"
                    type="number"
                    placeholder="4.5"
                    value={filters.minVenueRating}
                    onChange={(e) =>
                      setFilters({ ...filters, minVenueRating: e.target.value })
                    }
                  />
                </div>

                <Button onClick={handleSearch} disabled={isLoading} className="w-full">
                  <Search className="mr-2 size-4" />
                  {isLoading ? "Loading..." : "Search"}
                </Button>

                <Button onClick={handleReset} variant="outline" className="w-full">
                  Reset Filters
                </Button>

                {error && <p className="text-sm text-destructive">{error}</p>}
              </CardContent>
            </Card>

            <div className="space-y-6 lg:col-span-2">
              {generatedSQL && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="size-5" />
                      Generated SQL
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="overflow-auto rounded bg-muted p-4 text-sm">
                      {generatedSQL}
                    </pre>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Search Results</CardTitle>
                  <CardDescription>
                    {hasSearched ? `${results.length} venues found` : "SQL query for filters"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {!hasSearched ? (
                    <div className="py-12 text-center text-muted-foreground">
                      <Database className="mx-auto mb-4 size-12 opacity-50" />
                      <p>Configure your filters and click "Search" to search for venues</p>
                    </div>
                  ) : results.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      <Database className="mx-auto mb-4 size-12 opacity-50" />
                      <p>No venues found matching your criteria</p>
                    </div>
                  ) : (
                    results.map((venue) => (
                      <Card key={`${venue.venue_id}-${venue.booking_time_range ?? "no-time"}`}>
                        <CardHeader>
                          <CardTitle>{venue.name}</CardTitle>
                          <CardDescription>
                            {venue.city}, {venue.state}
                          </CardDescription>
                        </CardHeader>

                        <CardContent>
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3">
                              <div>
                                <span className="text-muted-foreground">Type</span>
                                <p>{venue.venue_type}</p>
                              </div>

                              <div>
                                <span className="text-muted-foreground">Available Time</span>
                                {(() => {
                                  const time = parseTimeRange(venue.booking_time_range)

                                  if (!time) {
                                    return <p>No available time provided</p>
                                  }

                                  const dateLabel = time.start.toLocaleDateString(undefined, {
                                    weekday: "short",
                                    month: "short",
                                    day: "numeric",
                                  })

                                  const timeLabel = `${time.start.toLocaleTimeString([], {
                                    hour: "numeric",
                                    minute: "2-digit",
                                  })} – ${time.end.toLocaleTimeString([], {
                                    hour: "numeric",
                                    minute: "2-digit",
                                  })}`

                                  return (
                                    <div className="mt-1 space-y-1">
                                      <p className="font-medium">{dateLabel}</p>
                                      <p className="text-sm text-muted-foreground">{timeLabel}</p>
                                    </div>
                                  )
                                })()}
                              </div>

                              <div>
                                <span className="text-muted-foreground">Capacity</span>
                                <p>{Number(venue.max_capacity).toLocaleString()}</p>
                              </div>

                              <div>
                                <span className="text-muted-foreground">Rental Rate</span>
                                <p>${Number(venue.base_rental_rate).toLocaleString()}</p>
                              </div>

                              <div>
                                <span className="text-muted-foreground">Rating</span>
                                <p>⭐ {venue.rating ? Number(venue.rating).toFixed(1) : "N/A"}</p>
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

                            <Separator />
                            <div className="flex justify-between items-center">
                              <Badge variant="outline">
                                Avg Event Rating: ⭐{" "}
                                {venue.avg_event_rating
                                  ? Number(venue.avg_event_rating).toFixed(1)
                                  : "N/A"}
                              </Badge>

                            {/* Action row — bottom right */}
                              <Button asChild disabled={!venue.booking_time_range}>
                                <Link
                                  to={`/${userType}/category/${category}/book-venue/${venue.venue_id}?bookingTimeRange=${encodeURIComponent(
                                    venue.booking_time_range ?? ""
                                  )}`}
                                >
                                  Book Venue
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}