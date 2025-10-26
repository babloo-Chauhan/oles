import React, { useEffect, useState } from 'react';
import api from '../api';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner, { LoadingCard } from '../components/LoadingSpinner';

export default function AdminResults() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalExams: 0,
        averageScore: 0,
        passRate: 0
    });
    console.log("stats", stats);
    const [filter, setFilter] = useState('all'); // 'all', 'passed', 'failed'
    const [userIdFilter, setUserIdFilter] = useState('');
console.log("results", results);
    useEffect(() => {
        const fetchAllResults = async () => {
            try {
                setLoading(true);
                const response = await api.get('/admin/results');
                setResults(response.data);

                // Calculate statistics
                if (response.data.length > 0) {
                    const uniqueStudents = new Set(response.data.map(result => result.candidate?.username)).size;
                    const uniqueExams = new Set(response.data.map(result => result.exam?.title)).size;
                    const totalScore = response.data.reduce((sum, result) => sum + result.score, 0);
                    const totalPossible = response.data.reduce((sum, result) => sum + result.total, 0);
                    const averageScore = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
                    const passedResults = response.data.filter(result =>
                        Math.round((result.score / result.total) * 100) >= 60
                    );
                    const passRate = response.data.length > 0 ? Math.round((passedResults.length / response.data.length) * 100) : 0;

                    setStats({
                        totalStudents: uniqueStudents,
                        totalExams: uniqueExams,
                        averageScore,
                        passRate
                    });
                }
            } catch (error) {
                console.error('Failed to fetch results:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllResults();
    }, []);

    const fetchResultsByUser = async (userId) => {
        if (!userId) return;
        try {
            setLoading(true);
            const response = await api.get(`/admin/results/user/${userId}`);
            setResults(response.data);
            setFilter('all');
        } catch (err) {
            console.error('Failed to fetch results by user id', err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const calculatePercentage = (score, total) => {
        if (total === 0) return 0;
        return Math.round((score / total) * 100);
    };

    const getGradeColor = (percentage) => {
        if (percentage >= 80) return 'text-success-600';
        if (percentage >= 60) return 'text-warning-600';
        return 'text-danger-600';
    };

    const getGradeText = (percentage) => {
        if (percentage >= 90) return 'Excellent';
        if (percentage >= 80) return 'Good';
        if (percentage >= 70) return 'Satisfactory';
        if (percentage >= 60) return 'Pass';
        return 'Fail';
    };

    const filteredResults = results.filter(result => {
        const percentage = calculatePercentage(result.score, result.total);
        if (filter === 'passed') return percentage >= 60;
        if (filter === 'failed') return percentage < 60;
        return true;
    });

    if (loading) {
        return <LoadingCard message="Loading all student results..." />;
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="fade-in">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">📊 All Student Results</h1>
                        <p className="text-gray-600 mt-2">Monitor student performance across all exams</p>
                    </div>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 fade-in">
                <Card className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4">
                        <span className="text-2xl">👥</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.totalStudents}</h3>
                    <p className="text-gray-600">Total Students</p>
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
                        <span className="text-2xl">📈</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.averageScore}%</h3>
                    <p className="text-gray-600">Average Score</p>
                </Card>

                <Card className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg mx-auto mb-4">
                        <span className="text-2xl">✅</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.passRate}%</h3>
                    <p className="text-gray-600">Pass Rate</p>
                </Card>
            </div>

            {/* Filter Controls */}
            <Card className="fade-in">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Filter Results</h3>
                        <p className="text-sm text-gray-600">View results by performance</p>
                    </div>
                    <div className="flex space-x-2">
                        <div className="flex items-center space-x-2">
                            <input value={userIdFilter} onChange={e => setUserIdFilter(e.target.value)} placeholder="User ID" className="p-2 border rounded w-32" />
                            <Button onClick={() => fetchResultsByUser(userIdFilter)} variant="secondary" size="sm">By User</Button>
                        </div>
                        <Button
                            onClick={() => setFilter('all')}
                            variant={filter === 'all' ? 'primary' : 'secondary'}
                            size="sm"
                        >
                            All ({results.length})
                        </Button>
                        <Button
                            onClick={() => setFilter('passed')}
                            variant={filter === 'passed' ? 'primary' : 'secondary'}
                            size="sm"
                        >
                            Passed ({results.filter(r => calculatePercentage(r.score, r.total) >= 60).length})
                        </Button>
                        <Button
                            onClick={() => setFilter('failed')}
                            variant={filter === 'failed' ? 'primary' : 'secondary'}
                            size="sm"
                        >
                            Failed ({results.filter(r => calculatePercentage(r.score, r.total) < 60).length})
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Results Table */}
            {filteredResults.length === 0 ? (
                <Card className="text-center py-12 fade-in">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📊</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">
                        {filter === 'all'
                            ? 'No students have taken any exams yet.'
                            : `No students have ${filter === 'passed' ? 'passed' : 'failed'} any exams.`
                        }
                    </p>
                </Card>
            ) : (
                <div className="space-y-4 fade-in">
                    {filteredResults.map((result) => {
                        const percentage = calculatePercentage(result.score, result.total);
                        const gradeColor = getGradeColor(percentage);
                        const gradeText = getGradeText(percentage);

                        return (
                            <Card key={result.id} className="exam-card">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {result.exam?.title || 'Unknown Exam'}
                                                </h3>
                                                <p className="text-gray-600">
                                                    Student: <span className="font-medium">{result.candidate?.username || 'Unknown'}</span>
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Subject: {result.exam?.subject || 'N/A'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-2xl font-bold ${gradeColor}`}>
                                                    {percentage}%
                                                </div>
                                                <div className={`text-sm font-medium ${gradeColor}`}>
                                                    {gradeText}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mt-4">
                                            <div className="text-center">
                                                <div className="text-xl font-bold text-primary-600">
                                                    {result.score}/{result.total}
                                                </div>
                                                <div className="text-xs text-gray-500">Score</div>
                                            </div>
                                            <div className="text-center">
                                                <div className={`text-xl font-bold ${gradeColor}`}>
                                                    {percentage}%
                                                </div>
                                                <div className="text-xs text-gray-500">Percentage</div>
                                            </div>
                                            <div className="text-center">
                                                <div className={`text-lg font-semibold ${gradeColor}`}>
                                                    {gradeText}
                                                </div>
                                                <div className="text-xs text-gray-500">Grade</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="mt-4">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${percentage >= 80 ? 'bg-gradient-to-r from-success-500 to-success-600' :
                                                    percentage >= 60 ? 'bg-gradient-to-r from-warning-500 to-warning-600' :
                                                        'bg-gradient-to-r from-danger-500 to-danger-600'
                                                }`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
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
