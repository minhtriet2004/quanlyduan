# Database-Driven Seat Management System

## Overview
Implemented a complete database-driven seat management system where:
- Each seat has a unique ID from the database
- Booked seats are stored in the database
- Occupied seats are displayed dynamically based on database status
- Seat numbers are displayed to users (A1, A2, B1, etc.)
- Booking history shows actual seat numbers instead of counts

## Changes Made

### 1. Frontend: `/choose-seat.html`

#### What Changed
- **Removed**: Hardcoded HTML seat rows (7 rows of 8 seats each)
- **Added**: Dynamic seat rendering with database IDs
- **Added**: Display of seat numbers (A1, A2, etc.) on each seat
- **Added**: Color-coded seat display:
  - Available seats: blue background
  - Selected seats: green background
  - Booked seats (from DB): red background + disabled

#### Key Features
- Seats render dynamically from database using `loadSeatsFromDatabase()`
- Each seat has `data-id` attribute with database seat ID
- Each seat has `data-number` attribute with seat number (A1, B2, etc.)
- Seat display shows the seat number for easy identification
- Selected seats stored as objects: `{ id: 1, number: "A1" }`

#### Code Updates
```javascript
// Load seats from database
async function loadSeatsFromDatabase() {
    const response = await APIClient.getSeats(showingId);
    allSeats = response.data.seats || [];
    renderSeats();
}

// Render seats dynamically
function renderSeats() {
    // Groups seats by rows (8 seats per row)
    // Each seat gets data-id and data-number attributes
    // Occupied seats get .occupied class and are disabled
}

// Updated booking submission
seats: selectedSeats.map(s => s.id) // Use actual database IDs
```

### 2. Backend: `/api/bookings.php`

#### What Changed
- **Enhanced**: GET endpoint now returns seat numbers
- **Added**: Query to fetch seat_numbers from booking_items table for each booking

#### Code Update
```php
// For each booking, fetch associated seat numbers
$seats_query = "SELECT seat_number FROM booking_items WHERE booking_id = $booking_id";
$row['seat_numbers'] = $seat_numbers; // Array of seat numbers like ["A1", "A2", "B1"]
```

### 3. Frontend: `/bookings-history.html`

#### What Changed
- **Updated**: Display seat numbers instead of seat count
- **Updated**: Booking detail view shows actual seat numbers
- **Format**: Shows seat numbers as comma-separated list (e.g., "A1, A2, A3")

#### Code Updates
```html
<!-- Display seat numbers -->
<p><strong>Ghế:</strong> ${booking.seat_numbers.join(', ')}</p>

<!-- Or fallback to count if seats not available -->
${booking.seat_numbers ? booking.seat_numbers.join(', ') : booking.total_seats + ' ghế'}
```

### 4. Existing APIs (No Changes Needed)

These endpoints were already functional:
- **`/api/seats.php`** - Returns all seats for a showing with `is_booked` status
  - Query: `GET /api/seats.php?showing_id=1`
  - Returns: Array of seats with `id`, `seat_number`, `is_booked`, `showing_id`

- **`/api/bookings.php`** - Already handles seat booking with proper database updates
  - Creates booking_items for each seat
  - Updates `seats.is_booked = TRUE`
  - Cancellation updates `seats.is_booked = FALSE`

## Database Flow

### When User Books Seats:
1. Frontend fetches seats: `GET /api/seats.php?showing_id=1`
2. User selects seats (e.g., A1, A2, A3 with IDs 1, 2, 3)
3. Frontend submits booking with seat IDs: `[1, 2, 3]`
4. Backend creates:
   - `bookings` row (one per transaction)
   - `booking_items` rows (one per seat with seat_number)
   - Updates `seats.is_booked = TRUE`

### When Page Reloads:
1. Frontend calls `loadSeatsFromDatabase()`
2. Fetches all seats: `GET /api/seats.php?showing_id=1`
3. Renders seats with:
   - Available seats: no `.occupied` class
   - Booked seats: `.occupied` class, disabled

