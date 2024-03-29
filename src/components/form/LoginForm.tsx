import { AntDesign, FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ColorSchema } from "../../constants/Colors";
import { UserActions } from "../../store/actions/UserActions";
import { UserState } from "../../store/reducers/UserReducer";
import {
  isValidEmail,
  isValidObjField,
  updateError,
} from "../../utils/inputValidation";
import { getSelfInfo, makeAuthRequest } from "../../utils/makeRequestToServer";
import { FormContainer } from "./FormContainer";
import { FormInput } from "./FormInput";
import * as Google from "expo-auth-session/providers/google";
import { TokenResponse } from "expo-auth-session";
import { useNavigation } from "@react-navigation/native";
import GestureRecognizer from "react-native-swipe-gestures";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthParamList } from "../../navigation/types";

/**
 * @compenent
 * @description Returns login form component that contains the FormNavButtons,
 * FormInputs for email and password and buttons for login and google sign-up
 */
export const LoginForm: React.FC = () => {
  const theme = useSelector((state: { user: UserState }) => state.user.theme);
  const language = useSelector(
    (state: { user: UserState }) => state.user.language
  );
  const navigation: StackNavigationProp<AuthParamList, "Login" | "Register"> =
    useNavigation();
  const dispatch = useDispatch();

  const [googleToken, setGoogleToken] = useState<TokenResponse | null>(null);
  const [error, setError] = useState({ message: "", field: "" });
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const { email, password } = userInfo;

  const [_request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "102677665631-i1jrt648jjl95l35c0vde36vlpnsh1bs.apps.googleusercontent.com",
    expoClientId:
      "102677665631-2bnoj2r075lhqpgtrdh46of7sq636uj5.apps.googleusercontent.com",
    redirectUri: "https://auth.expo.io/@gen44o/pmu-app",
    clientSecret: "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",
    scopes: ["profile", "email"],
  });

  const handleOnChangeText = (value: string, fieldName: string) => {
    setUserInfo({ ...userInfo, [fieldName]: value });
  };

  const isValidForm = () => {
    if (!isValidObjField(userInfo))
      return updateError("Required all fields!", "all", setError);

    if (!isValidEmail(email))
      return updateError("Invalid email!", "email", setError);

    if (!password.trim() || password.length < 6)
      return updateError("Password is too short!", "pass", setError);

    return true;
  };

  const submitForm = async () => {
    if (isValidForm()) {
      const token = await makeAuthRequest("login", { ...userInfo });
      if (token !== null) {
        const userInfo = await getSelfInfo(token);
        if (userInfo !== null) {
          dispatch({
            type: UserActions.LOGIN,
            payload: {
              token,
              userData: {
                ...userInfo,
              },
            },
          });
        }
      }
    }
  };

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      setGoogleToken(authentication);
    }
  }, [response]);

  async function getUserData() {
    let res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: {
        Authorization: `Bearer ${googleToken?.accessToken}`,
        Authentication: `Bearer ${googleToken?.accessToken}`,
      },
    });
    // console.log(JSON.stringify(res));
    const data = await res.json();
    console.log(data);
  }

  return (
    <>
      <FormContainer>
        <GestureRecognizer
          config={{
            velocityThreshold: 0.3,
            directionalOffsetThreshold: 80,
          }}
          onSwipeLeft={() => {
            navigation.navigate("Register");
          }}
        >
          <Text
            style={[
              styles.header,
              theme && theme === "dark" ? styles.headerDark : styles.header,
            ]}
          >
            {language && language === "en"
              ? "Welcome Back!"
              : "Добре дошли отново!"}
          </Text>
          {error && error.field === "all" ? (
            <Text style={styles.textError}>{error.message}</Text>
          ) : null}
          <View style={styles.form}>
            <FormInput
              value={email}
              onChangeText={(value: string) =>
                handleOnChangeText(value, "email")
              }
              label={language && language === "en" ? "Email" : "Имейл адрес"}
              placeholder="example@email.com"
              autoCapitalize="none"
              error={
                error && error.field === "email" ? error.message : undefined
              }
              returnKeyType="next"
            />
            <FormInput
              value={password}
              onChangeText={(value: string) =>
                handleOnChangeText(value, "password")
              }
              label={language && language === "en" ? "Password" : "Парола"}
              placeholder="********"
              autoCapitalize="none"
              secureTextEntry
              error={
                error && error.field === "pass" ? error.message : undefined
              }
              returnKeyType="done"
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.buttons}>
                <AntDesign.Button
                  name="login"
                  size={25}
                  color={"white"}
                  backgroundColor={ColorSchema.default.dark_green}
                  onPress={() => {
                    submitForm();
                  }}
                >
                  {language && language === "en" ? "LOGIN" : "ВХОД"}
                </AntDesign.Button>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttons}>
                <FontAwesome.Button
                  name="google"
                  size={25}
                  color={"white"}
                  backgroundColor={ColorSchema.default.dark_green}
                  onPress={async () => {
                    await promptAsync({ showInRecents: true });
                    // if (googleToken) {
                    //   await getUserData();
                    // }
                    const token = await makeAuthRequest("login", {
                      email: "dani_matev1@abv.bg",
                      password: "123456",
                    });
                    if (token !== null) {
                      const userInfo = await getSelfInfo(token);
                      if (userInfo !== null) {
                        dispatch({
                          type: UserActions.LOGIN,
                          payload: {
                            token,
                            userData: {
                              ...userInfo,
                            },
                          },
                        });
                      }
                    }
                  }}
                >
                  {language && language === "en"
                    ? "REGISTER"
                    : "Регистрация".toUpperCase()}
                </FontAwesome.Button>
              </TouchableOpacity>
            </View>
          </View>
        </GestureRecognizer>
      </FormContainer>
    </>
  );
};

const styles = StyleSheet.create({
  textError: {
    color: ColorSchema.default.error,
    fontSize: 18,
    textAlign: "center",
  },
  header: {
    textAlign: "center",
    marginVertical: 20,
    fontWeight: "bold",
    fontSize: 28,
  },
  headerLight: {
    color: ColorSchema.light.text,
  },
  headerDark: {
    color: ColorSchema.dark.text,
  },
  form: {
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 15,
  },
  buttons: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
