'use client'
import {
    Button,
    Chip,
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Tooltip,
    useDisclosure,
} from '@heroui/react'
import {
    IconFile,
    IconFileText,
    IconPaperclip,
    IconPhoto,
    IconX,
} from '@tabler/icons-react'
import { useRef, useState } from 'react'

export interface AttachedFile {
    id: string
    file: File
    preview?: string
    type: 'image' | 'document' | 'other'
}

interface AttachmentsPreviewProps {
    attachedFiles: AttachedFile[]
    onRemoveFile: (id: string) => void
}

interface AttachmentButtonProps {
    onFileUpload: (files: AttachedFile[]) => void
    attachedFiles: AttachedFile[]
}

interface AttachmentsProps {
    attachedFiles: AttachedFile[]
    onFileUpload: (files: AttachedFile[]) => void
    onRemoveFile: (id: string) => void
}

// File preview component
export const AttachmentsPreview = ({
    attachedFiles,
    onRemoveFile,
}: AttachmentsPreviewProps) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null)
    const { isOpen, onOpen, onClose } = useDisclosure()

    const getFileIcon = (file: AttachedFile) => {
        switch (file.type) {
            case 'image':
                return <IconPhoto size={16} />
            case 'document':
                return <IconFileText size={16} />
            default:
                return <IconFile size={16} />
        }
    }

    const handleImageClick = (preview: string) => {
        setSelectedImage(preview)
        onOpen()
    }

    const handleModalClose = () => {
        setSelectedImage(null)
        onClose()
    }

    if (attachedFiles.length === 0) {
        return null
    }

    return (
        <>
            {/* Attached Files Preview */}
            <div className="px-3 pt-3 pb-2 border-b border-neutral-700">
                <div className="flex flex-wrap gap-2">
                    {attachedFiles.map((file) => (
                        <div key={file.id} className="relative">
                            {file.type === 'image' && file.preview ? (
                                <div className="relative">
                                    <Image
                                        src={file.preview}
                                        alt={file.file.name}
                                        className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() =>
                                            handleImageClick(file.preview!)
                                        }
                                    />
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="solid"
                                        color="danger"
                                        className="absolute z-50 -top-1 -right-1 min-w-4 h-4 w-4"
                                        onPress={() => onRemoveFile(file.id)}
                                    >
                                        <IconX size={10} />
                                    </Button>
                                </div>
                            ) : (
                                <Chip
                                    variant="flat"
                                    color="default"
                                    startContent={getFileIcon(file)}
                                    onClose={() => onRemoveFile(file.id)}
                                    className="max-w-[150px]"
                                >
                                    <span className="truncate text-xs">
                                        {file.file.name}
                                    </span>
                                </Chip>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Image Modal */}
            <Modal
                isOpen={isOpen}
                onClose={handleModalClose}
                size="3xl"
                classNames={{
                    backdrop: 'bg-black/80',
                    base: 'max-w-none w-auto h-auto max-h-[90vh]',
                    body: 'p-0',
                    header: 'border-b border-neutral-700',
                }}
            >
                <ModalContent>
                    <ModalHeader className="flex items-center justify-between">
                        <span className="text-neutral-100 text-lg font-medium">
                            Image Preview
                        </span>
                        <Button
                            isIconOnly
                            size="sm"
                            variant="ghost"
                            onPress={handleModalClose}
                            className="h-8 w-8"
                        >
                            <IconX size={16} />
                        </Button>
                    </ModalHeader>
                    <ModalBody>
                        {selectedImage && (
                            <div className="flex items-center justify-center p-4">
                                <Image
                                    src={selectedImage}
                                    alt="Preview"
                                    className="max-w-full max-h-[70vh] object-contain rounded-lg"
                                    removeWrapper
                                />
                            </div>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    )
}

// Attachment button component
export const AttachmentButton = ({
    onFileUpload,
    attachedFiles,
}: AttachmentButtonProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || [])
        const newAttachedFiles: AttachedFile[] = []

        files.forEach((file) => {
            const id = crypto.randomUUID()
            let type: AttachedFile['type'] = 'other'

            if (file.type.startsWith('image/')) {
                type = 'image'
                const reader = new FileReader()
                reader.onload = (e) => {
                    const updatedFile = {
                        id,
                        file,
                        type,
                        preview: e.target?.result as string,
                    }
                    // Update the existing file with preview
                    const updatedFiles = [...attachedFiles, ...newAttachedFiles]
                    const index = updatedFiles.findIndex((f) => f.id === id)
                    if (index !== -1) {
                        updatedFiles[index] = updatedFile
                        onFileUpload(updatedFiles)
                    }
                }
                reader.readAsDataURL(file)
            } else if (
                file.type.includes('pdf') ||
                file.type.includes('document') ||
                file.type.includes('text') ||
                file.type.includes('presentation')
            ) {
                type = 'document'
            }

            newAttachedFiles.push({ id, file, type })
        })

        onFileUpload([...attachedFiles, ...newAttachedFiles])

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <>
            <Tooltip content="Attach files">
                <Button
                    isIconOnly
                    size="sm"
                    variant="ghost"
                    color="default"
                    onPress={() => fileInputRef.current?.click()}
                    className="h-6 w-6 min-w-6"
                >
                    <IconPaperclip size={14} />
                </Button>
            </Tooltip>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="*/*"
                onChange={handleFileUpload}
                className="hidden"
            />
        </>
    )
}

// Combined Attachments component (deprecated)
export const Attachments = ({
    attachedFiles,
    onFileUpload,
    onRemoveFile,
}: AttachmentsProps) => {
    return (
        <>
            <AttachmentsPreview
                attachedFiles={attachedFiles}
                onRemoveFile={onRemoveFile}
            />
            <AttachmentButton
                onFileUpload={onFileUpload}
                attachedFiles={attachedFiles}
            />
        </>
    )
}

// Utility hook for managing attachments
export const useAttachments = () => {
    const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])

    const handleFileUpload = (files: AttachedFile[]) => {
        setAttachedFiles(files)
    }

    const removeFile = (id: string) => {
        setAttachedFiles((prev) => prev.filter((f) => f.id !== id))
    }

    const clearAll = () => {
        setAttachedFiles([])
    }

    return {
        attachedFiles,
        handleFileUpload,
        removeFile,
        clearAll,
    }
}
