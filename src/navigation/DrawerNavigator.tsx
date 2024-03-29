import {
  AntDesign,
  FontAwesome,
  FontAwesome5,
  Ionicons,
} from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useSelector } from "react-redux";
import { CustomDrawer } from "../components/drawer/CustomDrawer";
import { ColorSchema } from "../constants/Colors";
import { EligibleRewards } from "../models/Rewards";
import { EligibleRewardsScreen } from "../screens/drawer/EligibleRewards";
import { ScanRewardsScreen } from "../screens/drawer/ScanRewards";
import { GivenRewardsScreen } from "../screens/drawer/GivenRewards";
import { ScanQRScreen } from "../screens/drawer/ScanQR";
import { SettingScreen } from "../screens/drawer/Settings";
import { UserState } from "../store/reducers/UserReducer";
import { AppTabs } from "./MainTabs";
import { DrawerParamList } from "./types";
import { EmployeeRewardsScreen } from "../screens/drawer/EmployeeRewards";

const DrawerNavigator = createDrawerNavigator<DrawerParamList>();

/**
 * @compenent
 * @description Drawer Navigator used as main navigation after user is authenticated.
 * Also contains the bottom tab navigator and its content is wrapped inside my Custom Drawer Component.
 * Used for Home, Settings, GivenRewards, EligibleRewards, ScanQR, and EmployeeRewards screens.
 */
