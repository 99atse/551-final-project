// Data structures matching the database schema

export interface Venue {
  venue_id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  venue_type: string;
  base_rental_rate: number;
  max_capacity: number;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  rating: number;
}

export interface Event {
  event_id: number;
  name: string;
  venue_id: number;
  date: string;
  start_time: string;
  end_time: string;
  capacity: number;
  type: string;
  status: 'scheduled' | 'complete' | 'postponed' | 'cancelled';
  description: string;
  rating: number;
  // Joined data from venue
  venue?: Venue;
}

export interface Ticket {
  ticket_id: number;
  event_id: number;
  type: string;
  status: 'sold' | 'available' | 'reserved';
  seat_location: string;
  face_value_price: number;
}

export interface Transaction {
  transaction_id: number;
  customer_id: number;
  type: 'customer' | 'booker';
  status: string;
  transaction_time: string;
}

export interface VenueBooking {
  venue_booking_id: number;
  event_id: number;
  venue_id: number;
  customer_id: number;
  transaction_id: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  negotiated_price: number;
}

// Mock Venues
export const mockVenues: Venue[] = [
  { venue_id: 1, name: "Hollywood Bowl", address: "2301 N Highland Ave", city: "Los Angeles", state: "CA", zipcode: "90068", country: "United States", venue_type: "Outdoor Amphitheater", base_rental_rate: 50000, max_capacity: 17500, contact_name: "John Smith", contact_phone: "(323) 850-2000", contact_email: "info@hollywoodbowl.com", rating: 4.8 },
  { venue_id: 2, name: "Blue Note Jazz Club", address: "131 W 3rd St", city: "New York", state: "NY", zipcode: "10012", country: "United States", venue_type: "Jazz Club", base_rental_rate: 8000, max_capacity: 350, contact_name: "Sarah Johnson", contact_phone: "(212) 475-8592", contact_email: "events@bluenote.net", rating: 4.9 },
  { venue_id: 3, name: "United Center", address: "1901 W Madison St", city: "Chicago", state: "IL", zipcode: "60612", country: "United States", venue_type: "Sports Arena", base_rental_rate: 75000, max_capacity: 23500, contact_name: "Mike Williams", contact_phone: "(312) 455-4500", contact_email: "booking@unitedcenter.com", rating: 4.7 },
  { venue_id: 4, name: "Bayfront Park", address: "301 Biscayne Blvd", city: "Miami", state: "FL", zipcode: "33132", country: "United States", venue_type: "Outdoor Park", base_rental_rate: 35000, max_capacity: 50000, contact_name: "Lisa Rodriguez", contact_phone: "(305) 358-7550", contact_email: "events@bayfrontparkmiami.com", rating: 4.5 },
  { venue_id: 5, name: "TD Garden", address: "100 Legends Way", city: "Boston", state: "MA", zipcode: "02114", country: "United States", venue_type: "Sports Arena", base_rental_rate: 80000, max_capacity: 19580, contact_name: "Tom Anderson", contact_phone: "(617) 624-1050", contact_email: "info@tdgarden.com", rating: 4.6 },
  { venue_id: 6, name: "Lumen Field", address: "800 Occidental Ave S", city: "Seattle", state: "WA", zipcode: "98134", country: "United States", venue_type: "Stadium", base_rental_rate: 120000, max_capacity: 68740, contact_name: "Jennifer Lee", contact_phone: "(206) 381-7582", contact_email: "events@lumenfield.com", rating: 4.8 },
  { venue_id: 7, name: "Arthur Ashe Stadium", address: "Flushing Meadows Corona Park", city: "New York", state: "NY", zipcode: "11368", country: "United States", venue_type: "Tennis Stadium", base_rental_rate: 100000, max_capacity: 23771, contact_name: "David Chen", contact_phone: "(718) 760-6200", contact_email: "info@usta.com", rating: 4.7 },
  { venue_id: 8, name: "Central Park", address: "Central Park West", city: "New York", state: "NY", zipcode: "10024", country: "United States", venue_type: "Public Park", base_rental_rate: 25000, max_capacity: 50000, contact_name: "Maria Garcia", contact_phone: "(212) 310-6600", contact_email: "permits@centralparknyc.org", rating: 4.9 },
  { venue_id: 9, name: "Vineyard Estate", address: "1234 Vineyard Lane", city: "Napa Valley", state: "CA", zipcode: "94558", country: "United States", venue_type: "Private Estate", base_rental_rate: 15000, max_capacity: 150, contact_name: "Robert Wilson", contact_phone: "(707) 963-4200", contact_email: "events@vineyardestate.com", rating: 5.0 },
  { venue_id: 10, name: "Beachfront Resort", address: "5678 Ocean Drive", city: "Miami", state: "FL", zipcode: "33139", country: "United States", venue_type: "Beach Resort", base_rental_rate: 20000, max_capacity: 200, contact_name: "Carlos Martinez", contact_phone: "(305) 674-5555", contact_email: "weddings@beachfrontresort.com", rating: 4.8 },
  { venue_id: 11, name: "Palace Hotel Ballroom", address: "2 New Montgomery St", city: "San Francisco", state: "CA", zipcode: "94105", country: "United States", venue_type: "Hotel Ballroom", base_rental_rate: 25000, max_capacity: 300, contact_name: "Patricia Taylor", contact_phone: "(415) 512-1111", contact_email: "events@palace hotel.com", rating: 4.9 },
  { venue_id: 12, name: "Historic Garden Estate", address: "789 Garden Way", city: "Charleston", state: "SC", zipcode: "29401", country: "United States", venue_type: "Garden Estate", base_rental_rate: 12000, max_capacity: 180, contact_name: "Elizabeth Brown", contact_phone: "(843) 722-4900", contact_email: "bookings@gardenestate.com", rating: 5.0 },
  { venue_id: 13, name: "Convention Center", address: "111 W Harbor Dr", city: "San Diego", state: "CA", zipcode: "92101", country: "United States", venue_type: "Convention Center", base_rental_rate: 150000, max_capacity: 135000, contact_name: "Richard Clark", contact_phone: "(619) 525-5000", contact_email: "sales@visitsandiego.com", rating: 4.6 },
  { venue_id: 14, name: "LA Convention Center", address: "1201 S Figueroa St", city: "Los Angeles", state: "CA", zipcode: "90015", country: "United States", venue_type: "Convention Center", base_rental_rate: 125000, max_capacity: 65000, contact_name: "Nancy White", contact_phone: "(213) 741-1151", contact_email: "info@lacclink.com", rating: 4.5 },
  { venue_id: 15, name: "Javits Center", address: "429 11th Ave", city: "New York", state: "NY", zipcode: "10001", country: "United States", venue_type: "Convention Center", base_rental_rate: 140000, max_capacity: 50000, contact_name: "Steven Harris", contact_phone: "(212) 216-2000", contact_email: "events@javitscenter.com", rating: 4.7 },
  { venue_id: 16, name: "Georgia World Congress Center", address: "285 Andrew Young International Blvd NW", city: "Atlanta", state: "GA", zipcode: "30313", country: "United States", venue_type: "Convention Center", base_rental_rate: 130000, max_capacity: 80000, contact_name: "Angela Martin", contact_phone: "(404) 223-4000", contact_email: "sales@gwcc.com", rating: 4.6 },
  { venue_id: 17, name: "Moscone Center", address: "747 Howard St", city: "San Francisco", state: "CA", zipcode: "94103", country: "United States", venue_type: "Convention Center", base_rental_rate: 160000, max_capacity: 25000, contact_name: "James Thompson", contact_phone: "(415) 974-4000", contact_email: "info@mosconecenter.com", rating: 4.8 },
  { venue_id: 18, name: "Hynes Convention Center", address: "900 Boylston St", city: "Boston", state: "MA", zipcode: "02115", country: "United States", venue_type: "Convention Center", base_rental_rate: 95000, max_capacity: 15000, contact_name: "Barbara Lewis", contact_phone: "(617) 954-2000", contact_email: "events@massconvention.com", rating: 4.5 },
  { venue_id: 19, name: "Mandalay Bay Convention Center", address: "3950 S Las Vegas Blvd", city: "Las Vegas", state: "NV", zipcode: "89119", country: "United States", venue_type: "Convention Center", base_rental_rate: 110000, max_capacity: 20000, contact_name: "Christopher Walker", contact_phone: "(702) 632-7777", contact_email: "meetings@mandalaybay.com", rating: 4.7 },
  { venue_id: 20, name: "Austin Convention Center", address: "500 E Cesar Chavez St", city: "Austin", state: "TX", zipcode: "78701", country: "United States", venue_type: "Convention Center", base_rental_rate: 85000, max_capacity: 12000, contact_name: "Michelle Young", contact_phone: "(512) 404-4000", contact_email: "sales@austinconventioncenter.com", rating: 4.6 }
];

