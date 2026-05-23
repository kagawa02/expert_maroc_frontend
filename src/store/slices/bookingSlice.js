import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    bookings: [],
    loading: false,
    error: null,
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        setBookings: (state, action) => {
            state.bookings = action.payload;
        },
        updateBookingStatus: (state, action) => {
            const index = state.bookings.findIndex(b => b.id === action.payload.id);
            if (index !== -1) {
                state.bookings[index].status = action.payload.status;
            }
        },
    },
});

export const { setBookings, updateBookingStatus } = bookingSlice.actions;
export default bookingSlice.reducer;