### When User Views Booking History:
1. Fetches bookings: `GET /api/bookings.php?user_id=1`
2. Backend includes seat_numbers array
3. Displays: "Ghế: A1, A2, A3"

### When User Cancels Booking:
1. Fetches booking_items for that booking
2. Updates `seats.is_booked = FALSE` for each seat
3. Next page load shows those seats as available

## Data Structure

### Seats Table
```
id: 1
showing_id: 1
seat_number: "A1"
is_booked: 0 (or 1 if booked)
```

### Bookings Table
```
id: 5
user_id: 1
showing_id: 1
movie_id: 3
total_seats: 3
total_price: 36000
status: "confirmed"
```

### Booking Items Table
```
id: 15
booking_id: 5
seat_id: 1
seat_number: "A1"
price: 12000
```

## User Experience Flow

```
Homepage
  ↓ (Click movie)
Movie Details
  ↓ (Select quantity: 3, Click "Đặt vé")
Choose Seat Page
  ├─ Loads all seats from database
  ├─ Shows booked seats as red/disabled
  ├─ User selects 3 available seats
  ├─ Shows "Bạn đã chọn 3 / 3 chỗ"
  └─ Click confirm
  ↓
Booking Confirmation
  ├─ Saves booking + 3 booking_items to DB
  ├─ Updates seats.is_booked = TRUE
  └─ Shows success notification
  ↓
Booking History
  ├─ Shows "Ghế: A1, A2, A3"
  ├─ Displays seat numbers instead of count
  └─ User can cancel or view details
```

## Benefits

✅ **Accurate Seat Tracking**: Database source of truth
✅ **Real-time Availability**: Booked seats immediately marked as occupied
✅ **User Friendly**: Shows actual seat numbers (A1, B2, etc.) instead of numbers
✅ **Data Integrity**: Proper foreign keys and cascading deletes
✅ **Scalability**: Can add more showings, each with own 100 seats
✅ **History**: Complete audit trail of bookings and seat allocations
✅ **Cancellation Support**: Properly frees up seats when booking cancelled

## Testing Checklist

- [ ] Homepage → Select movie → Movie shows in movie-details
- [ ] Movie details → Select quantity (3) → Seat page
- [ ] Seat page loads → Shows all seats with IDs
- [ ] Occupied seats show as red/disabled
- [ ] Click 3 available seats → Shows "Chọn 3/3"
- [ ] Confirm button enabled when 3 seats selected
- [ ] Click confirm → Booking saves to database
- [ ] Redirect to booking history
- [ ] Booking shows seat numbers "A1, A2, A3"
- [ ] Reload seat page → Previously booked seats marked as occupied
- [ ] Cancel booking → Seats freed up
- [ ] Reload seat page → Cancelled seats now available again
- [ ] View booking details → Shows seat numbers

## Files Modified

1. **`/choose-seat.html`**
   - Removed hardcoded seat HTML
   - Added `<div id="seatsContainer"></div>`
   - Refactored JavaScript to dynamically render seats
   - Updated booking submission to use seat IDs

2. **`/api/bookings.php`**
   - Enhanced GET endpoint to include seat numbers in response
   - Added query to fetch seat_number from booking_items

3. **`/bookings-history.html`**
   - Updated to display seat numbers
   - Changed from "Số ghế: 3" to "Ghế: A1, A2, A3"
   - Updated booking details modal

## No Changes Required

- `/api/seats.php` - Already returns proper data
- `/api/showings.php` - Already creates seats with unique IDs
- Database tables - Already have proper structure
- Booking API logic - Already handles seat IDs and updates correctly

## Future Enhancements

1. **Seat Layout Visualization**: Show visual theater layout
2. **Seat Preferences**: Filter by seat type (VIP, standard, etc.)
3. **Dynamic Pricing**: Different prices for different seat types
4. **Seat Map Legend**: Show which seats are which type
5. **Accessibility**: Keyboard navigation for seat selection
6. **Undo/Redo**: Allow users to modify selection
7. **Save for Later**: Save booking without paying

