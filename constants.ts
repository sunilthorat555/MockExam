import { ExamData, QuestionType } from './types';

export const EXAM_DURATION_SECONDS = 3 * 60 * 60; // 3 hours

export const LOCAL_STORAGE_KEY = 'hscItExamData';

export const INITIAL_EXAM_DATA: ExamData = {
  title: 'HSC IT Mock Online Exam',
  sections: [
    {
      id: 'sec1',
      title: 'Q1. Fill in the Blanks',
      description: 'Select the correct option to fill in the blank.',
      questions: Array.from({ length: 10 }, (_, i) => ({
        id: `fib${i + 1}`,
        type: QuestionType.FILL_IN_THE_BLANK,
        text: `A ___ is a set of instructions.`,
        correctAnswer: 'program',
        marks: 1,
      })),
    },
    {
      id: 'sec2',
      title: 'Q2. True/False',
      description: 'State whether the following statements are true or false.',
      questions: Array.from({ length: 10 }, (_, i) => ({
        id: `tf${i + 1}`,
        type: QuestionType.TRUE_FALSE,
        text: `HTML is a programming language.`,
        options: ['True', 'False'],
        correctAnswer: 'False',
        marks: 1,
      })),
    },
    {
      id: 'sec3',
      title: 'Q3. MCQ (Single Correct)',
      description: 'Select the most appropriate option.',
      questions: Array.from({ length: 10 }, (_, i) => ({
        id: `mcqs${i + 1}`,
        type: QuestionType.MCQ_SINGLE,
        text: `What does CSS stand for?`,
        options: ['Cascading Style Sheets', 'Creative Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'],
        correctAnswer: 'Cascading Style Sheets',
        marks: 1,
      })),
    },
    {
      id: 'sec4',
      title: 'Q4. MCQ (Multiple Correct)',
      description: 'Select all the correct options (2 or 3 correct answers).',
      questions: Array.from({ length: 10 }, (_, i) => ({
        id: `mcqm${i + 1}`,
        type: QuestionType.MCQ_MULTI,
        text: `Which of the following are block-level elements in HTML?`,
        options: ['<div>', '<span>', '<p>', '<a>'],
        correctAnswer: ['<div>', '<p>'],
        marks: 2,
      })),
    },
    {
      id: 'sec5',
      title: 'Q5. Match the Following',
      description: 'Match the items in Column A with Column B.',
      questions: [
        {
          id: 'match1',
          type: QuestionType.MATCH_THE_FOLLOWING,
          text: 'Match the technology with its primary use case.',
          matchPairs: {
            stems: [
                { id: 'm1a', text: 'HTML' },
                { id: 'm1b', text: 'CSS' },
                { id: 'm1c', text: 'JavaScript' },
                { id: 'm1d', text: 'SQL' },
            ],
            responses: [
                { id: 'm1r1', text: 'Styling' },
                { id: 'm1r2', text: 'Database Query' },
                { id: 'm1r3', text: 'Structure' },
                { id: 'm1r4', text: 'Interactivity' },
            ],
          },
          correctAnswer: { m1a: 'm1r3', m1b: 'm1r1', m1c: 'm1r4', m1d: 'm1r2' },
          marks: 4,
        },
      ],
    },
    {
        id: 'sec6',
        title: 'Q6. Brief Answer',
        description: 'Answer the following in brief.',
        questions: Array.from({ length: 8 }, (_, i) => ({
          id: `brief${i + 1}`,
          type: QuestionType.BRIEF_ANSWER,
          text: `Explain the concept of SEO.`,
          correctAnswer: '',
          marks: 1.25,
        })),
    },
    {
        id: 'sec7',
        title: 'Q7. HTML Coding',
        description: 'Write the HTML code for the following.',
        questions: Array.from({ length: 2 }, (_, i) => ({
          id: `html${i + 1}`,
          type: QuestionType.HTML_CODING,
          text: `Create an HTML form with a text input for 'Name' and a submit button.`,
          correctAnswer: '<form><input type="text" name="name"><input type="submit"></form>',
          marks: 5,
        })),
    },
    {
        id: 'sec8',
        title: 'Q8. JavaScript Programming',
        description: 'Write the JavaScript code for the following.',
        questions: Array.from({ length: 2 }, (_, i) => ({
          id: `js${i + 1}`,
          type: QuestionType.JAVASCRIPT_PROGRAMMING,
          text: `Write a JavaScript function to find the sum of two numbers.`,
          correctAnswer: 'function sum(a, b) { return a + b; }',
          marks: 5,
        })),
    }
  ],
};