// Mock Events with venue relationships
export const mockEvents: Event[] = [
  // Concerts/Festivals
  { event_id: 1, name: "Summer Music Festival 2026", venue_id: 1, date: "2026-07-15", start_time: "18:00:00", end_time: "23:00:00", capacity: 17500, type: "Concerts/Festivals", status: "scheduled", description: "Three-day outdoor music festival featuring top artists", rating: 4.7, venue: mockVenues[0] },
  { event_id: 2, name: "Jazz Night Live", venue_id: 2, date: "2026-04-20", start_time: "20:00:00", end_time: "23:30:00", capacity: 350, type: "Concerts/Festivals", status: "scheduled", description: "An intimate evening with world-renowned jazz musicians", rating: 4.9, venue: mockVenues[1] },
  { event_id: 3, name: "Rock Legends Tour", venue_id: 3, date: "2026-08-10", start_time: "19:00:00", end_time: "23:00:00", capacity: 23500, type: "Concerts/Festivals", status: "scheduled", description: "Classic rock bands reunite for one epic night", rating: 4.6, venue: mockVenues[2] },
  { event_id: 4, name: "Electronic Music Fest", venue_id: 4, date: "2026-09-05", start_time: "14:00:00", end_time: "02:00:00", capacity: 50000, type: "Concerts/Festivals", status: "scheduled", description: "World's best DJs and electronic music artists", rating: 4.8, venue: mockVenues[3] },

  // Sporting Events
  { event_id: 5, name: "Championship Basketball Game", venue_id: 5, date: "2026-06-12", start_time: "20:00:00", end_time: "22:30:00", capacity: 19580, type: "Sporting Events", status: "scheduled", description: "Eastern Conference Finals - Game 7", rating: 4.9, venue: mockVenues[4] },
  { event_id: 6, name: "International Soccer Match", venue_id: 6, date: "2026-05-18", start_time: "19:00:00", end_time: "21:00:00", capacity: 68740, type: "Sporting Events", status: "scheduled", description: "World Cup Qualifier - USA vs Mexico", rating: 4.7, venue: mockVenues[5] },
  { event_id: 7, name: "Tennis Grand Slam", venue_id: 7, date: "2026-09-01", start_time: "13:00:00", end_time: "18:00:00", capacity: 23771, type: "Sporting Events", status: "scheduled", description: "US Open Finals - Men's Singles", rating: 4.8, venue: mockVenues[6] },
  { event_id: 8, name: "Marathon Championship", venue_id: 8, date: "2026-11-01", start_time: "08:00:00", end_time: "16:00:00", capacity: 50000, type: "Sporting Events", status: "scheduled", description: "Annual NYC Marathon with elite runners", rating: 4.6, venue: mockVenues[7] },

  // Weddings
  { event_id: 9, name: "Smith & Johnson Wedding", venue_id: 9, date: "2026-06-20", start_time: "16:00:00", end_time: "23:00:00", capacity: 150, type: "Weddings", status: "scheduled", description: "Elegant outdoor wedding ceremony and reception", rating: 5.0, venue: mockVenues[8] },
  { event_id: 10, name: "Garcia Wedding Celebration", venue_id: 10, date: "2026-08-15", start_time: "17:00:00", end_time: "23:30:00", capacity: 200, type: "Weddings", status: "scheduled", description: "Beach wedding with tropical theme", rating: 4.9, venue: mockVenues[9] },
  { event_id: 11, name: "Chen & Park Wedding", venue_id: 11, date: "2026-10-10", start_time: "18:00:00", end_time: "23:00:00", capacity: 300, type: "Weddings", status: "scheduled", description: "Formal ballroom wedding with cultural fusion", rating: 5.0, venue: mockVenues[10] },
  { event_id: 12, name: "Thompson Garden Wedding", venue_id: 12, date: "2026-05-25", start_time: "15:00:00", end_time: "22:00:00", capacity: 180, type: "Weddings", status: "scheduled", description: "Southern garden wedding with live band", rating: 4.8, venue: mockVenues[11] },

  // Conventions
  { event_id: 13, name: "Comic Con International", venue_id: 13, date: "2026-07-22", start_time: "09:00:00", end_time: "19:00:00", capacity: 135000, type: "Conventions", status: "scheduled", description: "Pop culture and entertainment convention", rating: 4.8, venue: mockVenues[12] },
  { event_id: 14, name: "Gaming Expo 2026", venue_id: 14, date: "2026-06-15", start_time: "10:00:00", end_time: "20:00:00", capacity: 65000, type: "Conventions", status: "scheduled", description: "Latest video games and gaming technology showcase", rating: 4.7, venue: mockVenues[13] },
  { event_id: 15, name: "Anime & Manga Con", venue_id: 15, date: "2026-08-28", start_time: "09:00:00", end_time: "18:00:00", capacity: 50000, type: "Conventions", status: "scheduled", description: "Japanese animation and manga celebration", rating: 4.9, venue: mockVenues[14] },
  { event_id: 16, name: "Sci-Fi Convention", venue_id: 16, date: "2026-09-15", start_time: "08:00:00", end_time: "20:00:00", capacity: 80000, type: "Conventions", status: "scheduled", description: "Science fiction and fantasy multimedia convention", rating: 4.6, venue: mockVenues[15] },

  // Conferences
  { event_id: 17, name: "Tech Innovation Summit", venue_id: 17, date: "2026-05-10", start_time: "08:00:00", end_time: "18:00:00", capacity: 25000, type: "Conferences", status: "scheduled", description: "Annual technology and innovation conference", rating: 4.8, venue: mockVenues[16] },
  { event_id: 18, name: "Medical Research Symposium", venue_id: 18, date: "2026-06-05", start_time: "08:30:00", end_time: "17:30:00", capacity: 15000, type: "Conferences", status: "scheduled", description: "Latest advances in medical research and treatment", rating: 4.7, venue: mockVenues[17] },
  { event_id: 19, name: "Marketing Leadership Conference", venue_id: 19, date: "2026-09-20", start_time: "09:00:00", end_time: "18:00:00", capacity: 20000, type: "Conferences", status: "scheduled", description: "Global marketing trends and strategies", rating: 4.6, venue: mockVenues[18] },
  { event_id: 20, name: "Education Technology Forum", venue_id: 20, date: "2026-10-15", start_time: "08:00:00", end_time: "17:00:00", capacity: 12000, type: "Conferences", status: "scheduled", description: "Educational technology innovations and best practices", rating: 4.5, venue: mockVenues[19] }
];

