import React from 'react';

const QuestionCard = ({ q, value, onChange }) => {
    const choices = [q.choice1, q.choice2, q.choice3, q.choice4];

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {q.text}
                </h3>
                <p className="text-sm text-gray-600">
                    Subject: <span className="font-medium">{q.subject}</span>
                </p>
            </div>

            <div className="space-y-3">
                {choices.map((choice, index) => (
                    <label
                        key={index}
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-sm ${value === index + 1
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <input
                            type="radio"
                            name={`question-${q.id}`}
                            value={index + 1}
                            checked={value === index + 1}
                            onChange={() => onChange(index + 1)}
                            className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${value === index + 1
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300'
                            }`}>
                            {value === index + 1 && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                        </div>
                        <div className="flex-1">
                            <span className="font-medium text-gray-700">
                                {String.fromCharCode(65 + index)}.
                            </span>
                            <span className="ml-2 text-gray-700">{choice}</span>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
};

export default QuestionCard;