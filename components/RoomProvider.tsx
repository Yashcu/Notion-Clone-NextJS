"use client";

import LiveCursorProvider from "@/components/LiveCursorProvider";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  RoomProvider as RoomProviderWrapper,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";

function RoomProvider({
  roomId,
  children,
}: {
  roomId: string;
  children: React.ReactNode;
}) {
  return (
    <RoomProviderWrapper
      id={roomId}
      initialPresence={{
        cursor: null,
      }}
    >
      <ClientSideSuspense fallback={<LoadingSpinner />}>
        <LiveCursorProvider>{children}</LiveCursorProvider>
      </ClientSideSuspense>
    </RoomProviderWrapper>
  );
}

export default RoomProvider;
