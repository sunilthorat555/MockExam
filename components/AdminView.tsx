
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import { INITIAL_EXAM_DATA, LOCAL_STORAGE_KEY } from '../constants';
import { ExamData, Section, Question, QuestionType, MatchOption } from '../types';

// Admin Login Component
const AdminLogin: React.FC<{ onLogin: () => void; onBack: () => void }> = ({ onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'password') {
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      onLogin();
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="flex flex-col gap-4">
            <button type="submit" className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-hover">Login</button>
            <button type="button" onClick={onBack} className="w-full bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-300">Back to Home</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal Component
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-800">&times;</button>
        </div>
        <div className="p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};


// Admin Panel Component
const AdminPanel: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [examData, setExamData] = useLocalStorage<ExamData>(LOCAL_STORAGE_KEY, INITIAL_EXAM_DATA);
    
    // State for modals
    const [editingSection, setEditingSection] = useState<Section | null>(null);
    const [editingQuestion, setEditingQuestion] = useState<{question: Question, sectionId: string} | null>(null);
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

    const handleSaveSection = (section: Section) => {
        setExamData(prev => {
            const sections = [...prev.sections];
            const index = sections.findIndex(s => s.id === section.id);
            if (index > -1) {
                sections[index] = section;
            } else {
                sections.push(section);
            }
            return { ...prev, sections };
        });
        setIsSectionModalOpen(false);
    };
    
    const handleDeleteSection = (sectionId: string) => {
        if (window.confirm('Are you sure you want to delete this section and all its questions?')) {
            setExamData(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== sectionId) }));
        }
    };
    
    const handleSaveQuestion = (sectionId: string, question: Question) => {
        setExamData(prev => {
            const newSections = prev.sections.map(section => {
                if (section.id === sectionId) {
                    const questions = [...section.questions];
                    const qIndex = questions.findIndex(q => q.id === question.id);
                    if (qIndex > -1) {
                        questions[qIndex] = question;
                    } else {
                        questions.push(question);
                    }
                    return { ...section, questions };
                }
                return section;
            });
            return { ...prev, sections: newSections };
        });
        setIsQuestionModalOpen(false);
    };

    const handleDeleteQuestion = (sectionId: string, questionId: string) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            setExamData(prev => ({
                ...prev,
                sections: prev.sections.map(s => {
                    if (s.id === sectionId) {
                        return { ...s, questions: s.questions.filter(q => q.id !== questionId) };
                    }
                    return s;
                })
            }));
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800">Admin Panel</h1>
                    <div className="flex gap-4">
                        <button onClick={() => { setEditingSection(null); setIsSectionModalOpen(true); }} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-hover">Add Section</button>
                        <button onClick={onLogout} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">Logout</button>
                    </div>
                </header>

                <div className="space-y-6">
                    {examData.sections.map(section => (
                        <div key={section.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-700">{section.title}</h2>
                                    <p className="text-sm text-slate-500">{section.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setEditingSection(section); setIsSectionModalOpen(true); }} className="text-blue-500 hover:text-blue-700">Edit</button>
                                    <button onClick={() => handleDeleteSection(section.id)} className="text-red-500 hover:text-red-700">Delete</button>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {section.questions.map((q, i) => (
                                    <div key={q.id} className="flex justify-between items-center p-3 bg-slate-50 rounded">
                                        <p>{i+1}. {q.text.substring(0, 80)}...</p>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingQuestion({ question: q, sectionId: section.id }); setIsQuestionModalOpen(true); }} className="text-sm text-blue-500 hover:text-blue-700">Edit</button>
                                            <button onClick={() => handleDeleteQuestion(section.id, q.id)} className="text-sm text-red-500 hover:text-red-700">Delete</button>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={() => { setEditingQuestion({ question: null, sectionId: section.id }); setIsQuestionModalOpen(true); }} className="mt-4 text-sm bg-slate-200 text-slate-700 font-semibold py-1 px-3 rounded-md hover:bg-slate-300">Add Question</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <SectionEditorModal isOpen={isSectionModalOpen} onClose={() => setIsSectionModalOpen(false)} section={editingSection} onSave={handleSaveSection} />
            <QuestionEditorModal isOpen={isQuestionModalOpen} onClose={() => setIsQuestionModalOpen(false)} data={editingQuestion} onSave={handleSaveQuestion} />
        </div>
    );
};

// Section Editor Modal
const SectionEditorModal: React.FC<{ isOpen: boolean; onClose: () => void; section: Section | null; onSave: (section: Section) => void; }> = ({ isOpen, onClose, section, onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        setTitle(section?.title || '');
        setDescription(section?.description || '');
    }, [section]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ id: section?.id || `sec_${Date.now()}`, title, description, questions: section?.questions || [] });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={section ? 'Edit Section' : 'Add Section'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 w-full p-2 border rounded" required />
                </div>
                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 w-full p-2 border rounded" required />
                </div>
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="bg-slate-200 px-4 py-2 rounded">Cancel</button>
                    <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Save</button>
                </div>
            </form>
        </Modal>
    );
};

