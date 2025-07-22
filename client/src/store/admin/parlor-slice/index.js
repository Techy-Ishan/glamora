import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  parlorList: [],
  userList: [],
  selectedParlor: null,
  parlorOwnerAppointments: [],
  myParlor: null, // For parlor owner's own parlor data
};

// Admin Actions
export const createParlor = createAsyncThunk(
  "/admin/parlors/create",
  async (parlorData, { rejectWithValue }) => {
    try {
      console.log("Making API call with data:", parlorData);
      const response = await axios.post(
        "http://localhost:5000/api/admin/parlors/create",
        parlorData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

export const fetchAllParlors = createAsyncThunk(
  "/admin/parlors/fetchAll",
  async () => {
    const response = await axios.get(
      "http://localhost:5000/api/admin/parlors/get"
    );
    return response.data;
  }
);

export const fetchParlorById = createAsyncThunk(
  "/admin/parlors/fetchById",
  async (id) => {
    const response = await axios.get(
      `http://localhost:5000/api/admin/parlors/get/${id}`
    );
    return response.data;
  }
);

export const updateParlor = createAsyncThunk(
  "/admin/parlors/update",
  async ({ id, parlorData }) => {
    const response = await axios.put(
      `http://localhost:5000/api/admin/parlors/update/${id}`,
      parlorData
    );
    return response.data;
  }
);

export const deleteParlor = createAsyncThunk(
  "/admin/parlors/delete",
  async (id) => {
    const response = await axios.delete(
      `http://localhost:5000/api/admin/parlors/delete/${id}`
    );
    return response.data;
  }
);

export const fetchAllUsers = createAsyncThunk(
  "/admin/parlors/fetchUsers",
  async () => {
    const response = await axios.get(
      "http://localhost:5000/api/admin/parlors/users"
    );
    return response.data;
  }
);

// Parlor Owner Actions
export const fetchParlorOwnerAppointments = createAsyncThunk(
  "/admin/parlors/fetchOwnerAppointments",
  async (_, { getState }) => {
    const { auth } = getState();
    const response = await axios.get(
      `http://localhost:5000/api/shop/appointments/parlor-owner/${auth.user.id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  "/admin/parlors/updateAppointmentStatus",
  async ({ appointmentId, status }) => {
    const response = await axios.put(
      `http://localhost:5000/api/shop/appointments/update-status/${appointmentId}`,
      { status },
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

// Parlor Owner Management Actions
export const fetchMyParlor = createAsyncThunk(
  "adminParlors/fetchMyParlor",
  async (_, { getState }) => {
    const { user } = getState().auth;
    const response = await axios.get(
      `http://localhost:5000/api/admin/parlors/my-parlor/${user.id}`,
      { withCredentials: true }
    );
    return response.data;
  }
);

export const updateMyParlor = createAsyncThunk(
  "/admin/parlors/updateMyParlor",
  async (parlorData, { getState }) => {
    const { auth } = getState();
    const response = await axios.put(
      `http://localhost:5000/api/admin/parlors/my-parlor/${auth.user.id}`,
      parlorData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const addParlorService = createAsyncThunk(
  "adminParlors/addParlorService",
  async ({ parlorId, serviceData }) => {
    const response = await axios.post(
      `http://localhost:5000/api/admin/parlors/my-parlor/${parlorId}/services`,
      serviceData,
      { withCredentials: true }
    );
    return response.data;
  }
);

export const updateParlorService = createAsyncThunk(
  "adminParlors/updateParlorService",
  async ({ parlorId, serviceId, serviceData }) => {
    const response = await axios.put(
      `http://localhost:5000/api/admin/parlors/my-parlor/${parlorId}/services/${serviceId}`,
      serviceData,
      { withCredentials: true }
    );
    return response.data;
  }
);

export const deleteParlorService = createAsyncThunk(
  "adminParlors/deleteParlorService",
  async ({ parlorId, serviceId }) => {
    const response = await axios.delete(
      `http://localhost:5000/api/admin/parlors/my-parlor/${parlorId}/services/${serviceId}`,
      { withCredentials: true }
    );
    return response.data;
  }
);

export const updateParlorImages = createAsyncThunk(
  "adminParlors/updateParlorImages",
  async ({ parlorId, images }) => {
    const response = await axios.put(
      `http://localhost:5000/api/admin/parlors/my-parlor/${parlorId}/images`,
      { images },
      { withCredentials: true }
    );
    return response.data;
  }
);

const adminParlorSlice = createSlice({
  name: "adminParlors",
  initialState,
  reducers: {
    resetSelectedParlor: (state) => {
      state.selectedParlor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createParlor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createParlor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.parlorList.push(action.payload.data);
      })
      .addCase(createParlor.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAllParlors.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllParlors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.parlorList = action.payload.data;
      })
      .addCase(fetchAllParlors.rejected, (state) => {
        state.isLoading = false;
        state.parlorList = [];
      })
      .addCase(fetchParlorById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchParlorById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedParlor = action.payload.data;
      })
      .addCase(fetchParlorById.rejected, (state) => {
        state.isLoading = false;
        state.selectedParlor = null;
      })
      .addCase(updateParlor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateParlor.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.parlorList.findIndex(
          (parlor) => parlor._id === action.payload.data._id
        );
        if (index !== -1) {
          state.parlorList[index] = action.payload.data;
        }
      })
      .addCase(updateParlor.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteParlor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteParlor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.parlorList = state.parlorList.filter(
          (parlor) => parlor._id !== action.meta.arg
        );
      })
      .addCase(deleteParlor.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userList = action.payload.data;
      })
      .addCase(fetchAllUsers.rejected, (state) => {
        state.isLoading = false;
        state.userList = [];
      })
      .addCase(fetchParlorOwnerAppointments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchParlorOwnerAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.parlorOwnerAppointments = action.payload.data;
      })
      .addCase(fetchParlorOwnerAppointments.rejected, (state) => {
        state.isLoading = false;
        state.parlorOwnerAppointments = [];
      })
      .addCase(updateAppointmentStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.parlorOwnerAppointments.findIndex(
          (appointment) => appointment._id === action.payload.data._id
        );
        if (index !== -1) {
          state.parlorOwnerAppointments[index] = action.payload.data;
        }
      })
      .addCase(updateAppointmentStatus.rejected, (state) => {
        state.isLoading = false;
      })
      // Parlor Owner Management Cases
      .addCase(fetchMyParlor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMyParlor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myParlor = action.payload.data;
      })
      .addCase(fetchMyParlor.rejected, (state) => {
        state.isLoading = false;
        state.myParlor = null;
      })
      .addCase(updateMyParlor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMyParlor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myParlor = action.payload.data;
      })
      .addCase(updateMyParlor.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(addParlorService.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addParlorService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myParlor = action.payload.data;
      })
      .addCase(addParlorService.rejected, (state, action) => {
        console.log("addParlorService rejected - error:", action.error);
        console.log("addParlorService rejected - payload:", action.payload);
        state.isLoading = false;
      })
      .addCase(updateParlorService.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateParlorService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myParlor = action.payload.data;
      })
      .addCase(updateParlorService.rejected, (state, action) => {
        console.log("updateParlorService rejected - error:", action.error);
        console.log("updateParlorService rejected - payload:", action.payload);
        state.isLoading = false;
      })
      .addCase(deleteParlorService.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteParlorService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myParlor = action.payload.data;
      })
      .addCase(deleteParlorService.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updateParlorImages.fulfilled, (state, action) => {
        state.myParlor = action.payload.data;
      });
  },
});

export const { resetSelectedParlor } = adminParlorSlice.actions;
export default adminParlorSlice.reducer;
