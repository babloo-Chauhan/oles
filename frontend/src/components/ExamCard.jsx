import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import Button from './Button';

const ExamCard = ({ exam }) => {
    const getStatus = (exam) => {
        const now = new Date();
        const startTime = new Date(exam.startTime);
        const endTime = new Date(exam.endTime);

        if (now < startTime) return { status: 'upcoming', color: 'warning', text: 'Upcoming' };
        if (now > endTime) return { status: 'ended', color: 'danger', text: 'Ended' };
        return { status: 'active', color: 'success', text: 'Active' };
    };

    const status = getStatus(exam);
    const canStart = status.status === 'active';

    return (
        <Card className="exam-card group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {exam.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">📘 {exam.subject}</p>
                </div>
                <span className={`status-badge ${status.color}`}>
                    {status.text}
                </span>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 mr-2">⏳</span>
                    <span>{exam.durationMinutes} minutes</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                    <span className="w-4 h-4 mr-2">📝</span>
                    <span>{exam.questions?.length || 0} questions</span>
                </div>
                {exam.startTime && (
                    <div className="text-xs text-gray-500 mt-2">
                        <div className="flex items-center">
                            <span className="w-3 h-3 mr-1">🕒</span>
                            <span>
                                {new Date(exam.startTime).toLocaleDateString()} - {new Date(exam.endTime).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                    {canStart ? 'Ready to start' : 'Not available'}
                </div>
                {canStart ? (
                    <Link to={`/exam/${exam.id}`}>
                        <Button size="sm" className="shadow-sm">
                            Start Exam
                        </Button>
                    </Link>
                ) : (
                    <Button size="sm" variant="secondary" disabled>
                        {status.status === 'upcoming' ? 'Coming Soon' : 'Ended'}
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default ExamCard;
