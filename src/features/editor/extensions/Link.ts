import TiptapLink from '@tiptap/extension-link'

export const Link = TiptapLink.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: 'https',
    protocols: ['http', 'https'],
    isAllowedUri: (url, ctx) => {
        try {
            const parsedUrl = url.includes(':')
                ? new URL(url)
                : new URL(`${ctx.defaultProtocol}://${url}`)

            if (!ctx.defaultValidate(parsedUrl.href)) {
                return false
            }

            const disallowedProtocols = ['ftp', 'file', 'mailto']
            const protocol = parsedUrl.protocol.replace(':', '')

            if (disallowedProtocols.includes(protocol)) {
                return false
            }

            const allowedProtocols = ctx.protocols.map((p) =>
                typeof p === 'string' ? p : p.scheme,
            )

            if (!allowedProtocols.includes(protocol)) {
                return false
            }

            const disallowedDomains: string[] = []
            const domain = parsedUrl.hostname

            if (disallowedDomains.includes(domain)) {
                return false
            }

            // all checks have passed
            return true
        } catch {
            return false
        }
    },
    shouldAutoLink: (url) => {
        try {
            const parsedUrl = url.includes(':')
                ? new URL(url)
                : new URL(`https://${url}`)

            const disallowedDomains: string[] = []
            const domain = parsedUrl.hostname

            return !disallowedDomains.includes(domain)
        } catch {
            return false
        }
    },
})
