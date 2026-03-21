'use server';
/**
 * @fileOverview A Genkit flow for generating diverse and challenging quiz questions based on a given syllabus.
 *
 * - generateQuizQuestions - A function that handles the quiz question generation process.
 * - GenerateQuizQuestionsInput - The input type for the generateQuizQuestions function.
 * - GenerateQuizQuestionsOutput - The return type for the generateQuizQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizQuestionsInputSchema = z.object({
  syllabus: z
    .string()
    .describe('The detailed syllabus or topics for which to generate quiz questions.'),
  numQuestions:
    z.number().int().min(1).max(20).optional().describe('The number of quiz questions to generate. Defaults to 5 if not provided.'),
  difficulty:
    z.enum(['easy', 'medium', 'hard']).optional().describe('The difficulty level of the quiz questions. Defaults to "medium" if not provided.'),
});
export type GenerateQuizQuestionsInput = z.infer<typeof GenerateQuizQuestionsInputSchema>;

const QuizQuestionSchema = z.object({
  questionText: z.string().describe('The text of the quiz question.'),
  options:
    z.array(z.string()).min(2).max(5).describe('An array of possible answer options for the multiple-choice question.'),
  correctAnswer: z.string().describe('The correct answer, which must be one of the provided options.'),
  explanation: z.string().optional().describe('A brief explanation for the correct answer.'),
});

const GenerateQuizQuestionsOutputSchema = z.object({
  questions: z.array(QuizQuestionSchema).describe('An array of generated quiz questions.'),
});
export type GenerateQuizQuestionsOutput = z.infer<typeof GenerateQuizQuestionsOutputSchema>;

export async function generateQuizQuestions(
  input: GenerateQuizQuestionsInput
): Promise<GenerateQuizQuestionsOutput> {
  return generateQuizQuestionsFlow(input);
}

const generateQuizPrompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: {schema: GenerateQuizQuestionsInputSchema},
  output: {schema: GenerateQuizQuestionsOutputSchema},
  prompt: `You are an expert quiz question generator. Your task is to create diverse and challenging multiple-choice quiz questions based on the provided syllabus.\n\nSyllabus: {{{syllabus}}}\n\n{{#if numQuestions}}\nGenerate {{numQuestions}} questions.\n{{else}}\nGenerate 5 questions.\n{{/if}}\n\n{{#if difficulty}}\nThe questions should be of {{difficulty}} difficulty.\n{{else}}\nThe questions should be of medium difficulty.\n{{/if}}\n\nEach question must have between 2 and 5 answer options. One of the options must be the correct answer. Provide a brief explanation for the correct answer.\n\nEnsure the questions are unique and cover different aspects of the syllabus.`,
});

const generateQuizQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuizQuestionsFlow',
    inputSchema: GenerateQuizQuestionsInputSchema,
    outputSchema: GenerateQuizQuestionsOutputSchema,
  },
  async input => {
    const augmentedInput = {
      syllabus: input.syllabus,
      numQuestions: input.numQuestions ?? 5,
      difficulty: input.difficulty ?? 'medium',
    };

    const {output} = await generateQuizPrompt(augmentedInput);
    if (!output) {
      throw new Error('Failed to generate quiz questions.');
    }
    return output;
  }
);
