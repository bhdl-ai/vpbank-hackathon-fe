import { ActionIcon, AppShell, Group } from "@mantine/core"
import { useDisclosure, useDocumentTitle } from "@mantine/hooks"
import { IconMessageCircle, IconX } from "@tabler/icons-react"
import { Sidebar } from "./sidebar"
import { Link } from "react-router-dom"
import { ChatAside } from "./aside"

interface MainLayoutProps {
    title?: string
    sidebar?: boolean
    children?: React.ReactNode
}

export function MainLayout({
    title = "VPBank Hackathon",
    sidebar = true,
    children,
}: MainLayoutProps) {
    const [sidebarOpened, { open: openSidebar, close: closeSidebar }] =
        useDisclosure(false)
    const [chatOpened, { toggle: toggleChat }] = useDisclosure(true)

    useDocumentTitle(title)

    return (
        <>
            <AppShell
                header={{ height: 60 }}
                navbar={{
                    width: 300,
                    breakpoint: "sm",
                    collapsed: { desktop: !sidebarOpened, mobile: true },
                }}
                aside={{
                    width: 500,
                    breakpoint: "md",
                    collapsed: { desktop: !chatOpened, mobile: true },
                }}
                padding="md"
                className="h-full"
            >
                <AppShell.Header>
                    <Group h="100%" px="md">
                        <Link to="/">This is LOGO</Link>
                    </Group>
                </AppShell.Header>
                {sidebar && (
                    <Sidebar
                        openSidebar={openSidebar}
                        closeSidebar={closeSidebar}
                    />
                )}
                <AppShell.Main ml={60} className="h-full">
                    {children}
                </AppShell.Main>
                <AppShell.Aside p="md">
                    <div className="absolute -left-8 rounded-l-xl overflow-hidden">
                        <ActionIcon
                            variant="filled"
                            radius={0}
                            aria-label="Settings"
                            onClick={toggleChat}
                            size={32}
                        >
                            {chatOpened ? (
                                <IconX size={20} />
                            ) : (
                                <IconMessageCircle size={20} />
                            )}
                        </ActionIcon>
                    </div>
                    <ChatAside />
                </AppShell.Aside>
            </AppShell>
        </>
    )
}

export default MainLayout