// Question Editor Modal
const QuestionEditorModal: React.FC<{
    isOpen: boolean; onClose: () => void;
    data: { question: Question | null, sectionId: string } | null;
    onSave: (sectionId: string, question: Question) => void;
}> = ({ isOpen, onClose, data, onSave }) => {
    const [question, setQuestion] = useState<Partial<Question>>({});
    
    useEffect(() => {
        setQuestion(data?.question || { type: QuestionType.FILL_IN_THE_BLANK });
    }, [data]);
    
    const handleChange = (field: keyof Question, value: any) => {
        setQuestion(prev => ({...prev, [field]: value}));
    };
    
    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...(question.options || [])];
        newOptions[index] = value;
        handleChange('options', newOptions);
    };

    const handleCorrectAnswerChange = (value: string) => {
        if(question.type === QuestionType.MCQ_MULTI) {
            const currentAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
            const newAnswers = currentAnswers.includes(value) ? currentAnswers.filter(a => a !== value) : [...currentAnswers, value];
            handleChange('correctAnswer', newAnswers);
        } else {
            handleChange('correctAnswer', value);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(data!.sectionId, { ...question, id: question.id || `q_${Date.now()}` } as Question);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={data?.question ? 'Edit Question' : 'Add Question'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label>Question Type</label>
                    <select value={question.type} onChange={e => handleChange('type', e.target.value)} className="w-full p-2 border rounded">
                        {Object.values(QuestionType).map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>
                <div>
                    <label>Question Text</label>
                    <textarea value={question.text || ''} onChange={e => handleChange('text', e.target.value)} className="w-full p-2 border rounded" rows={3}></textarea>
                </div>
                { (question.type === QuestionType.MCQ_SINGLE || question.type === QuestionType.MCQ_MULTI || question.type === QuestionType.TRUE_FALSE) && (
                    <div>
                        <label>Options</label>
                        {question.options?.map((opt, i) => (
                           <div key={i} className="flex items-center gap-2 mb-2">
                                <input type="text" value={opt} onChange={e => handleOptionChange(i, e.target.value)} className="w-full p-2 border rounded" />
                                { question.type === QuestionType.MCQ_MULTI ? 
                                    <input type="checkbox" checked={(question.correctAnswer as string[])?.includes(opt)} onChange={() => handleCorrectAnswerChange(opt)} /> :
                                    <input type="radio" name="correctAnswer" checked={question.correctAnswer === opt} onChange={() => handleCorrectAnswerChange(opt)} />
                                }
                           </div> 
                        ))}
                        <button type="button" onClick={() => handleChange('options', [...(question.options || []), ''])} className="text-sm text-blue-500">Add Option</button>
                    </div>
                )}
                <div>
                    <label>Marks</label>
                    <input type="number" value={question.marks || 1} onChange={e => handleChange('marks', Number(e.target.value))} className="w-full p-2 border rounded" />
                </div>
                { question.type !== QuestionType.MCQ_MULTI && question.type !== QuestionType.MCQ_SINGLE && (
                    <div>
                        <label>Correct Answer (JSON or string)</label>
                        <input type="text" value={typeof question.correctAnswer === 'object' ? JSON.stringify(question.correctAnswer) : question.correctAnswer || ''} onChange={e => handleChange('correctAnswer', e.target.value)} className="w-full p-2 border rounded" />
                    </div>
                )}

                <div className="flex justify-end gap-4 mt-6">
                    <button type="button" onClick={onClose} className="bg-slate-200 px-4 py-2 rounded">Cancel</button>
                    <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Save Question</button>
                </div>
            </form>
        </Modal>
    );
};

// Main AdminView Component
const AdminView: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem('isAdminAuthenticated') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    setIsAuthenticated(false);
  };
  
  const handleBack = () => {
      navigate('/');
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} onBack={handleBack} />;
  }

  return <AdminPanel onLogout={handleLogout} />;
};

export default AdminView;

