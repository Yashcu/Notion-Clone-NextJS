"use client";

import Document from "@/components/Document";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { use } from "react";

function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Document id={id} />
      <Breadcrumb />
    </div>
  );
}

export default DocumentPage;
