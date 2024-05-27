import { initialEdges } from "@/edges"
import { initialNodes, nodeTypes } from "@/nodes"
import { Vertex } from "@/type/diagram"
import { SystemType, WSEvent } from "@/type/ws_data"
import { WSClient } from "@/ws/client"
import { title } from "process"
import { Node, Edge } from "reactflow"
import { convertIconName } from "@/utils/aws-icon"

export class DiagramManager {
    public nodes: Node<any>[] = []
    public edges: Edge<any>[] = []
    public subGraphs: Node<any>[] = [] // Add this line
    public selectedNodes: Node<any>[] = []
    public isGenerating: boolean = false
    public needRerender: boolean = false
    public comment: string = ""
    public mermaid: string = ""
    public nameplate: string = ""
    public userCounter: number = 0
    public terraform: string = ""

    private onUserCounterChangeHandlers: ((count: number) => void)[] = []
    private onRoomInfoHandlers: ((nameplate: string) => void)[] = []
    private onCommentChangeHandlers: ((comment: string) => void)[] = []
    private onDoneHandlers: (() => void)[] = []
    private onMermaidHandlers: ((mermaid: string) => void)[] = []
    private onTerraformHandlers: ((terraform: string) => void)[] = []
    private renderFunc: () => void
    private intervalTime: number = 0.5 * 1000
    public interval: NodeJS.Timeout | null = null
    private started: boolean = false

    private handleAWSChatCallback: () => void;

    public setHandleAWSChatCallback(callback: () => void) {
        this.handleAWSChatCallback = callback;
    }

    private ws: WSClient

    constructor() {
        this.ws = new WSClient()

        this.ws.on(WSEvent.SetTerraformAWS, (data: string) => {
            this.terraform = data
            if (this.onTerraformHandlers) {
                this.onTerraformHandlers.forEach(handler => {
                    handler(this.terraform)
                })
            }
        })

        this.ws.on(WSEvent.UserJoined, (uid: string) => {
            console.info("user joined", uid)
            this.userCounter++
            if (this.onUserCounterChangeHandlers) {
                this.onUserCounterChangeHandlers.forEach(handler => {
                    handler(this.userCounter)
                })
            }
        })

        this.ws.on(WSEvent.UserLeave, (uid: string) => {
            console.info("user leave", uid)
            this.userCounter--
            if (this.onUserCounterChangeHandlers) {
                this.onUserCounterChangeHandlers.forEach(handler => {
                    handler(this.userCounter)
                })
            }
        })

        this.ws.on(WSEvent.RoomInfo, (data: string) => {
            this.nameplate = data
            if (this.onRoomInfoHandlers) {
                this.onRoomInfoHandlers.forEach(handler => {
                    handler(data)
                })
            }
        })

        this.ws.on(WSEvent.AddNode, (data: any) => {
            this.needRerender = true
            this.nodes.push({
                id: data.id,
                type: "common",
                data: {
                    label: data.text,
                },
                position: data.position,
                // parentNode: data.sub_graph,
            });
        });

        this.ws.on(WSEvent.AddLink, (data: any) => {
            this.needRerender = true
            this.edges.push({
                id: data.id,
                source: data.from_id,
                target: data.to_id,
                data: {
                    label: data.text,
                }
            });
        });

        this.ws.on(WSEvent.AddNodeAWS, (data: any) => {
            this.needRerender = true
            this.nodes.push({
                id: data.id,
                type: "common-aws",
                data: {
                    label: data.text,
                    icon: convertIconName(data.icon)
                },
                position: data.position,
                // parentNode: data.sub_graph,
            });
        });

        this.ws.on(WSEvent.AddLinkAWS, (data: any) => {
            this.needRerender = true
            this.edges.push({
                id: data.id,
                source: data.from_id,
                target: data.to_id,
                data: {
                    label: data.text,
                }
            });
        });

        // this.ws.on(WSEvent.SetNodePosition, (data: any) => {
        // 	this.needRerender = true;
        // 	this.isNeedGenLayout = false;
        //     const node = this.nodes.find(n => n.id === data.id);
        //     if (node) {
        //         node.position = data.position;
        //     }
        // });

        this.ws.on(WSEvent.Reset, (data: any) => {
            this.clearData()
        })

        this.ws.on(WSEvent.SetComment, (data: any) => {
            this.comment = data

            if (this.onCommentChangeHandlers) {
                this.onCommentChangeHandlers.forEach(handler => {
                    handler(data)
                })
            }
        });

        this.ws.on(WSEvent.SetCommentAWS, (data: any) => {
            this.comment = data;

            if (this.handleAWSChatCallback) {
                this.handleAWSChatCallback();
            }

            if (this.onCommentChangeHandlers) {
                this.onCommentChangeHandlers.forEach(handler => {
                    handler(data)
                })
            }
        });


        // this.ws.on(WSEvent.AddSubGraph, (data: any) => {
        //     this.needRerender = true;
        //     this.subGraphs.push({ // Change from nodes to subGraphs
        //         id: data.id,
        //         type: 'group',
        //         data: {
        //             label: data.text,
        //         },
        //         position: data.position,
        //     });
        // });

        this.ws.on(WSEvent.Done, () => {
            this.started = true
            // clear interval
            if (this.interval) {
                clearInterval(this.interval)
            }

            if (this.renderFunc) {
                console.log("last render")
                this.needRerender = true
                this.renderFunc()
            }

            if (this.onDoneHandlers) {
                this.onDoneHandlers.forEach(handler => {
                    handler()
                })
            }
        });

        this.ws.on(WSEvent.Mermaid, (data: any) => {
            this.mermaid = data

            if (this.onMermaidHandlers) {
                this.onMermaidHandlers.forEach(handler => {
                    handler(data)
                })
            }
        })


        this.ws.on(WSEvent.ResetAWS, () => {
            this.clearData()
        })
    }

