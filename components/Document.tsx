"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import useOwner from "@/lib/useOwner";
import Editor from "@/components/Editor";
import DeleteDocument from "@/components/DeleteDocument";
import InviteUser from "@/components/InviteUser";
import ManageUsers from "@/components/ManageUsers";
import Avatars from "@/components/Avatar";

function Document({ id }: { id: string }) {
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const [input, setInput] = useState("");
  const [isUpdating, startTransition] = useTransition();
  const isOwner = useOwner();

  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  const updateTitle = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      startTransition(async () => {
        await updateDoc(doc(db, "documents", id), {
          title: input,
        });
      });
    }
  };

  return (
    <div className="flex-1 h-full bg-white p-5">
      <div className="flex max-w-6xl mx-auto justify-between pb-5">
        <form className="flex flex-1 space-x-2" onSubmit={updateTitle}>
          {/* update title */}
          <Input value={input} onChange={(e) => setInput(e.target.value)} />
          <Button disabled={isUpdating} type="submit">
            {isUpdating ? "Updating..." : "Update"}
          </Button>
          {/* if isOwner && InviteUser, DeleteDocument */}
          {isOwner && (
            <>
              {/* Invite User */}
              <InviteUser />

              {/* Delete Document */}
              <DeleteDocument />
            </>
          )}
        </form>
      </div>
      <div className="flex max-w-6xl mx-auto justify-between items-center mb-5">
        {/* Manage Users */}
        <ManageUsers />

        {/* Avatars */}
        <Avatars />
      </div>

      <hr className="pb-10" />

      {/* Collabrative Editor */}
      <Editor />
    </div>
  );
}

export default Document;
