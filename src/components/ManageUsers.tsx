"use client";

import { removeUserFromDocument } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db } from "@/config/firebase";
import useOwner from "@/hooks/useOwner";
import { useUser } from "@clerk/nextjs";
import { useRoom } from "@liveblocks/react";
import { collectionGroup, query, where } from "firebase/firestore";
import { useTransition } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { toast } from "sonner";

function ManageUsers() {
  const { user } = useUser();
  const room = useRoom();
  const isOwner = useOwner();
  const [isPending, startTransition] = useTransition();

  const [usersInRoom] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
  );

  const handleDelete = (userId: string) => {
    if (!user) return;
    startTransition(async () => {
      const { success } = await removeUserFromDocument(room.id, userId);
      if (success) {
        toast.success("User removed successfully!");
      } else {
        toast.error("Failed to remove user.");
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          Users ({usersInRoom?.docs.length || 0})
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Users with Access</DialogTitle>
          <DialogDescription>
            Below is a list of users who have access to this document.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 flex flex-col space-y-2">
          {usersInRoom?.docs.map((doc) => {
            const userId = doc.data().userId;
            const isCurrentUser = userId === user?.emailAddresses[0].toString();
            return (
              <div
                key={userId}
                className="flex items-center justify-between border-b py-2"
              >
                <p className="font-light">
                  {isCurrentUser ? `You (${userId})` : userId}
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    {doc.data().role}
                  </Button>
                  {isOwner && !isCurrentUser && (
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(userId)}
                      disabled={isPending}
                      size="sm"
                    >
                      {isPending ? "Removing..." : "Remove"}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ManageUsers;
