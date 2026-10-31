import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { useChapters } from "@repo/sdk";
import { Screen } from "@/components/layout/screen";
import { SnapDrawer } from "@/components/layout/snap-drawer";
import { PinMarker } from "@/components/map/map-markers";
import { MAP_STYLE_URL } from "@/components/map/map-style";
import { ChapterFilter } from "@/features/archive/components/chapter-filter";
import type { Fragment } from "@/features/archive/types";
import { MapEmptyCard } from "@/features/map/components/map-empty-card";
import { MapError } from "@/features/map/components/map-error";
import { MapLoading } from "@/features/map/components/map-loading";
import { MapPartialNotice } from "@/features/map/components/map-partial-notice";
import { PinDetails } from "@/features/map/components/pin-details";
import { PinDrawerHeader } from "@/features/map/components/pin-drawer-header";
import { useLocatedFragments } from "@/features/map/use-located-fragments";
import { useMapLoad } from "@/features/map/use-map-load";
import { useMapPins } from "@/features/map/use-map-pins";
import { Camera, Map } from "@/lib/maplibre";

function MapContent({
  fragments,
  focus,
  incomplete,
  onRetryPages,
}: {
  fragments: Fragment[];
  focus: string | undefined;
  incomplete: boolean;
  onRetryPages: () => void;
}) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { ready, failed, attempt, retry, onMapReady } = useMapLoad();
  const chapters = useChapters().data ?? [];
  const {
    chapter,
    setChapter,
    setSelectedId,
    located,
    pins,
    initialView,
    selectedPin,
    selectedFragment,
    noLocations,
  } = useMapPins(fragments, focus);
  const openFragment = (id: string) => {
    setDrawerOpen(false);
    router.push({ pathname: "/fragments/[id]", params: { id } });
  };
  return (
    <Screen title="Peta Kenangan" back>
      <View className="flex-1">
        <Map
          key={attempt}
          style={{ flex: 1 }}
          mapStyle={MAP_STYLE_URL}
          onDidFinishLoadingMap={onMapReady}
          touchRotate={false}
          touchPitch={false}
        >
          <Camera initialViewState={initialView} />
          {located.map((fragment) =>
            fragment.location ? (
              <PinMarker
                key={fragment.id}
                fragment={fragment}
                selected={drawerOpen && selectedFragment?.id === fragment.id}
                onPress={() => {
                  setSelectedId(fragment.id);
                  setDrawerOpen(true);
                }}
              />
            ) : null,
          )}
        </Map>
        <View className="absolute inset-x-0 top-2" pointerEvents="box-none">
          <ChapterFilter
            chapters={chapters}
            active={chapter}
            onChange={setChapter}
          />
        </View>
        {!ready && !failed ? <MapLoading /> : null}
        {failed && !ready ? <MapError onRetry={retry} /> : null}
        {ready && incomplete ? (
          <MapPartialNotice onRetry={onRetryPages} />
        ) : null}
        {ready && !incomplete && pins.length === 0 ? (
          <MapEmptyCard
            chapter={chapter}
            noLocations={noLocations}
            onResetFilter={() => setChapter(null)}
          />
        ) : null}
      </View>
      <SnapDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        snapPoints={[0.55, 1]}
        header={selectedPin ? <PinDrawerHeader pin={selectedPin} /> : null}
      >
        {selectedPin && selectedFragment ? (
          <PinDetails
            fragment={selectedFragment}
            others={selectedPin.fragments.filter(
              (item) => item.id !== selectedFragment.id,
            )}
            onSelect={setSelectedId}
            onOpen={openFragment}
          />
        ) : null}
      </SnapDrawer>
    </Screen>
  );
}

function MapScreen() {
  const { focus } = useLocalSearchParams<{ focus?: string }>();
  const { fragments, status, incomplete, retry } = useLocatedFragments();
  if (status !== "ready") {
    return (
      <Screen title="Peta Kenangan" back>
        <View className="flex-1">
          {status === "loading" ? (
            <MapLoading />
          ) : (
            <MapError
              onRetry={retry}
              message="Lokasi fragmen tidak bisa dimuat. Periksa koneksi internet, lalu coba lagi."
            />
          )}
        </View>
      </Screen>
    );
  }
  return (
    <MapContent
      fragments={fragments}
      focus={focus}
      incomplete={incomplete}
      onRetryPages={retry}
    />
  );
}

export { MapScreen };
