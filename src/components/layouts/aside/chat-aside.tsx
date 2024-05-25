import { useDiagramManager } from "@/store/digaram-mananger-store"
import {
    ActionIcon,
    AppShell,
    Group,
    ScrollArea,
    Skeleton,
    Textarea,
} from "@mantine/core"
import { useListState } from "@mantine/hooks"
import { IconSend } from "@tabler/icons-react"
import { useRef, useState } from "react"

interface Message {
    role: string
    message: string
}

const ChatAside = () => {
    const diagramManager = useDiagramManager()
    const [conversation, handlers] = useListState<Message>([])
    const [chat, setChat] = useState<string>("")
    const [messaging, setMessaging] = useState<boolean>(false)

    const chatSectionViewport = useRef<HTMLDivElement>(null)

    const scrollBottom = () => {
        setTimeout(() => {
            chatSectionViewport.current!.scrollTo({
                top: chatSectionViewport.current!.scrollHeight,
                behavior: "smooth",
            })
        }, 100)
    }

    const handleChat = (prompt: string) => {
        diagramManager.start(prompt)
        scrollBottom()
    }

    return (
        <>
            <AppShell.Section
                grow
                component={ScrollArea}
                py={16}
                viewportRef={chatSectionViewport}
            >
                <ScrollArea>
                    {conversation.map((message, index) => (
                        <ChatUi key={index} {...message} />
                    ))}
                </ScrollArea>
            </AppShell.Section>
            <AppShell.Section>
                <Group pt={16} align="end">
                    <Textarea
                        className="grow"
                        placeholder="Chat with AI here"
                        autosize
                        minRows={1}
                        maxRows={10}
                        onChange={(e) => setChat(e.currentTarget.value)}
                        value={chat}
                        disabled={messaging}
                    />
                    <ActionIcon
                        aria-label="Send message"
                        size="lg"
                        onClick={() => handleChat(chat)}
                    >
                        <IconSend size={20} />
                    </ActionIcon>
                </Group>
            </AppShell.Section>
        </>
    )
}

const ChatUi = ({ role, message }: Message) => {
    if (role === "bot") {
        return (
            <div className="chat chat-start">
                <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                        <img
                            alt="Tailwind CSS chat bubble component"
                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                        />
                    </div>
                </div>
                <div className="chat-header">Obi-Wan Kenobi</div>
                <div className="chat-bubble chat-bubble-info flex items-center">
                    {message === "l" ? (
                        <Skeleton height={20} width={70} radius="sm" />
                    ) : (
                        message
                    )}
                </div>
            </div>
        )
    } else {
        return (
            <div className="chat chat-end pr-4">
                <div className="chat-header">You</div>
                <div className="chat-bubble chat-bubble-info">{message}</div>
            </div>
        )
    }
}

export default ChatAside
