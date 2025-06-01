'use client'
import { useDisclosure } from '@/hooks'
import { Button, Popover, PopoverContent, PopoverTrigger } from '@heroui/react'
import Picker, { EmojiClickData, Theme } from 'emoji-picker-react'
import { useState } from 'react'

interface IEmojiPickerProps {
    onChange?: (emoji: string) => void
    value?: string
}

// TODO: test open state

export const EmojiPicker = ({ onChange, value }: IEmojiPickerProps) => {
    const [emoji, setEmoji] = useState(value ?? '🙂')
    const { isOpen, close, toggle } = useDisclosure()

    const handleSelect = (data: EmojiClickData) => {
        setEmoji(data.emoji)
        onChange?.(data.emoji)
        close()
    }
    return (
        <Popover isOpen={isOpen} onClose={close} onOpenChange={toggle}>
            <PopoverTrigger>
                <Button
                    className="h-6 w-6 min-w-6 text-sm"
                    isIconOnly
                    size="sm"
                    variant="ghost"
                    color="default"
                >
                    {emoji}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 max-h-[21.875rem]">
                <Picker
                    theme={Theme.DARK}
                    className="!w-[17.5rem] xs:!w-[21.875rem]"
                    onEmojiClick={handleSelect}
                />
            </PopoverContent>
        </Popover>
    )
}