export const DrawerNav: React.FC = ({}) => {
  const theme = useSelector((state: { user: UserState }) => state.user.theme);
  const language = useSelector(
    (state: { user: UserState }) => state.user.language
  );
  const user = useSelector((state: { user: UserState }) => state.user.user);

  const rewards: EligibleRewards[] = useSelector(
    (state: { user: UserState }) => {
      if (state.user.user) {
        return state.user.user.eligible_rewards;
      } else return [];
    }
  );

  return (
    <DrawerNavigator.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        // header: () => null,
        // drawerPosition: "right",
        headerShown: false,
        drawerActiveBackgroundColor:
          theme && theme === "dark"
            ? ColorSchema.default.formButtonAlpha
            : ColorSchema.light.formButton,
        drawerActiveTintColor:
          theme && theme === "dark"
            ? ColorSchema.dark.text
            : ColorSchema.light.text,
        drawerInactiveBackgroundColor:
          theme && theme === "dark"
            ? ColorSchema.default.disabledButton
            : ColorSchema.light.background,
        drawerInactiveTintColor:
          theme && theme === "dark"
            ? ColorSchema.default.disabled
            : ColorSchema.light.text,
        drawerLabelStyle: {
          marginLeft: -25,
          fontSize: 15,
        },
        drawerStyle: {
          backgroundColor:
            theme && theme === "dark"
              ? ColorSchema.dark.background
              : ColorSchema.light.background, // "rgb(141, 141, 168)",
        },
      }}
    >
      <DrawerNavigator.Screen
        name="Tabs"
        options={{
          headerStyle: {
            backgroundColor:
              theme && theme === "dark"
                ? ColorSchema.dark.background
                : ColorSchema.light.background,
          },
          headerTitleStyle: {
            color:
              theme && theme === "dark"
                ? ColorSchema.dark.text
                : ColorSchema.light.text,
          },
          title: language === "en" ? "Home" : "Начало",
          drawerIcon: ({ color }) => (
            <FontAwesome5 name="home" size={24} color={color} />
          ),
        }}
        component={AppTabs}
      ></DrawerNavigator.Screen>

      <DrawerNavigator.Screen
        name="Settings"
        options={({ navigation }) => ({
          headerStyle: {
            backgroundColor:
              theme && theme === "dark"
                ? ColorSchema.dark.background
                : ColorSchema.light.background,
          },
          headerTitleStyle: {
            color:
              theme && theme === "dark"
                ? ColorSchema.dark.text
                : ColorSchema.light.text,
          },
          headerShown: true,
          title: language === "en" ? "Settings" : "Настройки",
          drawerIcon: ({ color }) => (
            <FontAwesome name="cog" size={24} color={color} />
          ),
          headerLeft: () => (
            <Ionicons
              name="menu"
              size={24}
              color={
                theme && theme === "dark"
                  ? ColorSchema.dark.text
                  : ColorSchema.light.text
              }
              onPress={() => {
                navigation.toggleDrawer();
              }}
            />
          ),
        })}
        component={SettingScreen}
      />
      <DrawerNavigator.Screen
        name="GivenRewards"
        options={({ navigation }) => ({
          title: language === "en" ? "Collected Rewards" : "Получени Награди",
          headerShown: true,
          headerTintColor:
            theme && theme === "dark"
              ? ColorSchema.dark.text
              : ColorSchema.light.text,
          headerStyle: {
            backgroundColor:
              theme && theme === "dark"
                ? ColorSchema.dark.background
                : ColorSchema.light.background,
            borderBottomWidth: theme && theme === "dark" ? 1 : 1,
            borderBottomColor: theme && theme === "dark" ? "grey" : "grey",
          },
          drawerIcon: ({ color }) => (
            <FontAwesome5 name="gift" size={24} color={color} />
          ),
          headerLeft: () => (
            <Ionicons
              name="menu"
              size={24}
              color={
                theme && theme === "dark"
                  ? ColorSchema.dark.text
                  : ColorSchema.light.text
              }
              onPress={() => {
                navigation.toggleDrawer();
              }}
            />
          ),
        })}
        component={GivenRewardsScreen}
      />
      <DrawerNavigator.Screen
        name="EligibleRewards"
        options={({ navigation }) => ({
          title: language === "en" ? "Eligible Rewards" : "Отключени Награди",
          headerShown: true,
          headerTintColor:
            theme && theme === "dark"
              ? ColorSchema.dark.text
              : ColorSchema.light.text,
          headerStyle: {
            backgroundColor:
              theme && theme === "dark"
                ? ColorSchema.dark.background
                : ColorSchema.light.background,
            borderBottomWidth: theme && theme === "dark" ? 1 : 1,
            borderBottomColor: theme && theme === "dark" ? "grey" : "grey",
          },
          drawerIcon: ({ color }) => (
            <FontAwesome5 name="gift" size={24} color={color} />
          ),
          headerLeft: () => (
            <Ionicons
              name="menu"
              size={24}
              color={
                theme && theme === "dark"
                  ? ColorSchema.dark.text
                  : ColorSchema.light.text
              }
              onPress={() => {
                navigation.toggleDrawer();
              }}
            />
          ),
        })}
        component={EligibleRewardsScreen}
      />
      {user?.employeeInfo !== null ? (
        <>
          <DrawerNavigator.Screen
            name="EmployeeRewards"
            initialParams={{ rewards }}
            options={({ navigation }) => ({
              drawerItemStyle: {
                display: "none",
              },
              title:
                language === "en"
                  ? "Employee Available Rewards"
                  : "Награди За Раздаване",
              headerShown: true,
              headerTintColor:
                theme && theme === "dark"
                  ? ColorSchema.dark.text
                  : ColorSchema.light.text,
              headerStyle: {
                backgroundColor:
                  theme && theme === "dark"
                    ? ColorSchema.dark.background
                    : ColorSchema.light.background,
                borderBottomWidth: theme && theme === "dark" ? 1 : 1,
                borderBottomColor: theme && theme === "dark" ? "grey" : "grey",
              },
              drawerIcon: ({ color }) => (
                <FontAwesome5 name="user-check" size={24} color={color} />
              ),
              headerLeft: () => (
                <Ionicons
                  name="menu"
                  size={24}
                  color={
                    theme && theme === "dark"
                      ? ColorSchema.dark.text
                      : ColorSchema.light.text
                  }
                  onPress={() => {
                    navigation.toggleDrawer();
                  }}
                />
              ),
            })}
            component={EmployeeRewardsScreen}
          />
          <DrawerNavigator.Screen
            name="ScanQR"
            options={({ navigation }) => ({
              headerShown: true,
              title: language === "en" ? "Scan QR Code" : "Сканирай QR код",
              headerTintColor:
                theme && theme === "dark"
                  ? ColorSchema.dark.text
                  : ColorSchema.light.text,
              headerStyle: {
                backgroundColor:
                  theme && theme === "dark"
                    ? ColorSchema.dark.background
                    : ColorSchema.light.background,
                borderBottomWidth: theme && theme === "dark" ? 1 : 1,
                borderBottomColor: theme && theme === "dark" ? "grey" : "grey",
              },
              drawerIcon: ({ color }) => (
                <AntDesign name="scan1" size={24} color={color} />
              ),
              headerLeft: () => (
                <Ionicons
                  name="menu"
                  size={24}
                  color={
                    theme && theme === "dark"
                      ? ColorSchema.dark.text
                      : ColorSchema.light.text
                  }
                  onPress={() => {
                    navigation.toggleDrawer();
                  }}
                />
              ),
            })}
            component={ScanQRScreen}
          />
          <DrawerNavigator.Screen
            name="ScanRewards"
            options={({ navigation }) => ({
              headerShown: true,
              title: language === "en" ? "Give Rewards" : "Дай Награди!",
              headerTintColor:
                theme && theme === "dark"
                  ? ColorSchema.dark.text
                  : ColorSchema.light.text,
              headerStyle: {
                backgroundColor:
                  theme && theme === "dark"
                    ? ColorSchema.dark.background
                    : ColorSchema.light.background,
                borderBottomWidth: theme && theme === "dark" ? 1 : 1,
                borderBottomColor: theme && theme === "dark" ? "grey" : "grey",
              },
              drawerIcon: ({ color }) => (
                <AntDesign name="scan1" size={24} color={color} />
              ),
              headerLeft: () => (
                <Ionicons
                  name="menu"
                  size={24}
                  color={
                    theme && theme === "dark"
                      ? ColorSchema.dark.text
                      : ColorSchema.light.text
                  }
                  onPress={() => {
                    navigation.toggleDrawer();
                  }}
                />
              ),
            })}
            component={ScanRewardsScreen}
          />
        </>
      ) : null}
    </DrawerNavigator.Navigator>
  );
};
