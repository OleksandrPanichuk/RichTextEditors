import { Card, CardBody, Spinner } from '@heroui/react'
import { IconFileText } from '@tabler/icons-react'
import { MentionNodeAttrs } from '@tiptap/extension-mention'
import { SuggestionProps } from '@tiptap/suggestion'
import {
    forwardRef,
    KeyboardEvent,
    useEffect,
    useImperativeHandle,
    useState,
} from 'react'
import { MentionItem } from '.'

interface IProps extends SuggestionProps<string, MentionNodeAttrs> {
    loading?: boolean
    error?: boolean
}

// Styled MentionList component with HeroUI design system
export const MentionList = forwardRef(
    ({ loading, error, ...props }: IProps, ref) => {
        const [selectedIndex, setSelectedIndex] = useState(0)

        const items =
            (props.editor.storage.mention.items as MentionItem[]) || props.items

        const selectItem = (index: number) => {
            const item = items[index]

            if (item) {
                props.command({ id: item.id })
            }
        }

        const upHandler = () => {
            setSelectedIndex(
                (selectedIndex + props.items.length - 1) % props.items.length,
            )
        }

        const downHandler = () => {
            setSelectedIndex((selectedIndex + 1) % props.items.length)
        }

        const enterHandler = () => {
            selectItem(selectedIndex)
        }

        useEffect(() => setSelectedIndex(0), [props.items])

        useImperativeHandle(ref, () => ({
            onKeyDown: ({ event }: { event: KeyboardEvent }) => {
                if (event.key === 'ArrowUp') {
                    upHandler()
                    return true
                }

                if (event.key === 'ArrowDown') {
                    downHandler()
                    return true
                }

                if (event.key === 'Enter') {
                    enterHandler()
                    return true
                }

                return false
            },
        }))

        return (
            <Card
                className="max-h-80 min-w-64 shadow-xl backdrop-blur-sm border border-divider bg-content2"
                shadow="lg"
            >
                <CardBody className="p-0">
                    {loading && (
                        <div className="flex items-center justify-center py-4 px-3 text-content2-foreground">
                            <Spinner
                                size="sm"
                                color="default"
                                className="mr-2"
                            />
                            <span className="text-sm">Loading...</span>
                        </div>
                    )}
                    {!loading && !error && items.length ? (
                        <div className="py-1">
                            {items.map((item, index) => (
                                <div
                                    key={index}
                                    className={`
                                        px-3 py-2 cursor-pointer transition-all duration-150 ease-out
                                        ${
                                            index === selectedIndex
                                                ? 'bg-primary-100 text-primary-900 shadow-sm border-l-2 border-primary'
                                                : 'text-content2-foreground hover:bg-content3'
                                        }
                                        focus:outline-none focus:bg-primary-100 focus:text-primary-900
                                        active:bg-primary-200
                                    `.trim()}
                                    onClick={() => selectItem(index)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                >
                                    {' '}
                                    <div className="flex items-center">
                                        <div
                                            className={`
                                                w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-3
                                                ${
                                                    index === selectedIndex
                                                        ? 'bg-primary-500 text-white'
                                                        : 'bg-content3 text-content3-foreground'
                                                }
                                            `.trim()}
                                        >
                                            {(item.username || item.label)
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm">
                                                @{item.username || item.label}
                                            </span>
                                            {item.fullName && (
                                                <span className="text-xs text-content2-foreground/70">
                                                    {item.fullName}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !loading && (
                            <div className="flex items-center justify-center py-6 px-3 text-content2-foreground">
                                <IconFileText size={20} className="mr-2" />
                                <span className="text-sm">
                                    No results found
                                </span>
                            </div>
                        )
                    )}
                </CardBody>
            </Card>
        )
    },
)
MentionList.displayName = 'MentionList'
