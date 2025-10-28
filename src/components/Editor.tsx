"use client";

import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { useEffect, useState, useMemo } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import { stringToColor } from "../lib/utils";

type EditorProps = {
  doc: Y.Doc;
  provider: LiveblocksYjsProvider;
  darkMode: boolean;
};

function BlockNote({ doc, provider, darkMode }: EditorProps) {
  const userInfo = useSelf((me) => me.info);
  const [editor, setEditor] = useState<BlockNoteEditor | null>(null);

  // Memoize user info to prevent unnecessary re-creation
  const collaborationUser = useMemo(
    () => ({
      name: userInfo?.name || "Anonymous",
      color: stringToColor(userInfo?.email || "default"),
    }),
    [userInfo?.name, userInfo?.email]
  );

  // Create editor in useEffect to avoid setState during render
  useEffect(() => {
    let editorInstance: BlockNoteEditor | null = null;

    const initializeEditor = () => {
      if (!provider.synced || editorInstance) return;

      try {
        editorInstance = BlockNoteEditor.create({
          collaboration: {
            provider,
            fragment: doc.getXmlFragment("document-store"),
            user: collaborationUser,
          },
        });

        setEditor(editorInstance);
      } catch (error) {
        console.error("Failed to create BlockNote editor:", error);
      }
    };

    if (provider.synced) {
      initializeEditor();
    } else {
      provider.on("sync", initializeEditor);
    }

    return () => {
      provider.off("sync", initializeEditor);
    };
  }, [doc, provider]);

  useEffect(() => {
    if (editor) {
      // Update user info if editor supports it
      // BlockNote might not expose this - check their API
    }
  }, [collaborationUser, editor]);

  if (!editor) {
    return (
      <div className="relative max-w-6xl mx-auto min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto">
      <BlockNoteView
        className="min-h-screen"
        editor={editor}
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}

function Editor() {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);
    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc?.destroy();
      yProvider?.destroy();
    };
  }, [room]);

  if (!doc || !provider) {
    return null;
  }

  const style = `hover:text-white ${
    darkMode
      ? "text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700"
      : "text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
  }`;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-2 justify-end mb-10">
        {/* Translate Document AI */}
        {/* Chatdocument AI */}

        {/* Dark Mode */}
        <Button className={style} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>

      {/* Blockmate */}
      <BlockNote doc={doc} provider={provider} darkMode={darkMode} />
    </div>
  );
}

export default Editor;
