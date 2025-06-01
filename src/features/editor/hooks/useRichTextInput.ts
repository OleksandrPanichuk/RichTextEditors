import {
    ColorHighlighter,
    Link,
    Mention,
    ShikiCodeBlockComponent,
    SmilieReplacer,
} from '@/features/editor'
import { ReactNodeViewRenderer, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { CodeBlockShiki } from 'tiptap-extension-code-block-shiki'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { Highlight } from '@tiptap/extension-highlight'
import { Typography } from '@tiptap/extension-typography'
import { Placeholder } from '@tiptap/extension-placeholder'

export const useRichTextInput = () => {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                codeBlock: false,
                code: {
                    HTMLAttributes: {
                        class: 'border border-neutral-700 text-[#e8912d] bg-[#E8E8E80A] py-0.5 px-1 break-all rounded-sm block w-fit my-1 ',
                    },
                },
                blockquote: {
                    HTMLAttributes: {
                        class: 'relative pl-4 my-3 before:absolute before:left-0 before:h-full before:w-[3px] before:bg-[#B9BABD] before:rounded-xl',
                    },
                },
            }),
            Typography,
            Placeholder.configure({
                // TODO: change to actual channel name
                placeholder: 'Message #general',
            }),
            SmilieReplacer,
            Highlight,
            ColorHighlighter,
            Underline,
            Subscript,
            Link,
            Superscript,
            CodeBlockShiki.extend({
                addNodeView() {
                    // @ts-expect-error fucking tiptap types
                    return ReactNodeViewRenderer(ShikiCodeBlockComponent)
                },
            }).configure({
                defaultTheme: 'github-dark-dimmed',
                defaultLanguage: 'tsx',
            }),
            Mention.configure({
                HTMLAttributes: {
                    class: 'mention',
                },
                suggestion: {
                    items: () => {
                        return [
                            {
                                id: 'john_doe',
                                label: 'John Doe',
                            },
                            {
                                id: 'jane_doe',
                                label: 'Jane Doe',
                            },
                            {
                                id: 'john_smith',
                                label: 'John Smith',
                            },
                            {
                                id: 'jane_smith',
                                label: 'Jane Smith',
                            },
                        ]
                    },
                },
            }),
        ],
    })

    return editor
}
