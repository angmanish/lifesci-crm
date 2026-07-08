import { configureStore } from '@reduxjs/toolkit';
import interactionReducer from './interactionSlice';
import authReducer from './authSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    interaction: interactionReducer,
    auth: authReducer,
    theme: themeReducer,
  },
});
