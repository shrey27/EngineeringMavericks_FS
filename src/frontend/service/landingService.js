import axios from 'axios';
import { GETVIDEOS } from '../routes/routes';

export const getVideos = async () => {
  try {
    const {
      data: { videos }
    } = await axios.get(GETVIDEOS);
    return videos;
  } catch (err) {
    console.log('Videos Error', err);
  }
};
