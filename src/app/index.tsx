import { View, Text } from "react-native";
import React from "react";
import StarMap from "@/components/StarMap";
import testStars from "@/data/testStars";

export default function index() {
  return <StarMap stars={testStars} />;
}
