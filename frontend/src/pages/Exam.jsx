import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import QuestionCard from '../components/QuestionCard';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner, { LoadingCard } from '../components/LoadingSpinner';

export default function Exam() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [started, setStarted] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
    console.log("id", id);
    useEffect(() => {
        const fetchExam = async () => {
            try {
                const response = await api.get(`/candidate/exams/${id}`);
                setExam(response.data);
                // Do not start the timer immediately. User must click Start Exam.
                // The timer will be initialized when the user presses Start.
                setLoading(false);
            } catch {
                setError('Failed to load exam');
                setLoading(false);
            }
        };

        fetchExam();
    }, [id]);

    const handleSubmit = useCallback(async () => {
        if (submitted) return;

        try {
            setSubmitted(true);
            await api.post(`/candidate/exams/${id}/submit`, answers);
            navigate('/results');
        } catch {
            alert('Failed to submit exam');
            setSubmitted(false);
        }
    }, [submitted, id, answers, navigate]);

    useEffect(() => {
        if (!started) return;
        if (timeLeft > 0 && !submitted) {
            const timer = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !submitted && started) {
            // Auto-submit when time runs out
            handleSubmit();
        }
    }, [timeLeft, submitted, handleSubmit, started]);

    // Prevent accidental page refresh
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!submitted && Object.keys(answers).length > 0) {
                e.preventDefault();
                e.returnValue = 'You have unsaved answers. Are you sure you want to leave?';
                return e.returnValue;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [submitted, answers]);

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: answer
        }));
    };


    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return <LoadingCard message="Loading exam..." />;
    }

    if (error || !exam) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <Card className="text-center py-12">
                    <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">❌</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {error || 'Exam not found'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {error ? 'There was an error loading the exam.' : 'The exam you are looking for does not exist.'}
                    </p>
                    <Button onClick={() => navigate('/dashboard')} variant="primary">
                        ← Back to Dashboard
                    </Button>
                </Card>
            </div>
        );
    }

    const answeredCount = Object.keys(answers).length;
    const totalQuestions = exam.questions ? exam.questions.length : 0;
    const progressPercentage = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <Card className="fade-in">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{exam.title}</h1>
                        <div className="flex items-center space-x-4 text-gray-600">
                            <span className="flex items-center">
                                <span className="w-4 h-4 mr-2">📘</span>
                                {exam.subject}
                            </span>
                            <span className="flex items-center">
                                <span className="w-4 h-4 mr-2">⏳</span>
                                {exam.durationMinutes} minutes
                            </span>
                            <span className="flex items-center">
                                <span className="w-4 h-4 mr-2">📝</span>
                                {totalQuestions} questions
                            </span>
                        </div>
                    </div>
                    <div className="text-center lg:text-right">
                        <div className={`text-4xl font-bold mb-2 ${timeLeft < 300 ? 'text-danger-600' :
                            timeLeft < 600 ? 'text-warning-600' : 'text-primary-600'
                            }`}>
                            {started ? formatTime(timeLeft) : '00:00'}
                        </div>
                        <p className="text-sm text-gray-500">Time Remaining</p>
                        {!started ? (
                            <div className="mt-2">
                                <Button onClick={() => { setStarted(true); setTimeLeft(exam.durationMinutes * 60); }} variant="primary">Start Exam</Button>
                            </div>
                        ) : (
                            timeLeft < 300 && (
                                <p className="text-xs text-danger-600 mt-1 font-medium">
                                    ⚠️ Less than 5 minutes left!
                                </p>
                            )
                        )}
                    </div>
                </div>
            </Card>

            {/* Progress Bar */}
            <Card className="fade-in">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
                    <span className="text-sm text-gray-600">
                        {answeredCount} of {totalQuestions} answered
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">
                    {progressPercentage.toFixed(1)}% Complete
                </p>
            </Card>

            {/* Question Navigation */}
            {totalQuestions > 1 && (
                <Card className="fade-in">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Navigation</h3>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                        {exam.questions && exam.questions.map((question, index) => {
                            const isAnswered = answers[question.id] !== undefined;
                            return (
                                <button
                                    key={question.id}
                                    onClick={() => {
                                        document.getElementById(`question-${question.id}`)?.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'start'
                                        });
                                    }}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-200 ${isAnswered
                                        ? 'bg-success-500 text-white hover:bg-success-600'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    title={`Question ${index + 1} - ${isAnswered ? 'Answered' : 'Not answered'}`}
                                >
                                    {index + 1}
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-3">
                        Click on a number to jump to that question
                    </p>
                </Card>
            )}

            {/* Questions */}
            <div className="space-y-6 fade-in">
                {exam.questions && exam.questions.map((question, index) => {
                    const isAnswered = answers[question.id] !== undefined;
                    return (
                        <Card key={question.id} id={`question-${question.id}`} className={`exam-card ${isAnswered ? 'border-success-200 bg-success-50' : 'border-gray-200'}`}>
                            <div className="flex items-start space-x-4">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isAnswered
                                    ? 'bg-success-500 text-white'
                                    : 'bg-gradient-primary text-white'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div className="flex-grow">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${isAnswered
                                            ? 'bg-success-100 text-success-700'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {isAnswered ? '✅ Answered' : '⏳ Not answered'}
                                        </span>
                                    </div>
                                    <QuestionCard
                                        q={question}
                                        value={answers[question.id]}
                                        onChange={(answer) => handleAnswerChange(question.id, answer)}
                                    />
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Action Buttons */}
            <Card className="fade-in">
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Button
                        onClick={() => navigate('/dashboard')}
                        variant="secondary"
                        size="lg"
                        className="w-full sm:w-auto"
                    >
                        ← Cancel Exam
                    </Button>
                    <Button
                        onClick={() => setShowConfirmSubmit(true)}
                        variant="success"
                        size="lg"
                        disabled={submitted}
                        className="w-full sm:w-auto"
                    >
                        {submitted ? 'Submitting...' : 'Submit Exam'}
                    </Button>
                </div>
            </Card>

            {/* Confirmation Modal */}
            {showConfirmSubmit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Card className="max-w-md w-full">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">⚠️</span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Confirm Submission
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Are you sure you want to submit your exam? You have answered{' '}
                                <span className="font-semibold">{answeredCount}</span> out of{' '}
                                <span className="font-semibold">{totalQuestions}</span> questions.
                            </p>

                            {answeredCount < totalQuestions && (
                                <div className="bg-warning-50 border border-warning-200 rounded-lg p-3 mb-4">
                                    <p className="text-sm text-warning-800">
                                        ⚠️ You have {totalQuestions - answeredCount} unanswered questions.
                                        You can still go back and answer them if you have time.
                                    </p>
                                </div>
                            )}

                            <div className="text-sm text-gray-600">
                                <p>Time remaining: <span className="font-semibold">{formatTime(timeLeft)}</span></p>
                                <p>Progress: <span className="font-semibold">{progressPercentage.toFixed(1)}%</span></p>
                            </div>
                            <div className="flex space-x-4">
                                <Button
                                    onClick={() => setShowConfirmSubmit(false)}
                                    variant="secondary"
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        setShowConfirmSubmit(false);
                                        handleSubmit();
                                    }}
                                    variant="success"
                                    className="flex-1"
                                >
                                    Submit Exam
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
