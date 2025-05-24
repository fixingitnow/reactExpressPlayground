export const recommendationFormat = {
  format: {
    categories: [
      {
        id: 'string',
        title: 'string',
        description: 'string',
        tasks: [
          {
            id: 'string',
            title: 'string',
            isCompleted: false,
            subtasks: [
              {
                id: 'string',
                title: 'string',
                isCompleted: false,
              },
            ],
          },
        ],
      },
    ],
  },
  requirements: [
    'Include these categories: Technical Preparation, Company Research, Behavioral Interview Preparation',
    'Each task should have 2-3 subtasks',
    'All IDs should be unique',
    'All isCompleted fields should be false initially',
  ],
}
