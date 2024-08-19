import { View, Text } from "react-native";
import React from "react";
import StarMap from "@/components/StarMap";
import { allstars } from "@/data/allstars";

export default function index() {
  return <StarMap stars={allstars} />;
}
