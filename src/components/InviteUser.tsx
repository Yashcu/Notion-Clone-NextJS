"use client";

import { inviteUserToDocument } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";

function InviteUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const pathName = usePathname();

  const handleInvite = async (e: FormEvent) => {
    e.preventDefault();
    const roomId = pathName.split("/").pop();
    if (!roomId) return;

    startTransition(async () => {
      const { success } = await inviteUserToDocument(roomId, email);

      if (success) {
        setIsOpen(false);
        setEmail("");
        toast.success("User added successfully!");
      } else {
        toast.error("Failed to add user.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Invite</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a User to Collaborate</DialogTitle>
          <DialogDescription>
            Enter the email of the user you want to invite.
          </DialogDescription>
        </DialogHeader>
        <form className="flex gap-2 mt-3" onSubmit={handleInvite}>
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" disabled={!email || isPending}>
            {isPending ? "Inviting..." : "Invite"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default InviteUser;
