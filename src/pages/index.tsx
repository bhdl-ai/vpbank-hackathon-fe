import { motion } from "framer-motion"
import React, { useMemo } from "react"
import { AuroraBackground } from "../components/ui/aurora-background"
import { useNavigate } from "react-router-dom"
import { PlaceholdersAndVanishInput } from "../components/ui/placeholders-and-vanish-input"

export default function Home() {
    const placeholders = useMemo(
        () => [
            "How to create a Netflix-like website",
            "How to build a chat application",
            "How to create a social media platform",
            "How to build a banking application",
        ],
        []
    )

    const navigate = useNavigate()
    return (
        <AuroraBackground>
            <motion.div
                initial={{ opacity: 0.0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                }}
                className="relative flex flex-col gap-4 items-center justify-center px-4"
            >
                <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
                    VPBank Hackathon <br/> Team 100 - BHDL
                </div>
                {/* <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
                    And this, is chemical burn.
                </div> */}
                <PlaceholdersAndVanishInput
                    placeholders={placeholders}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        console.log(e.target.value)
                    }
                    onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                        e.preventDefault()
                        navigate("/diagram")
                    }}
                />
            </motion.div>
        </AuroraBackground>
    )
}
