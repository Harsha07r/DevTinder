import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    feed: []   // ✅ proper shape
  },
  reducers: {
    setFeed: (state, action) => {
      state.feed = action.payload;
    },
    clearFeed: (state) => {
      state.feed = [];
    },
    //this is used to remove the user that we have sent request to,so now we will not see that user card in feed page 
    removeFromFeed:(state,action)=>{
      state.feed=state.feed.filter(user=>user._id!=action.payload);
    }
  }
});

export const { setFeed, clearFeed ,removeFromFeed} = feedSlice.actions;
export default feedSlice.reducer;
