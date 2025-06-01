import { MentionNodeAttrs } from "@tiptap/extension-mention";
import { ReactRenderer,  } from "@tiptap/react";
import { SuggestionProps } from "@tiptap/suggestion";
import { Instance } from "tippy.js";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    mention: {
      setMentionLoading: (isLoading: boolean) => ReturnType;
      setMentionError: (isError: boolean) => ReturnType;
      setMentionItems: (items: MentionItem[]) => ReturnType;
    };
  }
}

declare module "@tiptap/extension-mention" {
  interface MentionNodeAttrs {
    loading?: boolean;
    error?: boolean;
  }
}

export interface MentionStorage {
  loading: boolean;
  error: boolean;
  items: MentionItem[];
  _component: ReactRenderer | null;
  _popup: Instance | null;
  _lastProps: SuggestionProps<string, MentionNodeAttrs> | null;
}

export interface MentionItem {
  id:string
  label: string
}