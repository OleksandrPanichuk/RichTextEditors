'use client'

import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from '@heroui/react'
import { IconLink, IconTrash } from '@tabler/icons-react'
import { forwardRef, useImperativeHandle, useState } from 'react'

interface LinkDialogProps {
    onSetLink: (url: string, text?: string) => void
    onRemoveLink: () => void
    initialUrl?: string
    initialText?: string
    hasExistingLink?: boolean
}

export interface LinkDialogRef {
    open: () => void
    close: () => void
}

export const LinkDialog = forwardRef<LinkDialogRef, LinkDialogProps>(
    (
        {
            onSetLink,
            onRemoveLink,
            initialUrl = '',
            initialText = '',
            hasExistingLink = false,
        },
        ref,
    ) => {
        const { isOpen, onOpen, onClose } = useDisclosure()
        const [url, setUrl] = useState(initialUrl)
        const [text, setText] = useState(initialText)

        useImperativeHandle(
            ref,
            () => ({
                open: () => {
                    // Reset to current values when opening
                    setUrl(initialUrl)
                    setText(initialText)
                    onOpen()
                },
                close: onClose,
            }),
            [initialUrl, initialText, onOpen, onClose],
        )

        const handleSubmit = () => {
            if (url.trim()) {
                onSetLink(url.trim(), text.trim() || undefined)
                onClose()
            }
        }

        const handleRemove = () => {
            onRemoveLink()
            onClose()
        }

        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
            }
        }

        return (
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                placement="center"
                classNames={{
                    base: 'bg-neutral-800 border border-neutral-700',
                    header: 'border-b border-neutral-700',
                    footer: 'border-t border-neutral-700',
                }}
            >
                <ModalContent>
                    <ModalHeader className="flex items-center gap-2">
                        <IconLink size={16} />
                        {hasExistingLink ? 'Edit Link' : 'Add Link'}
                    </ModalHeader>
                    <ModalBody className="py-4">
                        {' '}
                        <div className="space-y-3">
                            <Input
                                size="sm"
                                label="URL"
                                placeholder="https://example.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                classNames={{
                                    input: 'bg-neutral-900 text-neutral-100',
                                    inputWrapper:
                                        'bg-neutral-900 border-neutral-600 data-[focus=true]:border-primary',
                                }}
                            />
                            {!hasExistingLink && (
                                <Input
                                    size="sm"
                                    label="Link Text (optional)"
                                    placeholder="Enter display text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    classNames={{
                                        input: 'bg-neutral-900 text-neutral-100',
                                        inputWrapper:
                                            'bg-neutral-900 border-neutral-600 data-[focus=true]:border-primary',
                                    }}
                                />
                            )}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="flex items-center justify-between w-full">
                            {' '}
                            <div>
                                {hasExistingLink && (
                                    <Button
                                        size="sm"
                                        color="danger"
                                        variant="light"
                                        onPress={handleRemove}
                                        startContent={<IconTrash size={14} />}
                                    >
                                        Remove Link
                                    </Button>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    color="primary"
                                    onPress={handleSubmit}
                                    isDisabled={!url.trim()}
                                >
                                    {hasExistingLink ? 'Update' : 'Add'} Link
                                </Button>
                            </div>
                        </div>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        )
    },
)

LinkDialog.displayName = 'LinkDialog'
