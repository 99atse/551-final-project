import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

interface VenueAvailabilityButtonProps {
  eventId: number
  venueId: number
  userType: string
  category?: string
}

export function VenueAvailabilityButton({
  eventId,
  venueId,
  userType,
  category,
}: VenueAvailabilityButtonProps) {
  const [checking, setChecking] = useState(true)
  const [available, setAvailable] = useState<boolean | null>(null)
  const [reason, setReason] = useState('')

  useEffect(() => {
    async function checkAvailability() {
      try {
        const res = await fetch(`/api/venues/${venueId}/availability?eventId=${eventId}`)
        const data = await res.json()
        setAvailable(data.available)
        setReason(data.reason || '')
      } catch (err) {
        console.error('Error checking venue availability:', err)
        setAvailable(null)
      } finally {
        setChecking(false)
      }
    }

    checkAvailability()
  }, [eventId, venueId])

  if (checking) {
    return (
      <div className="text-sm text-muted-foreground text-center py-2 flex items-center justify-center gap-2">
        <Loader2 className="size-4 animate-spin" />
        Checking venue availability...
      </div>
    )
  }

  if (available === null) {
    return (
      <div className="text-sm text-muted-foreground text-center py-2 bg-muted rounded">
        Unable to check availability
      </div>
    )
  }

  if (available) {
    return (
      <div className="flex items-center justify-between">
        <div className="text-sm flex items-center gap-2">
          <CheckCircle2 className="size-4 text-green-500" />
          <span className="text-green-700 font-medium">Venue Available</span>
        </div>
        <Button asChild>
          <Link to={`/${userType}/category/${category}/book-venue/${eventId}`}>
            Book Venue
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="text-sm bg-muted rounded p-3 flex items-center gap-2">
      <XCircle className="size-4 text-destructive shrink-0" />
      <div>
        <p className="font-medium text-destructive">Venue Not Available</p>
        {reason && <p className="text-xs text-muted-foreground mt-1">{reason}</p>}
      </div>
    </div>
  )
}