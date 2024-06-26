import { Link, SubGraph, Vertex } from "./diagram"

export enum SystemType {
    AWS = 'AWS',
}

export enum WSEvent {
    // info
    Error = 'ERROR',
    UserJoined = "JOIN",
    UserLeave = "LEAVE",
    Lock = "LOCK",
    Done = "DONE",
    RoomInfo = 'ROOM_INFO',
    Reset = "RESET",

    // user action
    Prompt = 'PROMPT',
    PromptEdit = 'PROMPT_EDIT',
    GenerateIcon = 'GENERATE_ICON',
    JoinRoom = 'JOIN_ROOM',
    GenerateCode = 'GENERATE_CODE',
    Ping = 'PING',
    GenerateDrawIO = 'GENERATE_DRAWIO',
    GenerateAnsible = 'GENERATE_ANSIBLE',


    // server diagram response
    Mermaid = "MERMAID",
    AddNode = 'ADD_NODE',
    AddLink = 'ADD_LINK',
    AddSubGraph = 'ADD_SUB_GRAPH',
    ChangeNode = 'CHANGE_NODE',
    ChangeLink = 'CHANGE_LINK',
    ChangeSubGraph = 'CHANGE_SUB_GRAPH',
    DelNode = 'DEL_NODE',
    DelLink = 'DEL_LINK',
    DelSubGraph = 'DEL_SUB_GRAPH',
    SetNodePosition = 'SET_NODE_POSITION',
    SetComment = 'SET_COMMENT',
    SetTerraform = 'SET_TERRAFORM',
    SetDrawIO = "SET_DRAWIO",
    SetAnsible = "SET_ANSIBLE",

    // server diagram with icon response
    MermaidAWS = "MERMAID_AWS",
    AddNodeAWS = 'ADD_NODE_AWS',
    AddLinkAWS = 'ADD_LINK_AWS',
    AddSubGraphAWS = 'ADD_SUB_GRAPH_AWS',
    ChangeNodeAWS = 'CHANGE_NODE_AWS',
    ChangeLinkAWS = 'CHANGE_LINK_AWS',
    ChangeSubGraphAWS = 'CHANGE_SUB_GRAPH_AWS',
    DelNodeAWS = 'DEL_NODE_AWS',
    DelLinkAWS = 'DEL_LINK_AWS',
    DelSubGraphAWS = 'DEL_SUB_GRAPH_AWS',
    SetNodePositionAWS = 'SET_NODE_POSITION_AWS',
    SetCommentAWS = 'SET_COMMENT_AWS',
    ResetAWS = 'RESET_AWS',
    SetTerraformAWS = 'SET_TERRAFORM_AWS',
    SetAnsibleAWS = 'SET_ANSIBLE_AWS',
}

export type MessageData = string | Prompt | Vertex | Link | SubGraph | SystemTypeDTO

export interface Message<T extends MessageData> {
    event: WSEvent
    data: T
}

export interface Prompt {
    input?: string
    edit_nodes?: EditNode[]
}

export interface EditNode {
    node_id?: string
    title?: string | Vertex | Link | SubGraph
}

export interface SystemTypeDTO {
    type: SystemType
}
