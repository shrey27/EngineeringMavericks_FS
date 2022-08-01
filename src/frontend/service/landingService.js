import axios from "axios";
import { GETVIDEOS } from "../routes/routes";

export const getVideos = async () => {
  const {
    data: { videos },
  } = await axios.get(GETVIDEOS);
  return videos;
};

export const uploadVideo = async (video) => {
  const {
    data: { videos },
  } = await axios.post(GETVIDEOS, { video });
  return videos;
};
