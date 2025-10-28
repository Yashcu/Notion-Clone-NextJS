"use client";

import { useEffect, useState } from "react";
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <RoomProviderWrapper
      id={roomId}
      initialPresence={{
        cursor: null,
      }}
    >
      <ClientSideSuspense fallback={<LoadingSpinner />}>
        {isMounted ? (
          <LiveCursorProvider>{children}</LiveCursorProvider>
        ) : (
          <LoadingSpinner />
        )}
      </ClientSideSuspense>
    </RoomProviderWrapper>
  );
}

export default RoomProvider;