    public joinRoom(nameplate: string) {
        this.ws.joinRoom(nameplate)
    }

    public start(query: string) {
        this.isGenerating = true
        // set interval fror renderFunc to update diagram
        this.resetInterval()
        if (this.started) {
            this.ws.sendEditPrompt(query, this.selectedVertex().map(e => ({ id: e.id, text: e.data.label })))
        } else {
            this.ws.sendPrompt(query)
        }
        this.started = true
    }

    public genAWS() {
        this.isGenerating = true
        this.resetInterval()
        this.ws.generateIcon(SystemType.AWS)
    }

    public genTerraform() {
        if (!this.mermaid) return
        this.ws.generateTerraform(SystemType.AWS)
    }

    public edit(query: string) {
        this.isGenerating = true
        this.resetInterval()
        const vertex: Vertex[] = this.selectedVertex().
            map(node => ({
                position: { x: 0, y: 0 },
                id: node.id,
                text: node.data.label
            }))
        this.ws.sendEditPrompt(query, vertex)
    }

    public onTerraform(handler: (terraform: string) => void) {
        this.onTerraformHandlers.push(handler)
    }

    public onRoomInfo(handler: (nameplate: string) => void) {
        this.onRoomInfoHandlers.push(handler)
    }

    public onCommentChange(handler: (comment: string) => void) {
        this.onCommentChangeHandlers.push(handler)
    }

    public onDone(handler: () => void) {
        this.onDoneHandlers.push(handler)
    }

    public onMermaid(handler: (mermaid: string) => void) {
        this.onMermaidHandlers.push(handler)
    }

    public onUserCounterChange(handler: (count: number) => void) {
        if (this.onUserCounterChangeHandlers) {
            this.onUserCounterChangeHandlers.push(handler)
        }
    }


    public setInterval(renderFunc: () => void, intervalTime: number) {
        this.renderFunc = renderFunc
        this.intervalTime = intervalTime
    }

    public setSelectedNodes(nodes: Node<any>[]) {
        this.selectedNodes = nodes
    }


    // private methods
    private clearData() {
        this.nodes.length = 0
        this.edges.length = 0
        this.subGraphs.length = 0
    }

    private selectedVertex(): Node<any>[] {
        return this.selectedNodes.reduce((acc, node) => {
            switch (node.type) {
                default:
                    return [...acc, node]
                case 'group':
                    return [...acc, ...this.nodeInGroup(node.id)]
            }
        }, [])
    }

    private resetInterval() {
        if (this.renderFunc) {
            if (this.interval) {
                clearInterval(this.interval)
            }

            this.interval = setInterval(this.renderFunc, this.intervalTime)
        }
    }

    private nodeInGroup(group: string) {
        let nodes = this.nodes.filter(node => node.parentNode === group)
        // nested child group
        let subGroups = this.subGraphs.filter(node => node.parentNode === group)
        let childNodes = subGroups.reduce((acc, node) => {
            let childNodes = this.nodeInGroup(node.id)
            return [...acc, ...childNodes]
        }, [])

        return [...nodes, ...childNodes]
    }
}
