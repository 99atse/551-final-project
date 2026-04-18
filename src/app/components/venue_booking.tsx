import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Building2, Mail, Phone, MapPin, Calendar, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

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

export function BookingVenue() {
  const { eventId, userType, category } = useParams<{
    eventId: string;
    userType: string;
    category: string;
  }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const [bookingData, setBookingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    affiliatedOrganization: '',

    address: '',
    city: '',
    state: '',
    zipcode: '',

    negotiatedPrice: '',

    paymentType: '',
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  useEffect(() => {
    const fetchEventData = async () => {
        try {
        setLoading(true)

        if (!eventId) {
            throw new Error('Missing event ID')
        }

        const eventRes = await fetch(`/api/events/${eventId}`)
        if (!eventRes.ok) throw new Error('Event not found')

        const eventData = await eventRes.json()
        setEvent(eventData)
        } catch (err: any) {
        setError(err.message || 'Failed to load event')
        } finally {
        setLoading(false)
        }
    }

    fetchEventData()
    }, [eventId])

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

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!bookingData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!bookingData.lastName.trim()) newErrors.lastName = 'Last name is required';

    if (!bookingData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!bookingData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!bookingData.address.trim()) newErrors.address = 'Address is required';
    if (!bookingData.city.trim()) newErrors.city = 'City is required';
    if (!bookingData.state.trim()) newErrors.state = 'State is required';
    if (!bookingData.zipcode.trim()) newErrors.zipcode = 'Zipcode is required';

    if (!bookingData.paymentType) newErrors.paymentType = 'Please select a payment method';

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

    if (
      bookingData.negotiatedPrice &&
      (isNaN(Number(bookingData.negotiatedPrice)) || Number(bookingData.negotiatedPrice) < 0)
    ) {
      newErrors.negotiatedPrice = 'Negotiated price must be a valid number';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const totalPrice = bookingData.negotiatedPrice
    ? Number(bookingData.negotiatedPrice)
    : Number(event?.base_rental_rate || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!event) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const bookingPayload = {
        event_id: event.event_id,
        venue_id: event.venue_id,
        name: `${bookingData.firstName} ${bookingData.lastName}`,
        contact_email: bookingData.email,
        contact_phone: bookingData.phone,
        address: `${bookingData.address}, ${bookingData.city}, ${bookingData.state} ${bookingData.zipcode}`,
        affiliated_organization: bookingData.affiliatedOrganization || null,
        negotiated_price: bookingData.negotiatedPrice ? Number(bookingData.negotiatedPrice) : null,
        payment_type: bookingData.paymentType,
        card_last_4: bookingData.cardNumber.replace(/\s/g, '').slice(-4),
        billing_address: `${bookingData.address}, ${bookingData.city}, ${bookingData.state} ${bookingData.zipcode}`,
      };

      const response = await fetch('/api/bookings/venue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Venue booking failed');
      }

      alert(
        `Venue booking submitted successfully!\n\nBooking #${result.venue_booking_id}\nTransaction #${result.transaction_id}`
      );

      navigate(`/${userType}/category/${category}`);
    } catch (err: any) {
      setError(err.message || 'Venue booking failed');
      alert(`Venue booking failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading event details...</div>;
  }

  if (error && !event) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Error</h2>
        <p className="mt-2 text-red-600">{error}</p>
        <Button className="mt-4" onClick={() => navigate(`/${userType}/categories`)}>
          Return to Categories
        </Button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Event Not Found</h2>
        <p className="mt-2 text-muted-foreground">The event you're looking for doesn't exist.</p>
        <Button className="mt-4" onClick={() => navigate(`/${userType}/categories`)}>
          Return to Categories
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate(`/${userType}/category/${category}`)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Book Venue</CardTitle>
              <CardDescription>
                Complete the form below to request this venue for your event.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Organizer Information</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter the primary contact for this venue booking.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={bookingData.firstName}
                        onChange={(e) => setBookingData({ ...bookingData, firstName: e.target.value })}
                        className={formErrors.firstName ? 'border-destructive' : ''}
                      />
                      {formErrors.firstName && <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={bookingData.lastName}
                        onChange={(e) => setBookingData({ ...bookingData, lastName: e.target.value })}
                        className={formErrors.lastName ? 'border-destructive' : ''}
                      />
                      {formErrors.lastName && <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                        placeholder="you@example.com"
                        className={formErrors.email ? 'border-destructive' : ''}
                      />
                      {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={bookingData.phone}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, phone: formatPhoneNumber(e.target.value) })
                        }
                        placeholder="(555) 123-4567"
                        className={formErrors.phone ? 'border-destructive' : ''}
                      />
                      {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      value={bookingData.affiliatedOrganization}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, affiliatedOrganization: e.target.value })
                      }
                      placeholder="Your company, school, or organization"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Billing Address</h3>
                  </div>

                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={bookingData.address}
                      onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })}
                      placeholder="123 Main St"
                      className={formErrors.address ? 'border-destructive' : ''}
                    />
                    {formErrors.address && <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>}
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={bookingData.city}
                        onChange={(e) => setBookingData({ ...bookingData, city: e.target.value })}
                        className={formErrors.city ? 'border-destructive' : ''}
                      />
                      {formErrors.city && <p className="mt-1 text-sm text-red-600">{formErrors.city}</p>}
                    </div>

                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={bookingData.state}
                        onChange={(e) => setBookingData({ ...bookingData, state: e.target.value })}
                        placeholder="CA"
                        className={formErrors.state ? 'border-destructive' : ''}
                      />
                      {formErrors.state && <p className="mt-1 text-sm text-red-600">{formErrors.state}</p>}
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
                      {formErrors.zipcode && <p className="mt-1 text-sm text-red-600">{formErrors.zipcode}</p>}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Booking Terms</h3>
                    <p className="text-sm text-muted-foreground">
                      Leave negotiated price blank to use the venue’s base rental rate.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="negotiatedPrice">Negotiated Price</Label>
                    <Input
                      id="negotiatedPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={bookingData.negotiatedPrice}
                      onChange={(e) => setBookingData({ ...bookingData, negotiatedPrice: e.target.value })}
                      placeholder={String(event.base_rental_rate)}
                      className={formErrors.negotiatedPrice ? 'border-destructive' : ''}
                    />
                    {formErrors.negotiatedPrice && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.negotiatedPrice}</p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Payment Information</h3>
                  </div>

                  <div>
                    <Label>Payment Method *</Label>
                    <Select
                      value={bookingData.paymentType}
                      onValueChange={(value) => setBookingData({ ...bookingData, paymentType: value })}
                    >
                      <SelectTrigger className={formErrors.paymentType ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="debit_card">Debit Card</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.paymentType && <p className="mt-1 text-sm text-red-600">{formErrors.paymentType}</p>}
                  </div>

                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      value={bookingData.cardNumber}
                      onChange={(e) =>
                        setBookingData({ ...bookingData, cardNumber: formatCardNumber(e.target.value) })
                      }
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className={formErrors.cardNumber ? 'border-destructive' : ''}
                    />
                    {formErrors.cardNumber && <p className="mt-1 text-sm text-red-600">{formErrors.cardNumber}</p>}
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
                    {formErrors.cardName && <p className="mt-1 text-sm text-red-600">{formErrors.cardName}</p>}
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <Label>Month *</Label>
                      <Select
                        value={bookingData.expiryMonth}
                        onValueChange={(value) => setBookingData({ ...bookingData, expiryMonth: value })}
                      >
                        <SelectTrigger className={formErrors.expiryMonth ? 'border-destructive' : ''}>
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = String(i + 1).padStart(2, '0');
                            return (
                              <SelectItem key={month} value={month}>
                                {month}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      {formErrors.expiryMonth && <p className="mt-1 text-sm text-red-600">{formErrors.expiryMonth}</p>}
                    </div>

                    <div>
                      <Label>Year *</Label>
                      <Select
                        value={bookingData.expiryYear}
                        onValueChange={(value) => setBookingData({ ...bookingData, expiryYear: value })}
                      >
                        <SelectTrigger className={formErrors.expiryYear ? 'border-destructive' : ''}>
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => {
                            const year = String(2026 + i);
                            return (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      {formErrors.expiryYear && <p className="mt-1 text-sm text-red-600">{formErrors.expiryYear}</p>}
                    </div>

                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        value={bookingData.cvv}
                        onChange={(e) =>
                          setBookingData({ ...bookingData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })
                        }
                        placeholder="123"
                        maxLength={4}
                        className={formErrors.cvv ? 'border-destructive' : ''}
                      />
                      {formErrors.cvv && <p className="mt-1 text-sm text-red-600">{formErrors.cvv}</p>}
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    disabled={isSubmitting}
                    onClick={() => navigate(`/${userType}/category/${category}`)}
                  >
                    Cancel
                  </Button>

                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : `Book Venue - $${totalPrice.toFixed(2)}`}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Venue Summary</CardTitle>
              <CardDescription>Review the event and venue details before booking.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">{event.name}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary">{event.type}</Badge>
                  <Badge variant="outline">{event.venue_type}</Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Calendar className="mt-0.5 h-4 w-4" />
                  <span>
                    {new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="mt-0.5 h-4 w-4" />
                  <span>
                    {event.start_time?.slice(0, 5)} - {event.end_time?.slice(0, 5)}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4" />
                  <span>
                    {event.venue_name}, {event.city}, {event.state}
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <Building2 className="mt-0.5 h-4 w-4" />
                  <span>Base rental rate: ${Number(event.base_rental_rate).toFixed(2)}</span>
                </div>

                <div className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4" />
                  <span>{event.contact_phone}</span>
                </div>

                <div className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4" />
                  <span>Venue contact: {event.contact_name}</span>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between font-medium">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}