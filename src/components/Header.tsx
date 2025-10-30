"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const Header = () => {
  const { user } = useUser();

  return (
    <header className="w-full h-10 sticky top-0 z-50 bg-[#100E09] rounded-b-xl px-6 py-2 flex items-center justify-between">
      {user && (
        <h1 className="text-lg font-serif font-semibold text-white tracking-wide">
          {user.firstName}&apos;s Space
        </h1>
      )}

      <Breadcrumbs />

      <SignedOut>
        <SignInButton mode="modal">
          <button className="px-4 py-1 rounded-full bg-[#ede9e3] text-[#383433] font-medium hover:bg-[#d6d3d1] transition">
            Sign In
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox:
                "ring-2 ring-[#FFF] ring-offset-2 ring-offset-[#383433]",
            },
          }}
        />
      </SignedIn>
    </header>
  );
};

export default Header;
