import React from "react"
import ReactDOM from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { Toaster } from 'react-hot-toast';


import "./styles/global.css"
import "@mantine/core/styles.css"
import "reactflow/dist/style.css"

import Home from "./pages"
import DiagramPage from "./pages/diagram"
import { ReactFlowProvider } from "reactflow"
import DiagramLayout from "./pages/diagram/layout"

const queryClient = new QueryClient()

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/diagram",
        element: <DiagramLayout />,
        children: [
            {
                index: true,
                element: <DiagramPage />,
            },
        ],
    },
])

ReactDOM.createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <MantineProvider>
            <ModalsProvider>
                <ReactFlowProvider>
                    <RouterProvider router={router} />
                    <Toaster />
                </ReactFlowProvider>
            </ModalsProvider>
        </MantineProvider>
    </QueryClientProvider>
)
