'use client'
import { EditorProvider, useRichTextInput } from '@/features/editor'
import { EmojiPicker } from '@/features/shared/components'
import { Button, Card, CardBody, Tooltip } from '@heroui/react'
import { IconEdit, IconEye, IconSend } from '@tabler/icons-react'
import { EditorContent } from '@tiptap/react'
import { useCallback, useEffect, useState } from 'react'
import {
    AttachmentButton,
    AttachmentsPreview,
    useAttachments,
} from './Attachments'
import './styles.scss'
import { Toolbar } from './Toolbar'

export const RichTextInput = () => {
    const editor = useRichTextInput()
    const [isEditorVisible, setIsEditorVisible] = useState(true)
    const { attachedFiles, handleFileUpload, removeFile, clearAll } =
        useAttachments()

    const handleEmojiSelect = (emoji: string) => {
        if (editor) {
            editor.chain().focus().insertContent(emoji).run()
        }
    }

    const handleSendMessage = useCallback(() => {
        if (!editor) return

        const content = editor.getHTML()
        const textContent = editor.getText().trim()

        // Don't send empty messages
        if (!textContent && attachedFiles.length === 0) return

        // Extract mentioned user IDs from the editor's JSON document
        const mentions: string[] = []
        const doc = editor.getJSON()

        const extractMentions = (node: Record<string, unknown>) => {
            if (
                node.type === 'mention' &&
                typeof node.attrs === 'object' &&
                node.attrs &&
                'id' in node.attrs
            ) {
                const id = (node.attrs as { id?: string }).id
                if (typeof id === 'string') {
                    mentions.push(id)
                }
            }
            if (Array.isArray(node.content)) {
                node.content.forEach((child) => {
                    if (typeof child === 'object' && child !== null) {
                        extractMentions(child as Record<string, unknown>)
                    }
                })
            }
        }

        if (Array.isArray(doc.content)) {
            doc.content.forEach((node) => {
                if (typeof node === 'object' && node !== null) {
                    extractMentions(node as Record<string, unknown>)
                }
            })
        }

        // TODO: Implement actual send logic here
        console.log('Sending message:', {
            content,
            attachedFiles,
            mentions,
        })

        // Clear the editor and attachments after sending
        editor.commands.clearContent()
        clearAll()
    }, [clearAll, editor, attachedFiles])

    // Global keyboard listener for Enter key
    useEffect(() => {
        const handleGlobalKeydown = (event: KeyboardEvent) => {
            // Only trigger if Enter is pressed and no modifier keys
            if (
                event.key !== 'Enter' ||
                event.shiftKey ||
                event.ctrlKey ||
                event.altKey ||
                event.metaKey
            ) {
                return
            }

            // Check if any input element is focused
            const activeElement = document.activeElement as HTMLElement
            const isInputFocused =
                activeElement &&
                (activeElement.tagName === 'INPUT' ||
                    activeElement.tagName === 'TEXTAREA' ||
                    activeElement.contentEditable === 'true' ||
                    activeElement.getAttribute('role') === 'textbox')

            // If no input is focused, send the message
            if (!isInputFocused) {
                event.preventDefault()
                handleSendMessage()
            }
        }

        document.addEventListener('keydown', handleGlobalKeydown)
        return () =>
            document.removeEventListener('keydown', handleGlobalKeydown)
    }, [handleSendMessage])

    if (!editor) {
        return (
            <Card className="w-full">
                <CardBody className="p-3">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-neutral-400 text-sm">
                            Loading...
                        </span>
                    </div>
                </CardBody>
            </Card>
        )
    }

    return (
        <EditorProvider editor={editor}>
            <Card className="w-full">
                <CardBody className="p-0">
                    {/* Attachments Preview */}
                    <AttachmentsPreview
                        attachedFiles={attachedFiles}
                        onRemoveFile={removeFile}
                    />

                    {/* Toolbar - Only show when editor is visible */}
                    {isEditorVisible && (
                        <div className="px-2 py-1 border-b border-neutral-700">
                            <Toolbar />
                        </div>
                    )}

                    {/* Editor Content */}
                    <div className="relative">
                        <div className="min-h-[40px] max-h-[120px] overflow-y-auto">
                            <EditorContent
                                editor={editor}
                                className="px-3 py-2 text-neutral-100 text-sm focus:outline-none"
                            />
                        </div>

                        {/* Send Button */}
                        <div className="absolute bottom-2 right-2">
                            <Button
                                isIconOnly
                                size="sm"
                                color="primary"
                                variant="solid"
                                className="h-6 w-6 min-w-6"
                                onPress={handleSendMessage}
                            >
                                <IconSend size={12} />
                            </Button>
                        </div>
                    </div>

                    {/* Footer with Toggle, Attachment, and Emoji buttons */}
                    <div className="px-3 py-2 border-t border-neutral-700 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Tooltip
                                content={
                                    isEditorVisible
                                        ? 'Hide toolbar'
                                        : 'Show toolbar'
                                }
                            >
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="ghost"
                                    color="default"
                                    onPress={() =>
                                        setIsEditorVisible(!isEditorVisible)
                                    }
                                    className="h-6 w-6 min-w-6"
                                >
                                    {isEditorVisible ? (
                                        <IconEye size={14} />
                                    ) : (
                                        <IconEdit size={14} />
                                    )}
                                </Button>
                            </Tooltip>

                            <AttachmentButton
                                onFileUpload={handleFileUpload}
                                attachedFiles={attachedFiles}
                            />

                            <EmojiPicker onChange={handleEmojiSelect} />
                        </div>

                        <div className="text-xs text-neutral-500">
                            {attachedFiles.length > 0 && (
                                <span>
                                    {attachedFiles.length} file
                                    {attachedFiles.length !== 1 ? 's' : ''}{' '}
                                    attached
                                </span>
                            )}
                        </div>
                    </div>
                </CardBody>
            </Card>
        </EditorProvider>
    )
}
