# Quick Reference: Seat Management System

## 🎯 What Changed

### Before (Hardcoded)
```html
<!-- Hardcoded 7 rows with some .occupied -->
<div class="row">
    <div class="seat"></div>
    <div class="seat occupied"></div>
    <div class="seat occupied"></div>
    ...
</div>
```
→ Booking showed: **"3 ghế"** (just a count)

### After (Database-Driven)
```html
<!-- Dynamic - loaded from database -->
<div id="seatsContainer"></div>
```
```javascript
loadSeatsFromDatabase() → /api/seats.php?showing_id=1
↓
Renders 48 seats with IDs and numbers
↓
Marks seats as .occupied based on is_booked status
```
→ Booking shows: **"Ghế: A1, A2, A3"** (specific seats)

## 🔧 3 Core Changes

### 1️⃣ `choose-seat.html` - Render Seats from Database
```javascript
// Load seats when page loads
async function loadSeatsFromDatabase() {
    const response = await APIClient.getSeats(showingId);
    allSeats = response.data.seats; // Array of seats from DB
    renderSeats();
}

// Render them dynamically
function renderSeats() {
    // Creates <div class="seat" data-id="1" data-number="A1">A1</div>
    // Booked seats get .occupied class and disabled
}

// Select seats
function setupSeatSelection() {
    // User clicks seats
    // selectedSeats = [{id: 1, number: "A1"}, {id: 2, number: "A2"}, ...]
}

// Submit booking with real IDs
async function confirmBooking() {
    seats: selectedSeats.map(s => s.id) // [1, 2, 3]
}
```

### 2️⃣ `/api/bookings.php` - Include Seat Numbers
```php
// When getting bookings, also fetch seat numbers
$seats_query = "SELECT seat_number FROM booking_items WHERE booking_id = $booking_id";
$row['seat_numbers'] = $seat_numbers; // ["A1", "A2", "A3"]
```

### 3️⃣ `bookings-history.html` - Display Seat Numbers
```html
<!-- Show actual seat numbers instead of count -->
<p><strong>Ghế:</strong> ${booking.seat_numbers.join(', ')}</p>
<!-- Output: "Ghế: A1, A2, A3" -->
```

## 📊 Data Flow

```
Database Seats Table
├─ id: 1, seat_number: "A1", is_booked: false ✓ Available
├─ id: 2, seat_number: "A2", is_booked: false ✓ Available  
├─ id: 3, seat_number: "A3", is_booked: true  ✗ Booked
└─ ...

↓ GET /api/seats.php?showing_id=1

Frontend Receives
├─ { id: 1, seat_number: "A1", is_booked: false }
├─ { id: 2, seat_number: "A2", is_booked: false }
├─ { id: 3, seat_number: "A3", is_booked: true }
└─ ...

↓ renderSeats()

User Sees
├─ A1 (blue, clickable)
├─ A2 (blue, clickable)
├─ A3 (red, disabled)
└─ ...

User Selects: A1, A2, A4

↓ POST /api/bookings.php { seats: [1, 2, 4] }

Backend Creates
├─ bookings record (1 row)
├─ booking_items: [seat_id: 1, seat_id: 2, seat_id: 4] (3 rows)
└─ Updates seats: is_booked = true for IDs 1, 2, 4

↓ GET /api/bookings.php?user_id=1

Booking History Shows
└─ Ghế: A1, A2, A4 ✓
```

## 🧪 How to Test

### Step 1: Load Seat Page
- Check console - should see seats loading from database
- Verify: Some seats red (occupied), some blue (available)

### Step 2: Select Seats
- Click 3 available blue seats
- Verify: "Bạn đã chọn 3 / 3 chỗ"
- Confirm button enabled

### Step 3: Book Seats
- Click "XÁC NHẬN ĐẶT VÉ"
- Should see success message
- Redirects to booking history

### Step 4: Check History
- Should see "Ghế: A1, A2, A3" (or whatever you selected)
- NOT "Số ghế: 3"

### Step 5: Reload Seat Page
- Click back to choose-seat
- Selected seats now shown as red (occupied)

### Step 6: Cancel Booking
- Go to booking history
- Click "Hủy đặt vé"
- Confirm cancellation

### Step 7: Reload Seat Page Again
- Those seats now available again (blue)

## 📁 Files Modified

```
choose-seat.html          ← Dynamic seat rendering
bookings-history.html     ← Show seat numbers
api/bookings.php          ← Include seat numbers in response
```

## ✅ Validation

No errors found in:
- ✓ HTML syntax
- ✓ JavaScript syntax
- ✓ PHP syntax

Ready to test! 🚀

## 🔍 Key Points

1. **Each seat has unique ID** from database
2. **Booked status stored in database** - not hardcoded
3. **Seat numbers displayed** - A1, A2, B1 format
4. **Booking shows specific seats** - not just count
5. **Page reload shows correct status** - always from database
6. **Cancel frees up seats** - database updated correctly