// Mock Tickets
export const mockTickets: Ticket[] = [];
mockEvents.forEach(event => {
  const ticketTypes = event.type === "Weddings" ? ["Guest Invitation"] : 
                     event.type === "Conferences" ? ["General Admission", "VIP", "Speaker Pass"] :
                     event.type === "Sporting Events" ? ["General", "Premium", "Courtside/Field"] :
                     ["General Admission", "VIP", "Premium"];
  
  const basePrice = event.type === "Concerts/Festivals" ? 125 :
                   event.type === "Sporting Events" ? 180 :
                   event.type === "Weddings" ? 0 :
                   event.type === "Conventions" ? 85 :
                   499;
  
  ticketTypes.forEach((ticketType, idx) => {
    const ticketsPerType = Math.floor(event.capacity / ticketTypes.length);
    const soldPercentage = Math.random() * 0.4 + 0.4; // 40-80% sold
    const ticketsSold = Math.floor(ticketsPerType * soldPercentage);
    const ticketsAvailable = ticketsPerType - ticketsSold;
    
    const priceMultiplier = idx === 0 ? 1 : idx === 1 ? 1.5 : 2;
    
    for (let i = 0; i < ticketsPerType; i++) {
      mockTickets.push({
        ticket_id: mockTickets.length + 1,
        event_id: event.event_id,
        type: ticketType,
        status: i < ticketsSold ? 'sold' : i < ticketsSold + Math.floor(ticketsAvailable * 0.1) ? 'reserved' : 'available',
        seat_location: `Section ${Math.floor(i / 100)}-${i % 100}`,
        face_value_price: basePrice * priceMultiplier
      });
    }
  });
});

