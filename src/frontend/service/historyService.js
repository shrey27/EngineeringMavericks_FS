import axios from "axios";
import { GETHISTORY } from "../routes/routes";

export const getHistoryVideos = async (token) => {
  try {
    const {
      data: { history },
    } = await axios.get(GETHISTORY, {
      headers: {
        auth_token: token,
      },
    });
    return history;
  } catch (err) {
    console.log("HISTORY_GET_REQUEST_ERROR", err);
  }
};

export const addToHistory = async (video, token) => {
  try {
    const {
      data: { history },
    } = await axios.post(
      GETHISTORY,
      { video },
      { headers: { auth_token: token } }
    );
    return history;
  } catch (err) {
    console.log("HISTORY_POST_REQUEST_ERROR", err);
  }
};

export const deleteFromHistory = async (id, token) => {
  try {
    const {
      data: { history },
    } = await axios.delete(`${GETHISTORY}/${id}`, {
      headers: {
        auth_token: token,
      },
    });
    return history;
  } catch (err) {
    console.log("HISTORY_DELETE_REQUEST_ERROR", err);
  }
};

export const clearHistory = async (token) => {
  try {
    const {
      data: { history },
    } = await axios.delete(`${GETHISTORY}/all`, {
      headers: {
        auth_token: token,
      },
    });
    return history;
  } catch (err) {
    console.log("CLEAR_ALL_HISTORY_REQUEST_ERROR", err);
  }
};
