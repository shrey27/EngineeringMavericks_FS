import { createContext, useContext, useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { VIDEOS } from "../routes/routes";
import { getVideos, uploadVideo } from "../service";
import { defaultLandingState, landingReducer } from "../helpers";
import { ToastMessage } from "../components";
import { categories } from "../utility/constants";
import { v4 as uuid } from "uuid";
import { useAuthCtx } from "./AuthenticationContext";
import axios from "axios";

const LandingContext = createContext();

const perPage = 4;

const filterVideos = (filter, videoList) => {
  let tempList = videoList;
  if (filter) {
    tempList = tempList?.filter((e) =>
      filter === "All" ? true : e.category === filter
    );
  }
  return tempList;
};

function getId(url) {
  let regex =
    /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
  return regex.exec(url)[3];
}

function LandingProvider({ children }) {
  const { token } = useAuthCtx();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(landingReducer, defaultLandingState);
  const { filter, search, videoList, savedFilterList, after, more } = state;

  // const load = () => {
  //   dispatch({ type: "SET_LOADING" });

  //   setTimeout(() => {
  //     const newData = videoList?.slice(after, after + perPage);
  //     dispatch({ type: "RESET_LOADING", newData });
  //   }, 300);
  //   dispatch({ type: "RESET_LOADING", newData });
  // };

  const filterList = (list) => {
    return filterVideos(filter, list);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim().length > 0) {
      dispatch({ type: "SET_FILTER", payload: "All" });
    }
    navigate({
      pathname: VIDEOS,
      search: `query=${search.trim()}`,
    });
  };

  const getCategoriesList = async () => {
    dispatch({ type: "GET_CATEGORY", payload: categories });
  };

  const addNewVideo = async (formObject) => {
    try {
      const { url, category, creator, title, description } = formObject;
      const youtubeVideoId = getId(url);
      if (!videoList.some((item) => item.video === youtubeVideoId)) {
        if (
          !savedFilterList.some(
            (item) => item.toLowerCase() === category.toLowerCase()
          )
        ) {
          dispatch({
            type: "ADD_FILTER",
            payload: category,
          });
        }
        const videoObject = {
          _id: uuid(),
          video: youtubeVideoId,
          creator,
          title,
          category,
          description,
          videoDate: new Date(),
          viewCount: 0,
          comments: [],
        };
        const videos = await uploadVideo(videoObject);
        dispatch({ type: "GET_VIDEOS", payload: videos });
        if (!more) {
          dispatch({ type: "SET_DATA", payload: [videoObject] });
        }
        ToastMessage("Video added successfully", "success");
      } else {
        ToastMessage("Video already uploaded", "error");
      }
    } catch (err) {
      console.log("Video UPLOAD failed !", err);
      ToastMessage("Video was not uploaded", "error");
    }
  };

  const updateCommentsOnVideo = (videoId, commentId, newComment, toEdit) => {
    let commentToUpdate = videoList.find(
      (item) => item._id === videoId
    ).comments;
    if (commentId.trim().length) {
      if (toEdit) {
        commentToUpdate = commentToUpdate.reduce(
          (acc, curr) =>
            curr._id === commentId
              ? [...acc, { ...curr, comment: newComment }]
              : [...acc, curr],
          []
        );
      } else {
        commentToUpdate = commentToUpdate.filter(
          (elem) => elem._id !== commentId
        );
      }
    } else {
      commentToUpdate = commentToUpdate.concat({
        _id: uuid(),
        comment: newComment,
      });
    }

    dispatch({
      type: "UPDATE_COMMENTS",
      payload: { videoId, comments: commentToUpdate },
    });
  };

  const getComments = (videoId) => {
    const video = videoList.find((item) => item._id === videoId);
    return video.comments;
  };

  useEffect(() => {
    const getVideosList = async () => {
      const videos = await getVideos();
      dispatch({ type: "GET_VIDEOS", payload: videos });
      // const newData = videos?.slice(0, 4);
      const newData = videos;
      dispatch({ type: "SET_DATA", payload: newData });
    };
    try {
      getCategoriesList();
      getVideosList();
    } catch (err) {
      console.log("GET-Videos Error", err);
    }
  }, []);

  return (
    <LandingContext.Provider
      value={{
        state,
        dispatch,
        handleSearchSubmit,
        filterList,
        addNewVideo,
        updateCommentsOnVideo,
        getComments,
        // load,
      }}
    >
      {children}
    </LandingContext.Provider>
  );
}

const useLandingCtx = () => useContext(LandingContext);

export { useLandingCtx, LandingProvider };
