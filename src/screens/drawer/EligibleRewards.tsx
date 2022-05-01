import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { ErrorMessage } from "../../components/general/ErrorMessage";
import { RewardCard } from "../../components/rewards/RewardCard";
import { ColorSchema } from "../../constants/Colors";
import { EligibleRewards } from "../../models/Rewards";
import { DrawerNavProps } from "../../navigation/types";
import { UserState } from "../../store/reducers/UserReducer";

export const EligibleRewardsScreen =
  ({}: DrawerNavProps<"EligibleRewards">) => {
    const rewards: EligibleRewards[] | null = useSelector(
      (state: { user: UserState }) => {
        if (state.user.user) {
          return state.user.user.eligible_rewards;
        } else return null;
      }
    );

    const theme = useSelector((state: { user: UserState }) => state.user.theme);
    const language = useSelector(
      (state: { user: UserState }) => state.user.language
    );

    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor:
              theme === "dark"
                ? ColorSchema.dark.background
                : ColorSchema.light.background,
          },
        ]}
      >
        {rewards && rewards.length > 0 ? (
          <FlatList
            style={{ marginTop: 25 }}
            keyExtractor={(item) => `${item.reward_id}`}
            renderItem={({ item }) => (
              <RewardCard
                id={item.reward_id}
                name={item.name}
                picture={item.picture}
                description={item.description}
              />
            )}
            data={rewards}
          />
        ) : (
          <ErrorMessage
            text={
              language === "en"
                ? "No rewards available. Collect more stamps!"
                : "Нямате необходимите печати, за да получите награди."
            }
          />
        )}
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    fontSize: 24,
  },
});
