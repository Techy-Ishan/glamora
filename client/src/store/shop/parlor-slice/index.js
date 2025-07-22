import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  parlorList: [],
  selectedParlor: null,
  appointments: [],
  customerAppointments: [],
  selectedAppointment: null,
};

// Public Actions (Customer browsing)
export const fetchActiveParlors = createAsyncThunk(
  "/shop/parlors/fetchActive",
  async () => {
    const response = await axios.get(
      "http://localhost:5000/api/shop/appointments/parlors"
    );
    return response.data;
  }
);

export const searchParlors = createAsyncThunk(
  "/shop/parlors/search",
  async (searchParams) => {
    const queryString = new URLSearchParams(searchParams).toString();
    const response = await axios.get(
      `http://localhost:5000/api/shop/appointments/parlors/search?${queryString}`
    );
    return response.data;
  }
);

// Appointment Actions
export const createAppointment = createAsyncThunk(
  "/shop/appointments/create",
  async (appointmentData) => {
    const response = await axios.post(
      "http://localhost:5000/api/shop/appointments/book",
      appointmentData,
      { withCredentials: true }
    );
    return response.data;
  }
);

export const fetchCustomerAppointments = createAsyncThunk(
  "/shop/appointments/fetchCustomer",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Redux: Fetching customer appointments");
      const response = await axios.get(
        `http://localhost:5000/api/shop/appointments/my-appointments`,
        { withCredentials: true }
      );
      console.log("Redux: Customer appointments response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Redux: Customer appointments error:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  "/shop/appointments/cancel",
  async (appointmentId, { getState }) => {
    const { auth } = getState();
    const response = await axios.put(
      `http://localhost:5000/api/shop/appointments/cancel/${appointmentId}`,
      { customerId: auth.user.id },
      { withCredentials: true }
    );
    return response.data;
  }
);

export const fetchAppointmentDetails = createAsyncThunk(
  "/shop/appointments/fetchDetails",
  async (appointmentId) => {
    const response = await axios.get(
      `http://localhost:5000/api/shop/appointments/details/${appointmentId}`
    );
    return response.data;
  }
);

const shopParlorSlice = createSlice({
  name: "shopParlors",
  initialState,
  reducers: {
    resetSelectedParlor: (state) => {
      state.selectedParlor = null;
    },
    resetSelectedAppointment: (state) => {
      state.selectedAppointment = null;
    },
    setSelectedParlor: (state, action) => {
      state.selectedParlor = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveParlors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchActiveParlors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.parlorList = action.payload.data;
      })
      .addCase(fetchActiveParlors.rejected, (state) => {
        state.isLoading = false;
        state.parlorList = [];
      })
      .addCase(searchParlors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchParlors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.parlorList = action.payload.data;
      })
      .addCase(searchParlors.rejected, (state) => {
        state.isLoading = false;
        state.parlorList = [];
      })
      .addCase(createAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add the new appointment to the customer appointments list
        if (action.payload.data) {
          state.customerAppointments.unshift(action.payload.data);
        }
      })
      .addCase(createAppointment.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchCustomerAppointments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCustomerAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customerAppointments = action.payload.data;
      })
      .addCase(fetchCustomerAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.customerAppointments = [];
        console.error("Customer appointments fetch rejected:", action.payload);
      })
      .addCase(cancelAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.customerAppointments.findIndex(
          (apt) => apt._id === action.payload.data._id
        );
        if (index !== -1) {
          state.customerAppointments[index] = action.payload.data;
        }
      })
      .addCase(cancelAppointment.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAppointmentDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAppointmentDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedAppointment = action.payload.data;
      })
      .addCase(fetchAppointmentDetails.rejected, (state) => {
        state.isLoading = false;
        state.selectedAppointment = null;
      });
  },
});

export const {
  resetSelectedParlor,
  resetSelectedAppointment,
  setSelectedParlor,
} = shopParlorSlice.actions;
export default shopParlorSlice.reducer;
