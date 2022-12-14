import axios from "axios";
import { SIGN_IN, SIGN_UP } from "../routes/routes";
import { v4 as uuid } from "uuid";

const errorStatements = {
  signin: "User Not Found. Either Sign-up or try again later",
  signup: "Sign Up Failed! Use different credentials or Try again later!",
};

export const signUpApi = async (username, email, password) => {
  try {
    const response = await axios.post(SIGN_UP, {
      newUser: {
        _id: uuid(),
        firstName: username.split(" ")[0],
        lastName: username.split(" ")[1],
        email,
        password,
      },
    });
    return response;
  } catch (err) {
    console.log("SIGNUP-ERROR", err);
    return {
      error: errorStatements.signup,
    };
  }
};

export const signInApi = async (email, password) => {
  try {
    const response = await axios.post(SIGN_IN, {
      email,
      password,
    });
    return response;
  } catch (err) {
    console.log("SIGNIN-ERROR", err);
    return {
      error: errorStatements.signin,
    };
  }
};
