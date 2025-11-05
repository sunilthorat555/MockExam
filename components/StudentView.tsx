import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { INITIAL_EXAM_DATA, EXAM_DURATION_SECONDS, LOCAL_STORAGE_KEY } from '../constants';
import { ExamData, Question, QuestionType, UserAnswers } from '../types';
import Timer from './Timer';

// Helper components defined inside StudentView to avoid prop drilling and keep file count low

const StartScreen: React.FC<{ onStart: () => void; totalQuestions: number; totalMarks: number; onBack: () => void; }> = ({ onStart, totalQuestions, totalMarks, onBack }) => (
  <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-2xl p-8 text-center">
      <h1 className="text-4xl font-extrabold text-primary mb-4">HSC IT Online Exam</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8 text-slate-700">
        <div className="p-4 bg-primary-light rounded-lg">
          <p className="text-2xl font-bold">{totalQuestions}</p>
          <p>Total Questions</p>
        </div>
        <div className="p-4 bg-primary-light rounded-lg">
          <p className="text-2xl font-bold">{totalMarks}</p>
          <p>Gradable Marks</p>
        </div>
        <div className="p-4 bg-primary-light rounded-lg">
          <p className="text-2xl font-bold">3 Hours</p>
          <p>Duration</p>
        </div>
      </div>
      <div className="text-left bg-slate-50 p-6 rounded-lg space-y-2 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Instructions</h2>
        <p>1. Read all questions carefully.</p>
        <p>2. The timer will start as soon as you click "Start Exam".</p>
        <p>3. The exam will auto-submit when the timer runs out.</p>
        <p>4. Use the question palette to navigate between questions.</p>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={onStart} className="w-full sm:w-auto bg-primary text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-primary-hover transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-light">
          Start Exam
        </button>
        <button onClick={onBack} className="w-full sm:w-auto bg-slate-200 text-slate-700 font-bold py-3 px-8 rounded-lg hover:bg-slate-300 transition">Back to Home</button>
      </div>
    </div>
  </div>
);

