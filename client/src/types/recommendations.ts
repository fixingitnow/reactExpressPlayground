export interface PreparationTask {
    id: string;
    title: string;
    isCompleted: boolean;
    category: string;
    subtasks?: PreparationTask[];
}

export interface PreparationCategory {
    title: string;
    description: string;
    tasks: PreparationTask[];
}

export interface PreparationRecommendations {
    categories: PreparationCategory[];
    lastUpdated: string;
}

// Example of the expected JSON structure from LLM
export const sampleRecommendationFormat = {
    categories: [
        {
            title: "Technical Preparation",
            description: "Focus on strengthening your technical skills relevant to software engineering roles.",
            tasks: [
                {
                    id: "tech-1",
                    title: "Review core data structures and algorithms",
                    isCompleted: false,
                    category: "technical",
                    subtasks: [
                        {
                            id: "tech-1-1",
                            title: "Arrays, linked lists, stacks, queues, and hash maps",
                            isCompleted: false,
                            category: "technical"
                        },
                        {
                            id: "tech-1-2",
                            title: "Trees and graphs",
                            isCompleted: false,
                            category: "technical"
                        }
                    ]
                }
            ]
        }
    ],
    lastUpdated: new Date().toISOString()
}; 