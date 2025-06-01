'use client'

import { useCurrentEditor } from '@/features/editor'
import { Button, Tooltip } from '@heroui/react'
import {
    IconBold,
    IconCode,
    IconFileCode,
    IconItalic,
    IconLink,
    IconList,
    IconListNumbers,
    IconQuote,
    IconStrikethrough,
    IconUnderline,
} from '@tabler/icons-react'
import { useRef } from 'react'
import { LinkDialog, type LinkDialogRef } from './LinkDialog'

// TODO: items that are not visible should be moved to a dropdown
export const Toolbar = () => {
    const { editor } = useCurrentEditor()
    const linkDialogRef = useRef<LinkDialogRef>(null)

    // Helper function to check if a format is active
    const isActive = (format: string, options?: Record<string, unknown>) => {
        return editor?.isActive(format, options) || false
    }

    const handleLinkClick = () => {
        if (!editor) return
        linkDialogRef.current?.open()
    }

    const handleSetLink = (url: string, text?: string) => {
        if (!editor) return

        const { from, to } = editor.state.selection
        const selectedText = editor.state.doc.textBetween(from, to, '')

        if (text && !selectedText) {
            // Insert new text with link
            editor
                .chain()
                .focus()
                .insertContent(`<a href="${url}">${text}</a>`)
                .run()
        } else {
            // Apply link to selected text or toggle existing link
            editor.chain().focus().toggleLink({ href: url }).run()
        }
    }

    const handleRemoveLink = () => {
        if (!editor) return
        editor.chain().focus().unsetLink().run()
    }

    return (
        <>
            <div className="flex flex-wrap items-center gap-0.5">
                <Tooltip content="Bold">
                    <Button
                        isIconOnly
                        size="sm"
                        variant={isActive('bold') ? 'solid' : 'ghost'}
                        color={isActive('bold') ? 'primary' : 'default'}
                        onPress={() =>
                            editor?.chain().focus().toggleBold().run()
                        }
                        className="h-6 w-6 min-w-6"
                    >
                        <IconBold size={12} />
                    </Button>
                </Tooltip>
                <Tooltip content="Italic">
                    <Button
                        isIconOnly
                        size="sm"
                        variant={isActive('italic') ? 'solid' : 'ghost'}
                        color={isActive('italic') ? 'primary' : 'default'}
                        onPress={() =>
                            editor?.chain().focus().toggleItalic().run()
                        }
                        className="h-6 w-6 min-w-6"
                    >
                        <IconItalic size={12} />
                    </Button>
                </Tooltip>
                <Tooltip content="Strike through">
                    <Button
                        isIconOnly
                        size="sm"
                        variant={isActive('strike') ? 'solid' : 'ghost'}
                        color={isActive('strike') ? 'primary' : 'default'}
                        onPress={() =>
                            editor?.chain().focus().toggleStrike().run()
                        }
                        className="h-6 w-6 min-w-6"
                    >
                        <IconStrikethrough size={12} />
                    </Button>
                </Tooltip>
                <Tooltip content="Underline">
                    <Button
                        isIconOnly
                        size="sm"
                        variant={isActive('underline') ? 'solid' : 'ghost'}
                        color={isActive('underline') ? 'primary' : 'default'}
                        onPress={() =>
                            editor?.chain().focus().toggleUnderline().run()
                        }
                        className="h-6 w-6 min-w-6"
                    >
                        <IconUnderline size={12} />
                    </Button>
                </Tooltip>

                <div className="w-px h-4 mx-1 bg-neutral-600" />

                <Tooltip content="Link">
                    <Button
                        isIconOnly
                        size="sm"
                        variant={isActive('link') ? 'solid' : 'ghost'}
                        color={isActive('link') ? 'primary' : 'default'}
                        onPress={handleLinkClick}
                        className="h-6 w-6 min-w-6"
                    >
                        <IconLink size={12} />
                    </Button>
                </Tooltip>
                <Tooltip content="Ordered list">
                    <Button
                        isIconOnly
                        size="sm"
                        variant={isActive('orderedList') ? 'solid' : 'ghost'}
                        color={isActive('orderedList') ? 'primary' : 'default'}
                        onPress={() =>
                            editor?.chain().focus().toggleOrderedList().run()
                        }
                        className="h-6 w-6 min-w-6"
                    >
                        <IconListNumbers size={12} />
                    </Button>
                </Tooltip>
                <Tooltip content="Bullet list">
                    <Button
                        isIconOnly
                        size="sm"
                        variant={isActive('bulletList') ? 'solid' : 'ghost'}
                        color={isActive('bulletList') ? 'primary' : 'default'}
                        onPress={() =>
                            editor?.chain().focus().toggleBulletList().run()
                        }
                        className="h-6 w-6 min-w-6"
                    >
                        <IconList size={12} />
                    </Button>
                </Tooltip>

                <div className="w-px h-4 mx-1 bg-neutral-600" />

                <Tooltip content="Quote">
                    <Button
                        isIconOnly
                        size="sm"
                        variant={isActive('blockquote') ? 'solid' : 'ghost'}
                        color={isActive('blockquote') ? 'primary' : 'default'}
                        onPress={() =>
                            editor?.chain().focus().toggleBlockquote().run()
                        }
                        className="h-6 w-6 min-w-6"
                    >
                        <IconQuote size={12} />
                    </Button>
                </Tooltip>
                <Tooltip content="Code">
                    <Button
                        isIconOnly
                        size="sm"
                        variant={isActive('code') ? 'solid' : 'ghost'}
                        color={isActive('code') ? 'primary' : 'default'}
                        onPress={() =>
                            editor?.chain().focus().toggleCode().run()
                        }
                        className="h-6 w-6 min-w-6"
                    >
                        <IconCode size={12} />
                    </Button>
                </Tooltip>
                <Tooltip content="Code block">
                    <Button
                        isIconOnly
                        size="sm"
                        variant={isActive('codeBlock') ? 'solid' : 'ghost'}
                        color={isActive('codeBlock') ? 'primary' : 'default'}
                        onPress={() =>
                            editor?.chain().focus().toggleCodeBlock().run()
                        }
                        className="h-6 w-6 min-w-6"
                    >
                        <IconFileCode size={12} />
                    </Button>
                </Tooltip>
            </div>

            <LinkDialog
                ref={linkDialogRef}
                onSetLink={handleSetLink}
                onRemoveLink={handleRemoveLink}
                initialUrl={editor?.getAttributes('link')?.href || ''}
                hasExistingLink={isActive('link')}
            />
        </>
    )
}
