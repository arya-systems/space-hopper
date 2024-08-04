import ScrollView from "@/components/ScrollView";
import {
  DsoProps,
  setappearance,
  StarsProps,
  TextSizeProps,
  ThemeProps,
} from "@/features/slices/settingsSlice";
import { RootState } from "@/features/store";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  List,
  Portal,
  RadioButton,
  SegmentedButtons,
  Switch,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";

export default function Appearance() {
  const dispatch = useDispatch();
  const { colors, visibility } = useSelector(
    (state: RootState) => state.settings.appearance,
  );

  const [theme, settheme] = useState<ThemeProps>(colors.theme);
  const [isThemeDialogVisible, setisThemeDialogVisible] =
    useState<boolean>(false);
  const [stars, setstars] = useState<StarsProps>(visibility.stars);
  const [dso, setdso] = useState<DsoProps>(visibility.dso);
  const [textSize, settextSize] = useState<TextSizeProps>(visibility.textSize);
  const [alignOnDso, setalignOnDso] = useState<boolean>(visibility.alignOnDso);
  const [starNames, setstarNames] = useState<boolean>(visibility.starNames);
  const [openClusters, setopenClusters] = useState<boolean>(
    visibility.openClusters,
  );
  const [globularClusters, setglobularClusters] = useState<boolean>(
    visibility.globularClusters,
  );
  const [nebulaes, setnebulaes] = useState<boolean>(visibility.nebulaes);
  const [galaxies, setgalaxies] = useState<boolean>(visibility.galaxies);
  const [planets, setplanets] = useState<boolean>(visibility.planets);
  const [constellations, setconstellations] = useState<boolean>(
    visibility.constellations,
  );

  const showThemeDialog = () => setisThemeDialogVisible(true);
  const hideThemeDialog = () => setisThemeDialogVisible(false);

  useEffect(() => {
    dispatch(
      setappearance({
        colors: {
          theme,
        },
        visibility: {
          stars,
          dso,
          textSize,
          alignOnDso,
          starNames,
          openClusters,
          globularClusters,
          nebulaes,
          galaxies,
          planets,
          constellations,
        },
      }),
    );
  }, [
    theme,
    stars,
    dso,
    textSize,
    alignOnDso,
    starNames,
    openClusters,
    globularClusters,
    nebulaes,
    galaxies,
    planets,
    constellations,
  ]);

  return (
    <ScrollView>
      <List.Section>
        <List.Subheader>COLORS</List.Subheader>
        <List.Item
          title="Theme"
          description={theme.slice(0, 1).toUpperCase() + theme.slice(1)}
          onPress={showThemeDialog}
        />
      </List.Section>
      <List.Section>
        <List.Subheader>VISIBILITY</List.Subheader>
        <List.Item
          title="Stars"
          right={() => (
            <SegmentedButtons
              value={stars}
              onValueChange={setstars}
              buttons={[
                { label: "Few", value: "few" },
                { label: "All", value: "all" },
              ]}
            />
          )}
        />
        <List.Item
          title="DSO"
          right={() => (
            <SegmentedButtons
              value={dso}
              onValueChange={setdso}
              buttons={[
                { label: "Few", value: "few" },
                { label: "All", value: "all" },
              ]}
            />
          )}
        />
        <List.Item
          title="Text Size"
          right={() => (
            <SegmentedButtons
              value={textSize}
              onValueChange={settextSize}
              buttons={[
                { label: "Small", value: "small" },
                { label: "Medium", value: "medium" },
                { label: "Large", value: "large" },
              ]}
            />
          )}
        />
        <List.Item
          title="Align on DSO"
          right={() => (
            <Switch value={alignOnDso} onValueChange={setalignOnDso} />
          )}
        />
        <List.Item
          title="Star Names"
          right={() => (
            <Switch value={starNames} onValueChange={setstarNames} />
          )}
        />
        <List.Item
          title="Open Clusters"
          right={() => (
            <Switch value={openClusters} onValueChange={setopenClusters} />
          )}
        />
        <List.Item
          title="Globular Clusters"
          right={() => (
            <Switch
              value={globularClusters}
              onValueChange={setglobularClusters}
            />
          )}
        />
        <List.Item
          title="Nebulaes"
          right={() => <Switch value={nebulaes} onValueChange={setnebulaes} />}
        />
        <List.Item
          title="Galaxies"
          right={() => <Switch value={galaxies} onValueChange={setgalaxies} />}
        />
        <List.Item
          title="Planets"
          right={() => <Switch value={planets} onValueChange={setplanets} />}
        />
        <List.Item
          title="Constellations"
          right={() => (
            <Switch value={constellations} onValueChange={setconstellations} />
          )}
        />
      </List.Section>
      <Portal>
        <Dialog visible={isThemeDialogVisible} onDismiss={hideThemeDialog}>
          <Dialog.Title>Theme</Dialog.Title>
          <Dialog.Content>
            <RadioButton.Item
              label="Pure Black"
              value="pureBlack"
              status={theme === "pureBlack" ? "checked" : "unchecked"}
              onPress={() => settheme("pureBlack")}
            />
            <RadioButton.Item
              label="Observation"
              value="observation"
              status={theme === "observation" ? "checked" : "unchecked"}
              onPress={() => settheme("observation")}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideThemeDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
}