// Query execution function
export function executeQuery(
  category: string,
  userType: string,
  filters: {
    // Common filters
    searchTerm?: string;
    dateFrom?: string;
    dateTo?: string;
    city?: string;
    state?: string;
    
    // Attendee filters
    minTicketPrice?: number;
    maxTicketPrice?: number;
    ticketType?: string;
    eventStatus?: string;
    minEventRating?: number;
    venueType?: string;
    minCapacity?: number;
    maxCapacity?: number;
    
    // Organizer/Booker filters
    minRentalRate?: number;
    maxRentalRate?: number;
    minVenueRating?: number;
    availabilityDate?: string;
    
    // Researcher filters
    includeCompleted?: boolean;
    minTransactions?: number;
    aggregateBy?: string;
  }
): Event[] {
  let results = mockEvents.filter(event => event.type === category);

  // Apply user-type specific filters
  if (userType === 'researcher' && !filters.includeCompleted) {
    // Researchers can see all events including completed
  } else if (userType !== 'researcher') {
    // Non-researchers only see scheduled events by default
    results = results.filter(event => event.status === 'scheduled');
  }

  if (filters.eventStatus) {
    results = results.filter(event => event.status === filters.eventStatus);
  }

  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    results = results.filter(event => 
      event.name.toLowerCase().includes(term) ||
      event.description.toLowerCase().includes(term) ||
      event.venue?.name.toLowerCase().includes(term) ||
      event.venue?.city.toLowerCase().includes(term)
    );
  }

  if (filters.dateFrom) {
    results = results.filter(event => event.date >= filters.dateFrom!);
  }

  if (filters.dateTo) {
    results = results.filter(event => event.date <= filters.dateTo!);
  }

  if (filters.city) {
    results = results.filter(event => 
      event.venue?.city.toLowerCase().includes(filters.city!.toLowerCase())
    );
  }

  if (filters.state) {
    results = results.filter(event => 
      event.venue?.state.toLowerCase() === filters.state!.toLowerCase()
    );
  }

  if (filters.venueType) {
    results = results.filter(event => 
      event.venue?.venue_type.toLowerCase().includes(filters.venueType!.toLowerCase())
    );
  }

  if (filters.minCapacity !== undefined) {
    results = results.filter(event => event.capacity >= filters.minCapacity!);
  }

  if (filters.maxCapacity !== undefined) {
    results = results.filter(event => event.capacity <= filters.maxCapacity!);
  }

  if (filters.minEventRating !== undefined) {
    results = results.filter(event => event.rating >= filters.minEventRating!);
  }

  // Ticket price filtering (for attendees)
  if (filters.minTicketPrice !== undefined || filters.maxTicketPrice !== undefined) {
    results = results.filter(event => {
      const eventTickets = mockTickets.filter(t => t.event_id === event.event_id);
      if (eventTickets.length === 0) return false;
      
      const prices = eventTickets.map(t => t.face_value_price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      const meetsMin = filters.minTicketPrice === undefined || maxPrice >= filters.minTicketPrice;
      const meetsMax = filters.maxTicketPrice === undefined || minPrice <= filters.maxTicketPrice;
      
      return meetsMin && meetsMax;
    });
  }

  if (filters.ticketType) {
    results = results.filter(event => {
      const eventTickets = mockTickets.filter(t => 
        t.event_id === event.event_id && 
        t.type.toLowerCase().includes(filters.ticketType!.toLowerCase())
      );
      return eventTickets.length > 0;
    });
  }

  // Venue filters (for organizers)
  if (filters.minRentalRate !== undefined) {
    results = results.filter(event => 
      event.venue && event.venue.base_rental_rate >= filters.minRentalRate!
    );
  }

  if (filters.maxRentalRate !== undefined) {
    results = results.filter(event => 
      event.venue && event.venue.base_rental_rate <= filters.maxRentalRate!
    );
  }

  if (filters.minVenueRating !== undefined) {
    results = results.filter(event => 
      event.venue && event.venue.rating >= filters.minVenueRating!
    );
  }

  return results;
}

// Get tickets for an event
export function getEventTickets(eventId: number): Ticket[] {
  return mockTickets.filter(t => t.event_id === eventId);
}

// Get ticket statistics
export function getTicketStats(eventId: number) {
  const tickets = getEventTickets(eventId);
  const available = tickets.filter(t => t.status === 'available').length;
  const sold = tickets.filter(t => t.status === 'sold').length;
  const reserved = tickets.filter(t => t.status === 'reserved').length;
  
  return { total: tickets.length, available, sold, reserved };
}
