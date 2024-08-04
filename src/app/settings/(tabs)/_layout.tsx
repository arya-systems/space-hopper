import { TabBar } from "@/components/TabBar";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import Appearance from "./appearance";
import Info from "./info";
import Others from "./others";

const Tab = createMaterialTopTabNavigator();

export default function TabLayout() {
  return (
    <Tab.Navigator tabBar={TabBar} initialRouteName="appearance">
      <Tab.Screen
        name="Appearance"
        component={Appearance}
        options={{ tabBarIcon: "color-palette" }}
      />
      <Tab.Screen
        name="Others"
        component={Others}
        options={{ tabBarIcon: "shapes" }}
      />
      <Tab.Screen
        name="Info"
        component={Info}
        options={{ tabBarIcon: "information" }}
      />
    </Tab.Navigator>
  );
}
