import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, User, Mail, Phone, MapPin, Calendar, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// Types matching PostgreSQL schema
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
  contact_name: string;
  contact_phone: string;
  venue_rating: number;
}

interface Ticket {
  ticket_id: number;
  event_id: number;
  type: string;
  status: string;
  seat_location: string;
  face_value_price: number;
  quantity: number;
  quantity_sold: number;
}

export function BookingForm() {
  const { eventId, userType, category } = useParams<{ eventId: string; userType: string; category: string }>();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Get unique ticket types with their prices
  const ticketTypes = Array.from(new Set(tickets.map(t => t.type)));
  const getTicketPrice = (type: string) => {
    const ticket = tickets.find(t => t.type === type);
    return ticket?.face_value_price || 0;
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 10);

    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return value;

    const [, area, prefix, line] = match;

    if (line) return `(${area}) ${prefix}-${line}`;
    if (prefix) return `(${area}) ${prefix}`;
    if (area) return `(${area}`;

    return '';
  };
  
  const getAvailableTicketCount = () => {
  return tickets.reduce((total, ticket) => {
    return total + (ticket.quantity - ticket.quantity_sold);
  }, 0);
};

  const [bookingData, setBookingData] = useState({
    // Customer information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Billing address
    address: '',
    city: '',
    state: '',
    zipcode: '',
    
    // Ticket selection
    ticketType: '',
    quantity: '1',
    
    // Payment information
    paymentType: '',
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch event and tickets on mount
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        
        // Fetch event details
        const eventRes = await fetch(`/api/events/${eventId}`);
        if (!eventRes.ok) throw new Error('Event not found');
        const eventData = await eventRes.json();
        setEvent(eventData);
        
        // Fetch available tickets
        const ticketsRes = await fetch(`/api/events/${eventId}/tickets`);
        // if (!ticketsRes.ok) throw new Error('Failed to fetch tickets');
        if (!ticketsRes.ok) {
          const errorText = await ticketsRes.text();
          console.error("Tickets API error:", errorText);
          throw new Error(`Failed to fetch tickets: ${ticketsRes.status}`);
        }
        const ticketsData = await ticketsRes.json();
        setTickets(ticketsData);
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    if (eventId) {
      fetchEventData();
    }
  }, [eventId]);

  const getAvailableByType = (type: string) => {
        return tickets
          .filter(t => t.type === type)
          .reduce((sum, t) => sum + (t.quantity - t.quantity_sold), 0);
      };
      
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Customer info validation
    if (!bookingData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!bookingData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!bookingData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!bookingData.phone.trim()) newErrors.phone = 'Phone number is required';

    // Address validation
    if (!bookingData.address.trim()) newErrors.address = 'Address is required';
    if (!bookingData.city.trim()) newErrors.city = 'City is required';
    if (!bookingData.state.trim()) newErrors.state = 'State is required';
    if (!bookingData.zipcode.trim()) newErrors.zipcode = 'Zipcode is required';

    // Ticket validation
    if (!bookingData.ticketType) newErrors.ticketType = 'Please select a ticket type';
    const quantity = parseInt(bookingData.quantity);
    if (!bookingData.quantity || quantity < 1) {
      newErrors.quantity = 'Please select quantity';
    } else if (quantity > Math.min(10, getAvailableTicketCount())) {
      newErrors.quantity = `Maximum ${Math.min(10, getAvailableTicketCount())} tickets`;
    }

    // Payment validation
    if (!bookingData.paymentType) {
      newErrors.paymentType = 'Please select a payment method';
    }
    if (!bookingData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(bookingData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    if (!bookingData.cardName.trim()) newErrors.cardName = 'Cardholder name is required';
    if (!bookingData.expiryMonth) newErrors.expiryMonth = 'Expiry month required';
    if (!bookingData.expiryYear) newErrors.expiryYear = 'Expiry year required';
    if (!bookingData.cvv.trim()) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(bookingData.cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const quantity = parseInt(bookingData.quantity);
      
      const ticketTypeData = tickets.find(
        t => t.type === bookingData.ticketType
      );

      if (!ticketTypeData) {
        throw new Error("Invalid ticket type selected");
      }

      const available =
        ticketTypeData.quantity - ticketTypeData.quantity_sold;

        if (quantity > available) {
        throw new Error("Not enough tickets available");
      }

      if (!bookingData.paymentType) {
        throw new Error("Payment method is required");
      }
      
      const bookingPayload = {
        event_id: parseInt(eventId || '0'),

        selected_ticket_id: tickets.find(
          t => t.type === bookingData.ticketType
        )?.ticket_id,

        name: `${bookingData.firstName} ${bookingData.lastName}`,
        contact_email: bookingData.email,
        contact_phone: bookingData.phone,

        address: `${bookingData.address}, ${bookingData.city}, ${bookingData.state} ${bookingData.zipcode}`,

        ticket_type: bookingData.ticketType,
        quantity: quantity,

        payment_type: bookingData.paymentType,
        card_number_last_4: bookingData.cardNumber.slice(-4),
        cardholder_name: bookingData.cardName,

        total_amount: totalPrice,
      };
      
      const response = await fetch('/api/bookings/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Booking failed');
      }
      
      const result = await response.json();
      
      // Success! Show confirmation and navigate
      alert(`Booking confirmed! Confirmation #${result.booking_id}\n\nYou will receive a confirmation email at ${bookingData.email}`);
      navigate(`/${userType}/category/${category}`);
      
    } catch (err: any) {
      setError(err.message);
      alert(`Booking failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const totalPrice = bookingData.ticketType 
    ? Number(getTicketPrice(bookingData.ticketType)) * parseInt(bookingData.quantity || '1')
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-center">Loading event details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(`/${userType}/categories`)}>
              Return to Categories
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Event Not Found</CardTitle>
            <CardDescription>The event you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(`/${userType}/categories`)}>
              Return to Categories
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <Link
            to={`/${userType}/category/${category}`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="size-4" />
            Back to Events
          </Link>

          <div className="mb-8">
            <h1 className="mb-2">Book Event</h1>
            <p className="text-muted-foreground">
              Complete the form below to book your tickets
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="size-5" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={bookingData.firstName}
                          onChange={(e) => setBookingData({ ...bookingData, firstName: e.target.value })}
                          className={formErrors.firstName ? 'border-destructive' : ''}
                        />
                        {formErrors.firstName && <p className="text-sm text-destructive mt-1">{formErrors.firstName}</p>}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={bookingData.lastName}
                          onChange={(e) => setBookingData({ ...bookingData, lastName: e.target.value })}
                          className={formErrors.lastName ? 'border-destructive' : ''}
                        />
                        {formErrors.lastName && <p className="text-sm text-destructive mt-1">{formErrors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          className={`pl-10 ${formErrors.email ? 'border-destructive' : ''}`}
                          value={bookingData.email}
                          onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                          placeholder="you@example.com"
                        />
                      </div>
                      {formErrors.email && <p className="text-sm text-destructive mt-1">{formErrors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          className={`pl-10 ${formErrors.phone ? 'border-destructive' : ''}`}
                          value={bookingData.phone}
                          onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value);
                            setBookingData({ ...bookingData, phone: formatted });
                          }}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      {formErrors.phone && <p className="text-sm text-destructive mt-1">{formErrors.phone}</p>}
                    </div>
                  </CardContent>
                </Card>

                {/* Billing Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="size-5" />
                      Billing Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Input
                        id="address"
                        value={bookingData.address}
                        onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                        placeholder="123 Main St"
                        className={formErrors.address ? 'border-destructive' : ''}
                      />
                      {formErrors.address && <p className="text-sm text-destructive mt-1">{formErrors.address}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={bookingData.city}
                          onChange={(e) => setBookingData({ ...bookingData, city: e.target.value })}
                          className={formErrors.city ? 'border-destructive' : ''}
                        />
                        {formErrors.city && <p className="text-sm text-destructive mt-1">{formErrors.city}</p>}
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          value={bookingData.state}
                          onChange={(e) => setBookingData({ ...bookingData, state: e.target.value })}
                          placeholder="e.g. CA"
                          className={formErrors.state ? 'border-destructive' : ''}
                        />
                        {formErrors.state && <p className="text-sm text-destructive mt-1">{formErrors.state}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="zipcode">Zipcode *</Label>
                      <Input
                        id="zipcode"
                        value={bookingData.zipcode}
                        onChange={(e) => setBookingData({ ...bookingData, zipcode: e.target.value })}
                        placeholder="12345"
                        className={formErrors.zipcode ? 'border-destructive' : ''}
                      />
                      {formErrors.zipcode && <p className="text-sm text-destructive mt-1">{formErrors.zipcode}</p>}
                    </div>
                  </CardContent>
                </Card>

                {/* Ticket Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ticket Selection</CardTitle>
                    <CardDescription>
                      Select your ticket type and quantity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="ticketType">Ticket Type *</Label>
                      <Select
                        value={bookingData.ticketType}
                        onValueChange={(value) => setBookingData({ ...bookingData, ticketType: value })}
                      >
                        <SelectTrigger id="ticketType" className={formErrors.ticketType ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Select ticket type" />
                        </SelectTrigger>
                        <SelectContent>
                          {ticketTypes.map(type => (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center justify-between w-full gap-4">
                                <span>{type} - ${Number(getTicketPrice(type)).toFixed(2)}</span>

                                <span className="text-xs text-muted-foreground">
                                  {getAvailableByType(type)} left
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formErrors.ticketType && <p className="text-sm text-destructive mt-1">{formErrors.ticketType}</p>}
                    </div>

                    <div>
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max={Math.min(10, getAvailableTicketCount())}
                        value={bookingData.quantity}
                        onChange={(e) => setBookingData({ ...bookingData, quantity: e.target.value })}
                        className={formErrors.quantity ? 'border-destructive' : ''}
                      />
                      {formErrors.quantity && <p className="text-sm text-destructive mt-1">{formErrors.quantity}</p>}
                      <p className="text-sm text-muted-foreground mt-1">
                        {getAvailableTicketCount()} tickets available
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="size-5" />
                      Payment Information
                    </CardTitle>
                    <Label>Payment Method</Label>
                      <Select
                        value={bookingData.paymentType}
                        onValueChange={(value) =>
                          setBookingData(prev => ({ ...prev, paymentType: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="credit_card">Credit Card</SelectItem>
                          <SelectItem value="debit_card">Debit Card</SelectItem>
                          <SelectItem value="apple_pay">Apple Pay</SelectItem>
                        </SelectContent>
                      </Select>
                    <CardDescription>
                      Enter your payment details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input
                        id="cardNumber"
                        value={bookingData.cardNumber}
                        onChange={(e) => {
                          const formatted = formatCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16));
                          setBookingData({ ...bookingData, cardNumber: formatted });
                        }}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={formErrors.cardNumber ? 'border-destructive' : ''}
                      />
                      {formErrors.cardNumber && <p className="text-sm text-destructive mt-1">{formErrors.cardNumber}</p>}
                    </div>

                    <div>
                      <Label htmlFor="cardName">Cardholder Name *</Label>
                      <Input
                        id="cardName"
                        value={bookingData.cardName}
                        onChange={(e) => setBookingData({ ...bookingData, cardName: e.target.value })}
                        placeholder="John Smith"
                        className={formErrors.cardName ? 'border-destructive' : ''}
                      />
                      {formErrors.cardName && <p className="text-sm text-destructive mt-1">{formErrors.cardName}</p>}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="expiryMonth">Month *</Label>
                        <Select
                          value={bookingData.expiryMonth}
                          onValueChange={(value) => setBookingData({ ...bookingData, expiryMonth: value })}
                        >
                          <SelectTrigger id="expiryMonth" className={formErrors.expiryMonth ? 'border-destructive' : ''}>
                            <SelectValue placeholder="MM" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => {
                              const month = (i + 1).toString().padStart(2, '0');
                              return <SelectItem key={month} value={month}>{month}</SelectItem>;
                            })}
                          </SelectContent>
                        </Select>
                        {formErrors.expiryMonth && <p className="text-sm text-destructive mt-1">{formErrors.expiryMonth}</p>}
                      </div>
                      <div>
                        <Label htmlFor="expiryYear">Year *</Label>
                        <Select
                          value={bookingData.expiryYear}
                          onValueChange={(value) => setBookingData({ ...bookingData, expiryYear: value })}
                        >
                          <SelectTrigger id="expiryYear" className={formErrors.expiryYear ? 'border-destructive' : ''}>
                            <SelectValue placeholder="YYYY" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => {
                              const year = (2026 + i).toString();
                              return <SelectItem key={year} value={year}>{year}</SelectItem>;
                            })}
                          </SelectContent>
                        </Select>
                        {formErrors.expiryYear && <p className="text-sm text-destructive mt-1">{formErrors.expiryYear}</p>}
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input
                          id="cvv"
                          type="password"
                          maxLength={4}
                          value={bookingData.cvv}
                          onChange={(e) => setBookingData({ ...bookingData, cvv: e.target.value.replace(/\D/g, '') })}
                          placeholder="123"
                          className={formErrors.cvv ? 'border-destructive' : ''}
                        />
                        {formErrors.cvv && <p className="text-sm text-destructive mt-1">{formErrors.cvv}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {error && (
                  <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/${userType}/category/${category}`)}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : `Complete Booking - $${totalPrice.toFixed(2)}`}
                  </Button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">{event.name}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="size-4" />
                        <span>{event.start_time.slice(0, 5)} - {event.end_time.slice(0, 5)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4" />
                        <span>{event.venue_name}, {event.city}, {event.state}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    {bookingData.ticketType && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>{bookingData.ticketType} × {bookingData.quantity}</span>
                          <span>${totalPrice.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>${totalPrice.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <Badge variant="secondary" className="w-full justify-center">
                    {getAvailableTicketCount()} tickets available
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}