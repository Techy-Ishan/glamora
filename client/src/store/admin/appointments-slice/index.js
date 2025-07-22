import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  allAppointments: [],
};

export const fetchAllAppointments = createAsyncThunk(
  "/admin/appointments/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Redux: Fetching all appointments");
      const response = await axios.get(
        "http://localhost:5000/api/admin/appointments/all",
        {
          withCredentials: true,
        }
      );
      console.log("Redux: Admin appointments response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Redux: Admin appointments error:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const adminAppointmentsSlice = createSlice({
  name: "adminAppointments",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAppointments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allAppointments = action.payload.data;
      })
      .addCase(fetchAllAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.allAppointments = [];
        console.error("Admin appointments fetch rejected:", action.payload);
      });
  },
});

export default adminAppointmentsSlice.reducer;
