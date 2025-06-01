'use client'

import { useState } from 'react'

export const useDisclosure = (defaultValue: boolean = false) => {
	const [isOpen, setIsOpen] = useState(defaultValue)

	const open = () => setIsOpen(true)
	const close = () => setIsOpen(false)
	const toggle = () => setIsOpen((prev) => !prev)

	return { isOpen, open, close, toggle, setIsOpen }
}