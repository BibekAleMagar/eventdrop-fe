

export type Event = {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    image: string;
    user: string;
    createdAt: string; 
    updatedAt: string;
}

export type CreateEvent = {
    title: string;
    description?: string;
    startingDate: string;
    endingDate?: string;
}