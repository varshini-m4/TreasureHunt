import { Task } from "../types/tasks";

export const tasks: Task[] = [

    {
        id: 1,
        title: "Take a Picture with a Tree",
        description: "Stand beside a tree and upload a picture.",
        type: "photo",
        completed: false,
        approved: false,
        screen: "/tree",
        x: 300, y: 150,
    },

    {
        id: 2,
        title: "Sing a Song",
        description: "Record yourself singing at least 1 minute.",
        type: "audio",
        completed: false,
        approved: false,
        screen: "/sing",
        x: 120, y: 320,
    },

    {
        id: 3,
        title: "Walk 1 KM",
        description: "Upload your Google Fit screenshot.",
        type: "photo",
        completed: false,
        approved: false,
        screen: "/walk",
        x: 340, y: 490,
    },

    {
        id: 4,
        title: "Solve Birthday crossword",
        description: "Puzzle to solve.",
        type: "crossword",
        completed: false,
        approved: false,
        screen: "/crossword",
        x: 160, y: 660
    },

    {
        id: 5,
        title: "Guess the Movie",
        description: "Guess today's movie.",
        reward: "L",
        type: "movie",
        completed: false,
        approved: false,
        screen: "/movie",
        x: 360, y: 830
    },

    {
        id: 6,
        title: "Funny Selfie",
        description: "Upload a funny selfie.",
        reward: "O",
        type: "photo",
        completed: false,
        approved: false,
        screen: "/selfie",
         x: 140, y: 1000
    },

    {
        id: 7,
        title: "Picture with Dog",
        description: "Upload a picture with a dog.",
        reward: "C",
        type: "photo",
        completed: false,
        approved: false,
        screen: "/dog",
        x: 330, y: 1170
    },

    {
        id: 8,
        title: "Decode Secret",
        description: "Decode the hidden message.",
        reward: "K",
        type: "decode",
        completed: false,
        approved: false,
        x: 170, y: 1340
    },

    {
        id: 9,
        title: "WhatsApp Status",
        description: "Upload screenshot after posting.",
        reward: "E",
        type: "status",
        completed: false,
        approved: false,
        x: 350, y: 1510
    },

    {
        id: 10,
        title: "Unlock Secret Word",
        description: "Enter collected word.",
        type: "movie",
        completed: false,
        approved: false,
        x: 130, y: 1680
    },

    {
        id: 11,
        title: "Best Memory",
        description: "Tell us your best memory.",
        type: "memory",
        completed: false,
        approved: false,
        x: 320, y: 1850
    },

    {
        id: 12,
        title: "Coffee Clue",
        description: "Where mornings begin with hot coffee.",
        type: "location",
        completed: false,
        approved: false,
        x: 150, y: 2020
    },

    {
        id: 13,
        title: "Cold Place",
        description: "Where cold things stay.",
        type: "location",
        completed: false,
        approved: false,
        x: 340, y: 2190
    },

    {
        id: 14,
        title: "Final Clue",
        description: "Solve the final riddle.",
        type: "location",
        completed: false,
        approved: false,
        x: 170, y: 2360
    },

    {
        id: 15,
        title: "Locker",
        description: "Enter the locker PIN.",
        type: "locker",
        completed: false,
        approved: false,
        x: 300, y: 2530
    }

];