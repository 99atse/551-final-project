import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Building2, User, Mail, Phone, MapPin, CheckCircle2, X, Pencil, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Venue {
  venue_id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  venue_type: string;
  base_rental_rate: number;
  max_capacity: number;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  rating: number;
}

interface UnbookedEvent {
  event_id: number;
  name: string;
  date: string;
}

interface BookingResult {
  venue_booking_id: number;
  transaction_id: number;
  negotiated_price: number;
  venueName: string;
  eventName: string;
}

// ── Confirmation Modal ────────────────────────────────────
function ConfirmationModal({ result, onEdit, onClose }: {
  result: BookingResult;
  onEdit: () => void;
  onClose: () => void;
}) {
  const WINDOW_SECONDS = 120;
  const [secondsLeft, setSecondsLeft] = useState(WINDOW_SECONDS);
  const [cancelling, setCancelling] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) { clearInterval(intervalRef.current!); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const withinWindow = secondsLeft > 0;
  const pct = (secondsLeft / WINDOW_SECONDS) * 100;

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await fetch(`/api/bookings/venue/${result.venue_booking_id}/cancel`, { method: 'PATCH' });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || 'Cancel failed'); }
      setCancelled(true);
    } catch (err: any) {
      alert(`Cancel failed: ${err.message}`);
    } finally {
      setCancelling(false);
    }
  };

  if (cancelled) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Booking Cancelled</CardTitle>
            <CardDescription>Booking #{result.venue_booking_id} has been cancelled and the venue has been released.</CardDescription>
          </CardHeader>
          <CardContent><Button className="w-full" onClick={onClose}>Close</Button></CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <Card className="max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <CheckCircle2 className="size-12 text-green-500 mx-auto mb-2" />
          <CardTitle>Venue Booking Submitted!</CardTitle>
          <CardDescription>Booking #{result.venue_booking_id} · Transaction #{result.transaction_id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Event</span>
              <span className="font-medium">{result.eventName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Venue</span>
              <span>{result.venueName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="secondary">Pending confirmation</Badge>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Agreed price</span>
              <span>${Number(result.negotiated_price).toLocaleString()}</span>
            </div>
          </div>

          {withinWindow ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Edit/cancel window closes in</span>
                <span className={`font-medium tabular-nums ${secondsLeft <= 30 ? 'text-destructive' : ''}`}>{timeStr}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${secondsLeft <= 30 ? 'bg-destructive' : 'bg-green-500'}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center">The edit/cancel window has closed.</p>
          )}

          <div className="space-y-2">
            {withinWindow && (
              <>
                <Button variant="outline" className="w-full flex items-center gap-2" onClick={onEdit}>
                  <Pencil className="size-4" />Edit Booking
                </Button>
                <Button variant="outline" className="w-full flex items-center gap-2 text-destructive border-destructive hover:bg-destructive/10" onClick={handleCancel} disabled={cancelling}>
                  <Trash2 className="size-4" />{cancelling ? 'Cancelling...' : 'Cancel Booking'}
                </Button>
              </>
            )}
            <Button className="w-full flex items-center gap-2" onClick={onClose}>
              <X className="size-4" />Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────
export function BookingVenue() {
  const { venueId, userType, category } = useParams<{
    venueId: string;
    userType: string;
    category: string;
  }>();
  const navigate = useNavigate();

  const [venue, setVenue] = useState<Venue | null>(null);
  const [unbookedEvents, setUnbookedEvents] = useState<UnbookedEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

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
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!venueId) throw new Error('Missing venue ID');

        const venueRes = await fetch(`/api/venues/${venueId}`);
        if (!venueRes.ok) throw new Error('Venue not found');
        setVenue(await venueRes.json());

        const eventsRes = await fetch('/api/events/unbooked');
        if (eventsRes.ok) setUnbookedEvents(await eventsRes.json());

      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [venueId]);

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
    if (!selectedEventId) newErrors.selectedEventId = 'Please select an event to link this venue to';
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
    if (bookingData.negotiatedPrice && (isNaN(Number(bookingData.negotiatedPrice)) || Number(bookingData.negotiatedPrice) < 0)) {
      newErrors.negotiatedPrice = 'Negotiated price must be a valid number';
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const totalPrice = bookingData.negotiatedPrice
    ? Number(bookingData.negotiatedPrice)
    : Number(venue?.base_rental_rate || 0);

  const selectedEvent = unbookedEvents.find(e => String(e.event_id) === selectedEventId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venue || !validateForm()) return;
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/bookings/venue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: parseInt(selectedEventId),
          venue_id: venue.venue_id,
          name: `${bookingData.firstName} ${bookingData.lastName}`,
          contact_email: bookingData.email,
          contact_phone: bookingData.phone,
          address: `${bookingData.address}, ${bookingData.city}, ${bookingData.state} ${bookingData.zipcode}`,
          affiliated_organization: bookingData.affiliatedOrganization || null,
          negotiated_price: bookingData.negotiatedPrice ? Number(bookingData.negotiatedPrice) : null,
          payment_type: bookingData.paymentType,
          card_last_4: bookingData.cardNumber.replace(/\s/g, '').slice(-4),
          billing_address: `${bookingData.address}, ${bookingData.city}, ${bookingData.state} ${bookingData.zipcode}`,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Venue booking failed');

      setBookingResult({
        venue_booking_id: result.venue_booking_id,
        transaction_id: result.transaction_id,
        negotiated_price: result.negotiated_price,
        venueName: venue.name,
        eventName: selectedEvent?.name || '',
      });
    } catch (err: any) {
      setError(err.message || 'Booking failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => { setBookingResult(null); setError(''); };
  const handleClose = () => navigate(`/${userType}/category/${category}`);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6"><p className="text-center">Loading venue details...</p></CardContent>
        </Card>
      </div>
    );
  }

  if (error && !venue) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader><CardTitle>Error</CardTitle><CardDescription>{error}</CardDescription></CardHeader>
          <CardContent><Button onClick={() => navigate(`/${userType}/categories`)}>Return to Categories</Button></CardContent>
        </Card>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader><CardTitle>Venue Not Found</CardTitle><CardDescription>The venue you're looking for doesn't exist.</CardDescription></CardHeader>
          <CardContent><Button onClick={() => navigate(`/${userType}/categories`)}>Return to Categories</Button></CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {bookingResult && <ConfirmationModal result={bookingResult} onEdit={handleEdit} onClose={handleClose} />}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <Link to={`/${userType}/category/${category}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="size-4" />Back to Venues
          </Link>

          <div className="mb-8">
            <h1 className="mb-2">Book Venue</h1>
            <p className="text-muted-foreground">Complete the form below to request this venue for your event</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Event Selection
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="size-5" />Link to Event
                    </CardTitle>
                    <CardDescription>Select which event you are booking this venue for</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Label htmlFor="selectedEvent">Event *</Label>
                    <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                      <SelectTrigger id="selectedEvent" className={formErrors.selectedEventId ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Choose an event..." />
                      </SelectTrigger>
                      <SelectContent>
                        {unbookedEvents.length === 0 ? (
                          <SelectItem value="none" disabled>No unbooked events available</SelectItem>
                        ) : (
                          unbookedEvents.map(e => (
                            <SelectItem key={e.event_id} value={String(e.event_id)}>
                              {e.name} — {new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {formErrors.selectedEventId && <p className="text-sm text-destructive mt-1">{formErrors.selectedEventId}</p>}
                  </CardContent>
                </Card> */}

                {/* Organizer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User className="size-5" />Organizer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" value={bookingData.firstName} onChange={(e) => setBookingData({ ...bookingData, firstName: e.target.value })} className={formErrors.firstName ? 'border-destructive' : ''} />
                        {formErrors.firstName && <p className="text-sm text-destructive mt-1">{formErrors.firstName}</p>}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" value={bookingData.lastName} onChange={(e) => setBookingData({ ...bookingData, lastName: e.target.value })} className={formErrors.lastName ? 'border-destructive' : ''} />
                        {formErrors.lastName && <p className="text-sm text-destructive mt-1">{formErrors.lastName}</p>}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input id="email" type="email" className={`pl-10 ${formErrors.email ? 'border-destructive' : ''}`} value={bookingData.email} onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })} placeholder="you@example.com" />
                      </div>
                      {formErrors.email && <p className="text-sm text-destructive mt-1">{formErrors.email}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input id="phone" type="tel" className={`pl-10 ${formErrors.phone ? 'border-destructive' : ''}`} value={bookingData.phone} onChange={(e) => setBookingData({ ...bookingData, phone: formatPhoneNumber(e.target.value) })} placeholder="(555) 123-4567" />
                      </div>
                      {formErrors.phone && <p className="text-sm text-destructive mt-1">{formErrors.phone}</p>}
                    </div>
                    <div>
                      <Label htmlFor="organization">Organization</Label>
                      <Input id="organization" value={bookingData.affiliatedOrganization} onChange={(e) => setBookingData({ ...bookingData, affiliatedOrganization: e.target.value })} placeholder="Your company, school, or organization" />
                    </div>
                  </CardContent>
                </Card>

                {/* Billing Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><MapPin className="size-5" />Billing Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Input id="address" value={bookingData.address} onChange={(e) => setBookingData({ ...bookingData, address: e.target.value })} placeholder="123 Main St" className={formErrors.address ? 'border-destructive' : ''} />
                      {formErrors.address && <p className="text-sm text-destructive mt-1">{formErrors.address}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" value={bookingData.city} onChange={(e) => setBookingData({ ...bookingData, city: e.target.value })} className={formErrors.city ? 'border-destructive' : ''} />
                        {formErrors.city && <p className="text-sm text-destructive mt-1">{formErrors.city}</p>}
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input id="state" value={bookingData.state} onChange={(e) => setBookingData({ ...bookingData, state: e.target.value })} placeholder="CA" className={formErrors.state ? 'border-destructive' : ''} />
                        {formErrors.state && <p className="text-sm text-destructive mt-1">{formErrors.state}</p>}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="zipcode">Zipcode *</Label>
                      <Input id="zipcode" value={bookingData.zipcode} onChange={(e) => setBookingData({ ...bookingData, zipcode: e.target.value })} placeholder="12345" className={formErrors.zipcode ? 'border-destructive' : ''} />
                      {formErrors.zipcode && <p className="text-sm text-destructive mt-1">{formErrors.zipcode}</p>}
                    </div>
                  </CardContent>
                </Card>

                {/* Booking Terms */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Building2 className="size-5" />Booking Terms</CardTitle>
                    <CardDescription>Leave blank to use the base rental rate of ${Number(venue.base_rental_rate).toLocaleString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Label htmlFor="negotiatedPrice">Negotiated Price ($)</Label>
                    <Input id="negotiatedPrice" type="number" min="0" step="0.01" value={bookingData.negotiatedPrice} onChange={(e) => setBookingData({ ...bookingData, negotiatedPrice: e.target.value })} placeholder={String(venue.base_rental_rate)} className={formErrors.negotiatedPrice ? 'border-destructive' : ''} />
                    {formErrors.negotiatedPrice && <p className="text-sm text-destructive mt-1">{formErrors.negotiatedPrice}</p>}
                  </CardContent>
                </Card>

                {/* Payment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CreditCard className="size-5" />Payment Information</CardTitle>
                    <Label>Payment Method *</Label>
                    <Select value={bookingData.paymentType} onValueChange={(value) => setBookingData(prev => ({ ...prev, paymentType: value }))}>
                      <SelectTrigger className={formErrors.paymentType ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="debit_card">Debit Card</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.paymentType && <p className="text-sm text-destructive mt-1">{formErrors.paymentType}</p>}
                    <CardDescription>Enter your payment details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number *</Label>
                      <Input id="cardNumber" value={bookingData.cardNumber} onChange={(e) => setBookingData({ ...bookingData, cardNumber: formatCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16)) })} placeholder="1234 5678 9012 3456" maxLength={19} className={formErrors.cardNumber ? 'border-destructive' : ''} />
                      {formErrors.cardNumber && <p className="text-sm text-destructive mt-1">{formErrors.cardNumber}</p>}
                    </div>
                    <div>
                      <Label htmlFor="cardName">Cardholder Name *</Label>
                      <Input id="cardName" value={bookingData.cardName} onChange={(e) => setBookingData({ ...bookingData, cardName: e.target.value })} placeholder="John Smith" className={formErrors.cardName ? 'border-destructive' : ''} />
                      {formErrors.cardName && <p className="text-sm text-destructive mt-1">{formErrors.cardName}</p>}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="expiryMonth">Month *</Label>
                        <Select value={bookingData.expiryMonth} onValueChange={(value) => setBookingData({ ...bookingData, expiryMonth: value })}>
                          <SelectTrigger id="expiryMonth" className={formErrors.expiryMonth ? 'border-destructive' : ''}><SelectValue placeholder="MM" /></SelectTrigger>
                          <SelectContent>{Array.from({ length: 12 }, (_, i) => { const m = (i + 1).toString().padStart(2, '0'); return <SelectItem key={m} value={m}>{m}</SelectItem>; })}</SelectContent>
                        </Select>
                        {formErrors.expiryMonth && <p className="text-sm text-destructive mt-1">{formErrors.expiryMonth}</p>}
                      </div>
                      <div>
                        <Label htmlFor="expiryYear">Year *</Label>
                        <Select value={bookingData.expiryYear} onValueChange={(value) => setBookingData({ ...bookingData, expiryYear: value })}>
                          <SelectTrigger id="expiryYear" className={formErrors.expiryYear ? 'border-destructive' : ''}><SelectValue placeholder="YYYY" /></SelectTrigger>
                          <SelectContent>{Array.from({ length: 10 }, (_, i) => { const y = (2026 + i).toString(); return <SelectItem key={y} value={y}>{y}</SelectItem>; })}</SelectContent>
                        </Select>
                        {formErrors.expiryYear && <p className="text-sm text-destructive mt-1">{formErrors.expiryYear}</p>}
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV *</Label>
                        <Input id="cvv" type="password" maxLength={4} value={bookingData.cvv} onChange={(e) => setBookingData({ ...bookingData, cvv: e.target.value.replace(/\D/g, '') })} placeholder="123" className={formErrors.cvv ? 'border-destructive' : ''} />
                        {formErrors.cvv && <p className="text-sm text-destructive mt-1">{formErrors.cvv}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {error && (
                  <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">{error}</div>
                )}

                <div className="flex gap-4">
                  <Button type="button" variant="outline" onClick={() => navigate(`/${userType}/category/${category}`)} className="flex-1" disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? 'Processing...' : `Book Venue - $${totalPrice.toLocaleString()}`}
                  </Button>
                </div>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader><CardTitle>Venue Summary</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">{venue.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{venue.city}, {venue.state}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline">{venue.venue_type}</Badge>
                      {venue.rating && <Badge variant="secondary">⭐ {Number(venue.rating).toFixed(1)}</Badge>}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2"><Phone className="size-3" /><span>{venue.contact_phone}</span></div>
                      <div className="flex items-center gap-2"><Mail className="size-3" /><span>{venue.contact_name}</span></div>
                    </div>
                  </div>

                  {selectedEvent && (
                    <>
                      <Separator />
                      <div className="text-sm">
                        <p className="text-muted-foreground mb-1">Linked event</p>
                        <p className="font-medium">{selectedEvent.name}</p>
                        <p className="text-muted-foreground">{new Date(selectedEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </>
                  )}

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base rental rate</span>
                      <span>${Number(venue.base_rental_rate).toLocaleString()}</span>
                    </div>
                    {bookingData.negotiatedPrice && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Negotiated price</span>
                        <span>${Number(bookingData.negotiatedPrice).toLocaleString()}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}