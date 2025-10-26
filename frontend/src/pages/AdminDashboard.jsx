import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner, { LoadingCard } from '../components/LoadingSpinner';
import AdminResults from './AdminResults';

export default function AdminDashboard() {
    const [questions, setQuestions] = useState([]);
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState('');
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'questions', 'exams', 'manage', 'results'

    // Question form state
    const [question, setQuestion] = useState({
        subject: '',
        text: '',
        choice1: '',
        choice2: '',
        choice3: '',
        choice4: '',
        correctIndex: 1,
    });

    // Exam form state
    const [exam, setExam] = useState({
        title: '',
        subject: '',
        durationMinutes: '',
        startTime: '',
        endTime: '',
    });

    // Question-Exam management state
    const [selectedExam, setSelectedExam] = useState('');
    const [selectedQuestion, setSelectedQuestion] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [questionsRes, examsRes] = await Promise.all([
                api.get('/admin/questions'),
                api.get('/admin/exams')
            ]);
            setQuestions(questionsRes.data);
            setExams(examsRes.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveQuestion = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/questions', question);
            setSaved('✅ Question saved successfully!');
            setQuestion({
                subject: '',
                text: '',
                choice1: '',
                choice2: '',
                choice3: '',
                choice4: '',
                correctIndex: 1,
            });
            fetchData();
            setTimeout(() => setSaved(''), 3000);
        } catch {
            setSaved('❌ Failed to save question');
            setTimeout(() => setSaved(''), 3000);
        }
    };

    const handleSaveExam = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/exams', exam);
            setSaved('✅ Exam saved successfully!');
            setExam({
                title: '',
                subject: '',
                durationMinutes: '',
                startTime: '',
                endTime: '',
            });
            fetchData();
            setTimeout(() => setSaved(''), 3000);
        } catch {
            setSaved('❌ Failed to save exam');
            setTimeout(() => setSaved(''), 3000);
        }
    };

    const handleAttachQuestion = async () => {
        if (!selectedExam || !selectedQuestion) {
            setSaved('❌ Please select both exam and question!');
            setTimeout(() => setSaved(''), 3000);
            return;
        }

        try {
            await api.post(`/admin/exams/${selectedExam}/addQuestion/${selectedQuestion}`);
            setSaved('✅ Question attached to exam successfully!');
            setTimeout(() => setSaved(''), 3000);
        } catch {
            setSaved('❌ Failed to attach question');
            setTimeout(() => setSaved(''), 3000);
        }
    };

    const handleDeleteQuestion = async (id) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await api.delete(`/admin/questions/${id}`);
                setSaved('✅ Question deleted successfully!');
                fetchData();
                setTimeout(() => setSaved(''), 3000);
            } catch {
                setSaved('❌ Failed to delete question');
                setTimeout(() => setSaved(''), 3000);
            }
        }
    };

    if (loading) {
        return <LoadingCard message="Loading admin dashboard..." />;
    }

    const stats = {
        totalQuestions: questions.length,
        totalExams: exams.length,
        activeExams: exams.filter(exam => {
            const now = new Date();
            const startTime = new Date(exam.startTime);
            const endTime = new Date(exam.endTime);
            return now >= startTime && now <= endTime;
        }).length,
        subjects: [...new Set(questions.map(q => q.subject))].length
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="fade-in">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-2">Manage your examination portal</p>
                    </div>
                    <Link to="/dashboard">
                        <Button variant="secondary">
                            ← Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Status Message */}
            {saved && (
                <div className={`fade-in p-4 rounded-lg ${saved.includes('✅')
                    ? 'bg-success-50 text-success-800 border border-success-200'
                    : 'bg-danger-50 text-danger-800 border border-danger-200'
                    }`}>
                    <div className="flex items-center">
                        <span className="mr-2">{saved.includes('✅') ? '✅' : '❌'}</span>
                        {saved}
                    </div>
                </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 fade-in">
                <Card className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4">
                        <span className="text-2xl">📝</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</h3>
                    <p className="text-gray-600">Total Questions</p>
                </Card>

                <Card className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-success-100 rounded-lg mx-auto mb-4">
                        <span className="text-2xl">📚</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.totalExams}</h3>
                    <p className="text-gray-600">Total Exams</p>
                </Card>

                <Card className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-warning-100 rounded-lg mx-auto mb-4">
                        <span className="text-2xl">⚡</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.activeExams}</h3>
                    <p className="text-gray-600">Active Exams</p>
                </Card>

                <Card className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mx-auto mb-4">
                        <span className="text-2xl">📖</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.subjects}</h3>
                    <p className="text-gray-600">Subjects</p>
                </Card>
            </div>

            {/* Tab Navigation */}
            <div className="fade-in">
                <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-lg">
                    {[
                        { id: 'overview', label: '📊 Overview', icon: '📊' },
                        { id: 'questions', label: '📝 Questions', icon: '📝' },
                        { id: 'exams', label: '📚 Exams', icon: '📚' },
                        { id: 'manage', label: '🔗 Manage', icon: '🔗' },
                        { id: 'results', label: '📈 Results', icon: '📈' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center px-4 py-2 rounded-md font-medium transition-all duration-200 ${activeTab === tab.id
                                ? 'bg-white text-primary-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-8 fade-in">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Questions */}
                        <Card>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Recent Questions</h3>
                                <span className="text-sm text-gray-500">{questions.length} total</span>
                            </div>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {questions.slice(0, 5).map(q => (
                                    <div key={q.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-primary-600">Q</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{q.subject}</p>
                                            <p className="text-sm text-gray-600 line-clamp-2">{q.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {questions.length === 0 && (
                                    <p className="text-center text-gray-500 py-4">No questions created yet</p>
                                )}
                            </div>
                        </Card>

                        {/* Recent Exams */}
                        <Card>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Recent Exams</h3>
                                <span className="text-sm text-gray-500">{exams.length} total</span>
                            </div>
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {exams.slice(0, 5).map(exam => (
                                    <div key={exam.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0 w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-success-600">E</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">{exam.title}</p>
                                            <p className="text-sm text-gray-600">{exam.subject} • {exam.durationMinutes} min</p>
                                            <p className="text-xs text-gray-500">
                                                {exam.questions?.length || 0} questions
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {exams.length === 0 && (
                                    <p className="text-center text-gray-500 py-4">No exams created yet</p>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card className="bg-gradient-to-r from-primary-50 to-indigo-50 border-primary-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => setActiveTab('questions')}
                                className="flex items-center p-4 bg-white rounded-lg hover:shadow-md transition-all duration-200"
                            >
                                <span className="text-2xl mr-3">📝</span>
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">Add Question</p>
                                    <p className="text-sm text-gray-600">Create new questions</p>
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('exams')}
                                className="flex items-center p-4 bg-white rounded-lg hover:shadow-md transition-all duration-200"
                            >
                                <span className="text-2xl mr-3">📚</span>
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">Create Exam</p>
                                    <p className="text-sm text-gray-600">Set up new exams</p>
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('manage')}
                                className="flex items-center p-4 bg-white rounded-lg hover:shadow-md transition-all duration-200"
                            >
                                <span className="text-2xl mr-3">🔗</span>
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">Manage</p>
                                    <p className="text-sm text-gray-600">Link questions to exams</p>
                                </div>
                            </button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Results Tab */}
            {activeTab === 'results' && (
                <div className="fade-in">
                    <AdminResults />
                </div>
            )}

            {/* Questions Tab */}
            {activeTab === 'questions' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 fade-in">
                    {/* Add Question Form */}
                    <Card>
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-xl">➕</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Add New Question</h2>
                                <p className="text-sm text-gray-600">Create questions for your exams</p>
                            </div>
                        </div>

                        <form onSubmit={handleSaveQuestion} className="space-y-4">
                            <div>
                                <label className="label">Subject</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Mathematics, Science, English"
                                    value={question.subject}
                                    onChange={(e) => setQuestion({ ...question, subject: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Question Text</label>
                                <textarea
                                    placeholder="Enter your question here..."
                                    value={question.text}
                                    onChange={(e) => setQuestion({ ...question, text: e.target.value })}
                                    className="input-field"
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="label">Answer Choices</label>
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="flex items-center space-x-3">
                                        <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                                            {String.fromCharCode(64 + i)}
                                        </span>
                                        <input
                                            type="text"
                                            placeholder={`Option ${i}`}
                                            value={question[`choice${i}`]}
                                            onChange={(e) => setQuestion({ ...question, [`choice${i}`]: e.target.value })}
                                            className="input-field flex-1"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label className="label">Correct Answer</label>
                                <select
                                    value={question.correctIndex}
                                    onChange={(e) => setQuestion({ ...question, correctIndex: parseInt(e.target.value) })}
                                    className="input-field"
                                    required
                                >
                                    <option value={1}>A - {question.choice1 || 'Option 1'}</option>
                                    <option value={2}>B - {question.choice2 || 'Option 2'}</option>
                                    <option value={3}>C - {question.choice3 || 'Option 3'}</option>
                                    <option value={4}>D - {question.choice4 || 'Option 4'}</option>
                                </select>
                            </div>

                            <Button
                                type="submit"
                                variant="success"
                                size="lg"
                                className="w-full"
                            >
                                💾 Save Question
                            </Button>
                        </form>
                    </Card>

                    {/* Questions List */}
                    <Card>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                                    <span className="text-xl">📋</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">All Questions</h2>
                                    <p className="text-sm text-gray-600">{questions.length} questions created</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {questions.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <span className="text-xl">📝</span>
                                    </div>
                                    <p>No questions created yet</p>
                                    <p className="text-sm mt-1">Create your first question using the form on the left!</p>
                                </div>
                            ) : (
                                questions.map(q => (
                                    <div key={q.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-200 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                                                        {q.subject}
                                                    </span>
                                                </div>
                                                <p className="font-medium text-gray-900 mb-1">{q.text}</p>
                                                <p className="text-sm text-gray-600">
                                                    Correct Answer: {String.fromCharCode(64 + q.correctIndex)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteQuestion(q.id)}
                                                className="ml-2 p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                                                title="Delete question"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            )}

            {/* Exams Tab */}
            {activeTab === 'exams' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Add Exam Form */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">➕ Add New Exam</h2>
                        <form onSubmit={handleSaveExam} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Exam Title"
                                value={exam.title}
                                onChange={(e) => setExam({ ...exam, title: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Subject"
                                value={exam.subject}
                                onChange={(e) => setExam({ ...exam, subject: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Duration (minutes)"
                                value={exam.durationMinutes}
                                onChange={(e) => setExam({ ...exam, durationMinutes: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                    <input
                                        type="datetime-local"
                                        value={exam.startTime}
                                        onChange={(e) => setExam({ ...exam, startTime: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                    <input
                                        type="datetime-local"
                                        value={exam.endTime}
                                        onChange={(e) => setExam({ ...exam, endTime: e.target.value })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                            >
                                Save Exam
                            </button>
                        </form>
                    </div>

                    {/* Exams List */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold mb-4">📋 All Exams ({exams.length})</h2>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {exams.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No exams created yet.</p>
                                    <p className="text-sm mt-2">Create your first exam using the form on the left!</p>
                                </div>
                            ) : (
                                exams.map(e => (
                                    <div key={e.id} className="border border-gray-200 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-900">{e.title}</h3>
                                        <p className="text-sm text-gray-600">Subject: {e.subject}</p>
                                        <p className="text-sm text-gray-600">Duration: {e.durationMinutes} minutes</p>
                                        <p className={`text-sm ${e.questions?.length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            Questions: {e.questions?.length || 0}
                                            {e.questions?.length === 0 && ' (No questions attached!)'}
                                        </p>
                                        {e.startTime && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Available: {new Date(e.startTime).toLocaleDateString()} - {new Date(e.endTime).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Manage Tab */}
            {activeTab === 'manage' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">🔗 Attach Questions to Exams</h2>

                    {exams.length === 0 || questions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p className="mb-2">You need both exams and questions to attach them together.</p>
                            <p className="text-sm">
                                {exams.length === 0 && "Create some exams first. "}
                                {questions.length === 0 && "Create some questions first."}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    💡 <strong>Tip:</strong> Questions are automatically attached to exams with matching subjects when the server starts.
                                    Use this tool to manually attach additional questions or change assignments.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Exam</label>
                                    <select
                                        value={selectedExam}
                                        onChange={(e) => setSelectedExam(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">-- Choose Exam --</option>
                                        {exams.map(e => (
                                            <option key={e.id} value={e.id}>
                                                {e.title} ({e.subject}) - {e.questions?.length || 0} questions
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Question</label>
                                    <select
                                        value={selectedQuestion}
                                        onChange={(e) => setSelectedQuestion(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">-- Choose Question --</option>
                                        {questions.map(q => (
                                            <option key={q.id} value={q.id}>
                                                {q.subject}: {q.text.substring(0, 50)}...
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <button
                                onClick={handleAttachQuestion}
                                className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                            >
                                Attach Question to Exam
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
