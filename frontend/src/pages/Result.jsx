import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner, { LoadingCard } from '../components/LoadingSpinner';

export default function Result() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalExams: 0,
        averageScore: 0,
        highestScore: 0,
        passedExams: 0
    });

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await api.get('/candidate/results');
                setItems(response.data);

                // Calculate statistics
                if (response.data.length > 0) {
                    const totalExams = response.data.length;
                    const totalScore = response.data.reduce((sum, result) => sum + result.score, 0);
                    const totalPossible = response.data.reduce((sum, result) => sum + result.total, 0);
                    const averageScore = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
                    const highestScore = Math.max(...response.data.map(result =>
                        Math.round((result.score / result.total) * 100)
                    ));
                    const passedExams = response.data.filter(result =>
                        Math.round((result.score / result.total) * 100) >= 60
                    ).length;

                    setStats({
                        totalExams,
                        averageScore,
                        highestScore,
                        passedExams
                    });
                }
            } catch (error) {
                console.error('Failed to fetch results:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    const calculatePercentage = (score, total) => {
        if (total === 0) return 0;
        return Math.round((score / total) * 100);
    };

    const getGradeColor = (percentage) => {
        if (percentage >= 80) return 'text-green-600';
        if (percentage >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getGradeText = (percentage) => {
        if (percentage >= 90) return 'Excellent';
        if (percentage >= 80) return 'Good';
        if (percentage >= 70) return 'Satisfactory';
        if (percentage >= 60) return 'Pass';
        return 'Fail';
    };

    if (loading) {
        return <LoadingCard message="Loading your results..." />;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="fade-in">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">📊 My Exam Results</h1>
                        <p className="text-gray-600 mt-2">Track your performance and progress</p>
                    </div>
                    <Link to="/dashboard">
                        <Button variant="secondary">
                            ← Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Statistics Cards */}
            {items.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 fade-in">
                    <Card className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4">
                            <span className="text-2xl">📚</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.totalExams}</h3>
                        <p className="text-gray-600">Total Exams</p>
                    </Card>

                    <Card className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-success-100 rounded-lg mx-auto mb-4">
                            <span className="text-2xl">📈</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.averageScore}%</h3>
                        <p className="text-gray-600">Average Score</p>
                    </Card>

                    <Card className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-warning-100 rounded-lg mx-auto mb-4">
                            <span className="text-2xl">🏆</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.highestScore}%</h3>
                        <p className="text-gray-600">Highest Score</p>
                    </Card>

                    <Card className="text-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mx-auto mb-4">
                            <span className="text-2xl">✅</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.passedExams}</h3>
                        <p className="text-gray-600">Passed Exams</p>
                    </Card>
                </div>
            )}

            {/* Results */}
            {items.length === 0 ? (
                <Card className="text-center py-12 fade-in">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📊</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No exam results found</h3>
                    <p className="text-gray-600 mb-6">Take some exams to see your results here!</p>
                    <Link to="/dashboard">
                        <Button variant="primary">
                            Browse Exams
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="space-y-6 fade-in">
                    {items.map((result) => {
                        const percentage = calculatePercentage(result.score, result.total);
                        const gradeColor = getGradeColor(percentage);
                        const gradeText = getGradeText(percentage);

                        return (
                            <Card key={result.id} className="exam-card">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {result.exam?.title || 'Unknown Exam'}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            Subject: {result.exam?.subject || 'N/A'}
                                        </p>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-primary-600">
                                                    {result.score}/{result.total}
                                                </div>
                                                <div className="text-sm text-gray-500">Score</div>
                                            </div>
                                            <div className="text-center">
                                                <div className={`text-2xl font-bold ${gradeColor}`}>
                                                    {percentage}%
                                                </div>
                                                <div className="text-sm text-gray-500">Percentage</div>
                                            </div>
                                            <div className="text-center">
                                                <div className={`text-lg font-semibold ${gradeColor}`}>
                                                    {gradeText}
                                                </div>
                                                <div className="text-sm text-gray-500">Grade</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0">
                                        <div className="w-20 h-20 rounded-full flex items-center justify-center border-4 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
                                            <div className={`text-xl font-bold ${gradeColor}`}>
                                                {percentage}%
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="mt-6">
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className={`h-3 rounded-full transition-all duration-500 ${percentage >= 80 ? 'bg-gradient-to-r from-success-500 to-success-600' :
                                                percentage >= 60 ? 'bg-gradient-to-r from-warning-500 to-warning-600' :
                                                    'bg-gradient-to-r from-danger-500 to-danger-600'
                                                }`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                                        <span>0%</span>
                                        <span className="font-medium">{percentage}%</span>
                                        <span>100%</span>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}