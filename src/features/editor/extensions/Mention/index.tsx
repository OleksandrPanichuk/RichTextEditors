import type { CommandProps } from "@tiptap/core";
import {
  MentionNodeAttrs,
  Mention as TiptapMention,
} from "@tiptap/extension-mention";
import { ReactRenderer } from "@tiptap/react";
import Suggestion, { SuggestionProps } from "@tiptap/suggestion";
import tippy, { Instance } from "tippy.js";
import { MentionList } from "./MentionList";

import type { MentionItem, MentionStorage } from "./types";

export const Mention = TiptapMention.extend({
  addStorage: () => {
    return {
      loading: false,
      error: false,
      _component: null as ReactRenderer | null,
      _popup: null as Instance | null,
      _lastProps: null as SuggestionProps<string, MentionNodeAttrs> | null,
    };
  },
  addAttributes() {
    return {
      ...this.parent?.(),
      loading: {
        default: false,
        parseHTML: (element) => element.hasAttribute("loading"),
      },
      error: {
        default: false,
        parseHTML: (element) => element.hasAttribute("error"),
      },
      _component: null as ReactRenderer | null,
      _popup: null as Instance | null,
      _lastProps: null as SuggestionProps<string, MentionNodeAttrs> | null,
    };
  },
  addCommands() {
    return {
      setMentionLoading:
        (isLoading: boolean) =>
        ({ editor }: CommandProps) => {
          const storage = editor.storage.mention as MentionStorage;
          storage.loading = isLoading;
          if (storage._component && storage._lastProps) {
            storage._component.updateProps({
              ...storage._lastProps,
              loading: storage.loading,
              error: storage.error,
            });
          }
          return true;
        },
      setMentionError:
        (isError: boolean) =>
        ({ editor }: CommandProps) => {
          const storage = editor.storage.mention as MentionStorage;
          storage.error = isError;
          if (storage._component && storage._lastProps) {
            storage._component.updateProps({
              ...storage._lastProps,
              loading: storage.loading,
              error: storage.error,
            });
          }
          return true;
        },
      setMentionItems:
        (items: MentionItem[]) =>
        ({ editor }: CommandProps) => {
          const storage = editor.storage.mention as MentionStorage;
          storage.items = items;
          if (storage._component && storage._lastProps) {
            storage._component.updateProps({
              ...storage._lastProps,
              loading: storage.loading,
              error: storage.error,
            });
          }
          return true;
        },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
        render: () => {
          let component: ReactRenderer;
          let popup: Instance;

          return {
            onStart: (props: SuggestionProps<string, MentionNodeAttrs>) => {
              const storage = this.editor.storage.mention as MentionStorage;

              storage._lastProps = props;

              component = new ReactRenderer(MentionList, {
                editor: props.editor,
                props: {
                  ...props,
                  loading: storage.loading,
                  error: storage.error,
                },
              });
              storage._component = component;

              if (!props.clientRect) return;

              popup = tippy("body", {
                getReferenceClientRect: () =>
                  props.clientRect?.() || new DOMRect(),
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
              })[0];
              storage._popup = popup;
            },

            onUpdate: (props: SuggestionProps<string, MentionNodeAttrs>) => {
              const storage = this.editor.storage.mention as MentionStorage;
              storage._lastProps = props;
              component.updateProps({
                ...props,
                loading: storage.loading,
                error: storage.error,
              });
              if (props.clientRect) {
                storage._popup?.setProps({
                  getReferenceClientRect: () =>
                    props.clientRect?.() || new DOMRect(),
                });
              }
            },

            onKeyDown: ({ event }) => {
              const storage = this.editor.storage.mention as MentionStorage;
              if (event.key === "Escape") {
                storage._popup?.hide();
                return true;
              }
              return storage._component?.ref?.onKeyDown({ event });
            },

            onExit: () => {
              const storage = this.editor.storage.mention as MentionStorage;
              storage._popup?.destroy();
              component.destroy();
              // чистимо посилання
              const storage2 = this.editor.storage.mention as MentionStorage;
              storage2._component = null;
              storage2._popup = null;
              storage2._lastProps = null;
            },
          };
        },
      }),
    ];
  },
});

export type * from "./types";
