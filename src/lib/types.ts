export type ExerciseType = {
    id: string;
    name: string;
    weight: number;
    reps: number;
    complete: boolean;
    index: number;
}

export type ExerciseLog = {
    exercise: ExerciseType | undefined;
    count: number;
}

export type Workout = {
    date: string,
    exercises: Array<ExerciseType>
}

export type EditExerciseResponse = {
    exercise?: ExerciseType;
    remove: boolean;
}