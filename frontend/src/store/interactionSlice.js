import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const sendChatMessage = createAsyncThunk(
  'interaction/sendChatMessage',
  async ({ message, history }) => {
    const response = await axios.post(`${API_URL}/chat`, { message, history });
    return response.data;
  }
);

export const saveInteraction = createAsyncThunk(
  'interaction/saveInteraction',
  async (formData) => {
    const response = await axios.post(`${API_URL}/interactions`, formData);
    return response.data;
  }
);

const initialState = {
  chatHistory: [],
  formData: {
    hcp_name: '',
    specialty: '',
    discussion_topics: '',
    follow_up_date: '',
    notes: '',
    sentiment: 'Neutral'
  },
  status: 'idle',
  error: null
};

const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.formData[field] = value;
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.chatHistory = [];
    },
    addSystemMessage: (state, action) => {
      state.chatHistory.push({ role: 'ai', content: action.payload });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state, action) => {
        // Optimistically add user message
        const message = action.meta.arg.message;
        state.chatHistory.push({ role: 'user', content: message });
        state.status = 'loading';
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.chatHistory.push({ role: 'ai', content: action.payload.response });
        
        // Update form data if info was extracted
        if (action.payload.extracted_info) {
          Object.entries(action.payload.extracted_info).forEach(([key, value]) => {
            if (value && key in state.formData) {
              state.formData[key] = value;
            }
          });
        }
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.chatHistory.push({ role: 'ai', content: 'Error communicating with AI agent.' });
      })
      .addCase(saveInteraction.fulfilled, (state) => {
        state.formData = initialState.formData;
        state.chatHistory = [{ role: 'ai', content: 'Interaction saved successfully. You can start a new log.' }];
      });
  }
});

export const { updateFormField, resetForm, addSystemMessage } = interactionSlice.actions;
export default interactionSlice.reducer;
