export type ExerciseType = {
    id: number;
    name: string;
    weight: number;
    reps: number;
    complete: boolean;
    index: number;
}

export type WorkoutType = {
    date: Date,
    exercises: Array<ExerciseType>
}