const QuestionCard: React.FC<{ question: Question; userAnswer: any; onAnswer: (answer: any) => void; questionNumber: number; }> = ({ question, userAnswer, onAnswer, questionNumber }) => {
  switch (question.type) {
    case QuestionType.FILL_IN_THE_BLANK:
      return (
        <div>
          <p className="text-lg">{questionNumber}. {question.text.split('___')[0]}
            <input
              type="text"
              className="mx-2 p-1 border-b-2 border-primary focus:outline-none focus:border-primary-dark"
              value={userAnswer || ''}
              onChange={(e) => onAnswer(e.target.value)}
            />
          {question.text.split('___')[1]}
          </p>
        </div>
      );
    case QuestionType.TRUE_FALSE:
    case QuestionType.MCQ_SINGLE:
      return (
        <div>
          <p className="text-lg mb-4">{questionNumber}. {question.text}</p>
          <div className="space-y-2">
            {question.options?.map(option => (
              <label key={option} className="flex items-center p-3 rounded-lg hover:bg-primary-light cursor-pointer transition">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={userAnswer === option}
                  onChange={(e) => onAnswer(e.target.value)}
                  className="w-5 h-5 text-primary focus:ring-primary-dark"
                />
                <span className="ml-3 text-slate-700">{option}</span>
              </label>
            ))}
          </div>
        </div>
      );
    case QuestionType.MCQ_MULTI:
      const handleCheckboxChange = (option: string) => {
        const currentAnswers = Array.isArray(userAnswer) ? [...userAnswer] : [];
        if (currentAnswers.includes(option)) {
          onAnswer(currentAnswers.filter(a => a !== option));
        } else {
          onAnswer([...currentAnswers, option]);
        }
      };
      return (
        <div>
          <p className="text-lg mb-4">{questionNumber}. {question.text}</p>
          <div className="space-y-2">
            {question.options?.map(option => (
              <label key={option} className="flex items-center p-3 rounded-lg hover:bg-primary-light cursor-pointer transition">
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(userAnswer) && userAnswer.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                  className="w-5 h-5 text-primary rounded focus:ring-primary-dark"
                />
                <span className="ml-3 text-slate-700">{option}</span>
              </label>
            ))}
          </div>
        </div>
      );
    case QuestionType.MATCH_THE_FOLLOWING:
        const handleMatchChange = (stemId: string, responseId: string) => {
            onAnswer({ ...(userAnswer || {}), [stemId]: responseId });
        };
        return (
            <div>
                <p className="text-lg mb-4">{questionNumber}. {question.text}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        {question.matchPairs?.stems.map((stem, index) => (
                            <div key={stem.id} className="flex items-center justify-between p-3 bg-slate-100 rounded-lg">
                                <span className="font-semibold text-slate-800">{String.fromCharCode(65 + index)}. {stem.text}</span>
                                <select 
                                    value={(userAnswer && userAnswer[stem.id]) || ''}
                                    onChange={(e) => handleMatchChange(stem.id, e.target.value)}
                                    className="p-2 border rounded-md focus:ring-primary focus:border-primary"
                                >
                                    <option value="">Select Match</option>
                                    {question.matchPairs?.responses.map((resp, rIndex) => (
                                        <option key={resp.id} value={resp.id}>{rIndex + 1}. {resp.text}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    case QuestionType.BRIEF_ANSWER:
    case QuestionType.HTML_CODING:
    case QuestionType.JAVASCRIPT_PROGRAMMING:
      return (
        <div>
          <p className="text-lg mb-4">{questionNumber}. {question.text}</p>
          <textarea
            className="w-full h-40 p-2 border rounded-lg focus:ring-primary focus:border-primary font-mono"
            value={userAnswer || ''}
            onChange={(e) => onAnswer(e.target.value)}
          />
        </div>
      );
    default:
      return <div>Unsupported question type</div>;
  }
};

const QuestionPalette: React.FC<{ allQuestions: Question[]; userAnswers: UserAnswers; currentQuestionIndex: number; onQuestionSelect: (index: number) => void; examData: ExamData }> = ({ allQuestions, userAnswers, currentQuestionIndex, onQuestionSelect, examData }) => {
  let questionCounter = 0;
  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-h-[calc(100vh-200px)] overflow-y-auto">
      {examData.sections.map(section => (
        <div key={section.id} className="mb-4">
          <h3 className="font-bold text-slate-600 mb-2">{section.title}</h3>
          <div className="grid grid-cols-5 gap-2">
            {section.questions.map((_question, subIndex) => {
              const questionIndex = questionCounter;
              questionCounter++;
              const isAnswered = userAnswers[allQuestions[questionIndex].id] && (
                (Array.isArray(userAnswers[allQuestions[questionIndex].id]) && (userAnswers[allQuestions[questionIndex].id] as string[]).length > 0) ||
                (typeof userAnswers[allQuestions[questionIndex].id] === 'object' && Object.keys(userAnswers[allQuestions[questionIndex].id]).length > 0) ||
                (typeof userAnswers[allQuestions[questionIndex].id] === 'string' && (userAnswers[allQuestions[questionIndex].id] as string).length > 0)
              );
              const isCurrent = currentQuestionIndex === questionIndex;
              
              let buttonClass = 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100';
              if (isAnswered) buttonClass = 'bg-green-500 border-green-500 text-white hover:bg-green-600';
              if (isCurrent) buttonClass = 'bg-primary border-primary text-white ring-2 ring-offset-1 ring-primary-dark';

              return (
                <button
                  key={allQuestions[questionIndex].id}
                  onClick={() => onQuestionSelect(questionIndex)}
                  className={`w-10 h-10 rounded-md border transition-all text-sm font-semibold flex items-center justify-center ${buttonClass}`}
                >
                  {subIndex + 1}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const ResultScreen: React.FC<{ score: number; totalGradableMarks: number; onTryAgain: () => void; allQuestions: Question[], userAnswers: UserAnswers, examData: ExamData }> = ({ score, totalGradableMarks, onTryAgain, allQuestions, userAnswers, examData }) => {
    const navigate = useNavigate();
    const [showAnswers, setShowAnswers] = useState(false);
    const percentage = totalGradableMarks > 0 ? (score / totalGradableMarks) * 100 : 0;
    
    let feedback = { text: "Keep Practicing!", color: "text-slate-500" };
    if (percentage >= 90) feedback = { text: "Excellent!", color: "text-green-500" };
    else if (percentage >= 75) feedback = { text: "Good Job!", color: "text-blue-500" };
    else if (percentage >= 50) feedback = { text: "You Can Do Better!", color: "text-orange-500" };

    const isCorrect = (question: Question, userAnswer: any) => {
        if (!userAnswer) return false;
        if (question.type === QuestionType.MCQ_MULTI) {
            const correct = question.correctAnswer as string[];
            return correct.length === userAnswer.length && correct.every(ans => userAnswer.includes(ans));
        }
        if (question.type === QuestionType.MATCH_THE_FOLLOWING) {
            const correct = question.correctAnswer as Record<string, string>;
            return Object.keys(correct).length === Object.keys(userAnswer).length && 
                   Object.keys(correct).every(key => correct[key] === userAnswer[key]);
        }
        return JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer);
    };

    return (
        <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl p-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-800">Exam Result</h1>
                    <p className={`text-5xl font-extrabold mt-6 ${feedback.color}`}>{score} / {totalGradableMarks}</p>
                    <p className={`text-2xl font-semibold mt-2 ${feedback.color}`}>{feedback.text}</p>
                    <p className="text-slate-500 mt-4">Note: Subjective questions (Brief Answer, HTML, JavaScript) are not graded automatically.</p>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={onTryAgain} className="bg-primary text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-primary-hover transition">Try Again</button>
                    <button onClick={() => setShowAnswers(!showAnswers)} className="bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-lg hover:bg-slate-300 transition">{showAnswers ? 'Hide' : 'Show'} Answers</button>
                    <button onClick={() => navigate("/")} className="bg-slate-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-slate-700 transition">Back to Home</button>
                </div>

                {showAnswers && (
                    <div className="mt-8 space-y-6">
                        {examData.sections.map(section => (
                           <div key={section.id} className="p-4 rounded-lg bg-slate-50 border">
                               <h3 className="text-lg font-bold text-slate-700 mb-4">{section.title}</h3>
                               <div className="space-y-4">
                                   {section.questions.map((q, i) => {
                                       const userAnswer = userAnswers[q.id];
                                       const correct = isCorrect(q, userAnswer);
                                       const isGradable = q.type !== QuestionType.BRIEF_ANSWER && q.type !== QuestionType.HTML_CODING && q.type !== QuestionType.JAVASCRIPT_PROGRAMMING;
                                       
                                       return (
                                           <div key={q.id} className={`p-4 rounded-lg border-l-4 ${isGradable ? (correct ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50') : 'border-slate-300 bg-slate-100'}`}>
                                               <p className="font-bold text-slate-800">{i + 1}. {q.text}</p>
                                               <p className="mt-2 text-sm"><span className="font-semibold">Your Answer: </span>
                                               {userAnswer ? (typeof userAnswer === 'object' ? JSON.stringify(userAnswer) : userAnswer.toString()) : <span className="text-slate-500">Not Answered</span>}
                                               </p>
                                               {isGradable && !correct && <p className="mt-1 text-sm text-green-700"><span className="font-semibold">Correct Answer: </span>{JSON.stringify(q.correctAnswer)}</p>}
                                           </div>
                                       );
                                   })}
                               </div>
                           </div>
                       ))}
                    </div>
                )}
            </div>
        </div>
    );
};


const StudentView: React.FC = () => {
  const [examData] = useLocalStorage<ExamData>(LOCAL_STORAGE_KEY, INITIAL_EXAM_DATA);
  const [examState, setExamState] = useState<'start' | 'exam' | 'result'>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [finalScore, setFinalScore] = useState(0);

  const navigate = useNavigate();

  const allQuestions = useMemo(() => examData.sections.flatMap(s => s.questions), [examData]);
  const totalGradableMarks = useMemo(() => allQuestions.filter(q => ![QuestionType.BRIEF_ANSWER, QuestionType.HTML_CODING, QuestionType.JAVASCRIPT_PROGRAMMING].includes(q.type)).reduce((sum, q) => sum + q.marks, 0), [allQuestions]);

  const handleAnswer = (questionId: string, answer: any) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
  };
  
  const handleSubmit = useCallback(() => {
    let score = 0;
    allQuestions.forEach(q => {
      const userAnswer = userAnswers[q.id];
      if (!userAnswer) return;

      let isCorrect = false;
      switch (q.type) {
        case QuestionType.MCQ_MULTI:
          const correctMulti = q.correctAnswer as string[];
          const userMulti = userAnswer as string[];
          isCorrect = correctMulti.length === userMulti.length && correctMulti.every(ans => userMulti.includes(ans));
          break;
        case QuestionType.MATCH_THE_FOLLOWING:
            const correctMatch = q.correctAnswer as Record<string, string>;
            const userMatch = userAnswer as Record<string, string>;
            isCorrect = Object.keys(correctMatch).length > 0 && 
                        Object.keys(correctMatch).length === Object.keys(userMatch).length &&
                        Object.keys(correctMatch).every(key => correctMatch[key] === userMatch[key]);
            break;
        case QuestionType.FILL_IN_THE_BLANK:
        case QuestionType.TRUE_FALSE:
        case QuestionType.MCQ_SINGLE:
          isCorrect = (userAnswer as string).toLowerCase().trim() === (q.correctAnswer as string).toLowerCase().trim();
          break;
      }
      if (isCorrect) {
        score += q.marks;
      }
    });
    setFinalScore(score);
    setExamState('result');
  }, [allQuestions, userAnswers]);

  const handleTryAgain = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setExamState('start');
  };
  
  const currentQuestion = allQuestions[currentQuestionIndex];
  const currentSection = useMemo(() => examData.sections.find(sec => sec.questions.some(q => q.id === currentQuestion?.id)), [examData, currentQuestion]);

  const subQuestionNumber = useMemo(() => {
    if (currentQuestion && currentSection) {
        const subIndex = currentSection.questions.findIndex(q => q.id === currentQuestion.id);
        if (subIndex !== -1) {
            return subIndex + 1;
        }
    }
    return 1;
  }, [currentQuestion, currentSection]);


  if (examState === 'start') {
    return <StartScreen 
      onStart={() => setExamState('exam')} 
      totalQuestions={allQuestions.length}
      totalMarks={totalGradableMarks}
      onBack={() => navigate('/')}
    />;
  }

  if (examState === 'result') {
    return <ResultScreen 
      score={finalScore} 
      totalGradableMarks={totalGradableMarks} 
      onTryAgain={handleTryAgain}
      allQuestions={allQuestions}
      userAnswers={userAnswers}
      examData={examData}
    />;
  }

  return (
    <div className="bg-slate-100">
      <header className="sticky top-0 z-10 bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-primary">{examData.title}</h1>
        <Timer duration={EXAM_DURATION_SECONDS} onTimeUp={handleSubmit} />
      </header>

      <main className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-slate-800 mb-1">{currentSection?.title}</h2>
          <p className="text-sm text-slate-500 mb-6">{currentSection?.description}</p>
          {currentQuestion && (
            <QuestionCard
              question={currentQuestion}
              userAnswer={userAnswers[currentQuestion.id]}
              onAnswer={(answer) => handleAnswer(currentQuestion.id, answer)}
              questionNumber={subQuestionNumber}
            />
          )}
        </div>

        <aside className="lg:col-span-1">
          <QuestionPalette 
            allQuestions={allQuestions}
            userAnswers={userAnswers}
            currentQuestionIndex={currentQuestionIndex}
            onQuestionSelect={setCurrentQuestionIndex}
            examData={examData}
          />
        </aside>
      </main>

      <footer className="sticky bottom-0 bg-white shadow-top p-4 flex justify-between items-center border-t">
        <div>
          <button
            onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
            disabled={currentQuestionIndex === 0}
            className="bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentQuestionIndex(i => Math.min(allQuestions.length - 1, i + 1))}
            disabled={currentQuestionIndex === allQuestions.length - 1}
            className="ml-4 bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
        <p className="font-semibold text-slate-600">
          Question {currentQuestionIndex + 1} of {allQuestions.length}
        </p>
        <button
          onClick={handleSubmit}
          className="bg-primary text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:bg-primary-hover transition"
        >
          Submit Exam
        </button>
      </footer>
    </div>
  );
};

export default StudentView;