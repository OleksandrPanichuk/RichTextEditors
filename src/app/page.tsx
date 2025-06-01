'use client'

import { RichTextInput } from '@/features/editor'

export default function Home() {
    return (
        <main className=" bg-neutral-900">
            <div className="max-w-2xl mx-auto py-8 flex flex-col min-h-screen">
                <div className="text-center mb-6 flex-1">
                    <h1 className="text-xl font-semibold text-white mb-1">
                        Chat Message Editor
                    </h1>
                    <p className="text-neutral-400 text-sm">
                        Rich text input for chat messages
                    </p>
                </div>
                <div>
                    <RichTextInput />
                </div>
            </div>
        </main>
    )
}
