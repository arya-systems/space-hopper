import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export type ThemeProps = "pureBlack" | "observation";

export type StarsProps = "few" | "all";
export type DsoProps = "few" | "all";
export type TextSizeProps = "small" | "medium" | "large";

export type AppearanceProps = {
  colors: {
    theme: ThemeProps;
  };
  visibility: {
    stars: StarsProps;
    dso: DsoProps;
    textSize: TextSizeProps;
    alignOnDso: boolean;
    starNames: boolean;
    openClusters: boolean;
    globularClusters: boolean;
    nebulaes: boolean;
    galaxies: boolean;
    planets: boolean;
    constellations: boolean;
  };
};
export type StorageProps = {};
export type OthersProps = {
  battery: {
    optimizationDisabled: boolean;
  };
};

export interface SettingsProps {
  appearance: AppearanceProps;
  storage: StorageProps;
  others: OthersProps;
  info: {};
}

const initialState: SettingsProps = {
  appearance: {
    colors: {
      theme: "pureBlack",
    },
    visibility: {
      stars: "few",
      dso: "few",
      textSize: "small",
      alignOnDso: true,
      starNames: true,
      openClusters: true,
      globularClusters: true,
      nebulaes: true,
      galaxies: true,
      planets: true,
      constellations: true,
    },
  },
  storage: {},
  others: {
    battery: {
      optimizationDisabled: false,
    },
  },
  info: {},
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setappearance: (
      { appearance },
      { payload }: PayloadAction<AppearanceProps>,
    ) => {
      appearance.colors.theme = payload.colors.theme;
    },
    setstorage: ({ storage }, { payload }: PayloadAction<StorageProps>) => {
      storage = {};
    },
    setothers: ({ others }, { payload }: PayloadAction<OthersProps>) => {
      others = {
        battery: {
          optimizationDisabled: payload.battery.optimizationDisabled,
        },
      };
    },
  },
});

export const { setappearance, setstorage, setothers } = settingsSlice.actions;

export default settingsSlice.reducer;
