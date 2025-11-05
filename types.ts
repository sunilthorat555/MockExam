
export enum QuestionType {
  FILL_IN_THE_BLANK = 'FILL_IN_THE_BLANK',
  TRUE_FALSE = 'TRUE_FALSE',
  MCQ_SINGLE = 'MCQ_SINGLE',
  MCQ_MULTI = 'MCQ_MULTI',
  MATCH_THE_FOLLOWING = 'MATCH_THE_FOLLOWING',
  BRIEF_ANSWER = 'BRIEF_ANSWER',
  HTML_CODING = 'HTML_CODING',
  JAVASCRIPT_PROGRAMMING = 'JAVASCRIPT_PROGRAMMING',
}

export interface MatchOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  matchPairs?: {
    stems: MatchOption[];
    responses: MatchOption[];
  };
  correctAnswer: string | string[] | Record<string, string>;
  marks: number;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface ExamData {
  title: string;
  sections: Section[];
}

export type UserAnswers = Record<string, string | string[] | Record<string, string>>;
