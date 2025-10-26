import React, { useEffect, useState, useCallback } from "react";
import api from "../api";
import { Link } from "react-router-dom";
import ExamCard from "../components/ExamCard";
import Card from "../components/Card";
import Button from "../components/Button";
import LoadingSpinner, { LoadingCard } from "../components/LoadingSpinner";

export default function Dashboard() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalExams: 0,
        activeExams: 0,
        completedExams: 0
    });
    const role = localStorage.getItem("role");

    const fetchExams = useCallback(async () => {
        try {
            setLoading(true);
            if (role === "ADMIN") {
                const res = await api.get("/admin/exams");
                setExams(res.data);
            } else {
                const res = await api.get("/candidate/exams");
                setExams(res.data);
            }
        } catch (err) {
            console.error("Error fetching exams", err);
        } finally {
            setLoading(false);
        }
    }, [role]);

    useEffect(() => {
        fetchExams();
    }, [fetchExams]);

    useEffect(() => {
        if (exams.length > 0) {
            const now = new Date();
            const activeExams = exams.filter(exam => {
                const startTime = new Date(exam.startTime);
                const endTime = new Date(exam.endTime);
                return now >= startTime && now <= endTime;
            }).length;

            const completedExams = exams.filter(exam => {
                const endTime = new Date(exam.endTime);
                return now > endTime;
            }).length;

            setStats({
                totalExams: exams.length,
                activeExams,
                completedExams
            });
        }
    }, [exams]);

    if (loading) {
        return <LoadingCard message="Loading your dashboard..." />;
    }

    return (
        <div className="space-y-8">
            {/* Tailwind quick-test banner (set localStorage.debugTailwind = '1' to show) */}
            {typeof window !== 'undefined' && localStorage.getItem('debugTailwind') === '1' && (
                <div className="p-3 bg-red-500 text-white rounded">Tailwind is working ✅</div>
            )}
            {/* Welcome Section */}
            <div className="fade-in">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome back, {localStorage.getItem('username')}! 👋
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {role === 'ADMIN'
                                ? 'Manage your examination portal and monitor student progress.'
                                : 'Ready to take your next exam? Choose from the available tests below.'
                            }
                        </p>
                    </div>
                    {role === "ADMIN" && (
                        <Link to="/admin">
                            <Button variant="primary" size="lg">
                                ⚙️ Admin Panel
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-in">
                <Card className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mx-auto mb-4">
                        <span className="text-2xl">📚</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.totalExams}</h3>
                    <p className="text-gray-600">Total Exams</p>
                </Card>

                <Card className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-success-100 rounded-lg mx-auto mb-4">
                        <span className="text-2xl">✅</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.activeExams}</h3>
                    <p className="text-gray-600">Active Now</p>
                </Card>

                <Card className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-warning-100 rounded-lg mx-auto mb-4">
                        <span className="text-2xl">🏁</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.completedExams}</h3>
                    <p className="text-gray-600">Completed</p>
                </Card>
            </div>

            {/* Exams Section */}
            <div className="fade-in">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Available Exams</h2>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span className="w-2 h-2 bg-success-500 rounded-full"></span>
                        <span>{exams.length} exams available</span>
                    </div>
                </div>

                {exams.length === 0 ? (
                    <Card className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📝</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No exams available</h3>
                        {role === "ADMIN" ? (
                            <div className="space-y-4">
                                <p className="text-gray-600">Create your first exam to get started.</p>
                                <Link to="/admin">
                                    <Button variant="primary">
                                        ⚙️ Go to Admin Panel
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-gray-600">Contact your administrator to add exams.</p>
                                <p className="text-sm text-gray-500">
                                    Default login: username: "student", password: "Admin@123"
                                </p>
                            </div>
                        )}
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam) => (
                            <ExamCard key={exam.id} exam={exam} />
                        ))}
                    </div>
                )}
                
            </div>

            {/* Quick Actions */}
            <div className="fade-in">
                <Card className="bg-gradient-to-r from-primary-50 to-indigo-50 border-primary-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                            <p className="text-gray-600">Access your results and manage your account</p>
                        </div>
                        <div className="flex space-x-3">
                            <Link to="/results">
                                <Button variant="secondary">
                                    📊 View Results
                                </Button>
                            </Link>
                            {role === "ADMIN" && (
                                <Link to="/admin">
                                    <Button variant="primary">
                                        ⚙️ Admin Panel
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function AdminBox({ onExamAdded }) {
    const [q, setQ] = useState({
        subject: "",
        text: "",
        choice1: "",
        choice2: "",
        choice3: "",
        choice4: "",
        correctIndex: 1,
    });

    const [exam, setExam] = useState({
        title: "",
        subject: "",
        durationMinutes: "",
        startTime: "",
        endTime: "",
    });

    const [exams, setExams] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [selectedExam, setSelectedExam] = useState("");
    const [selectedQuestion, setSelectedQuestion] = useState("");
    const [saved, setSaved] = useState("");

    useEffect(() => {
        api.get("/admin/exams").then((r) => setExams(r.data));
        api.get("/admin/questions").then((r) => setQuestions(r.data));
    }, [saved]);

    const saveQ = async () => {
        await api.post("/admin/questions", q);
        setSaved("✅ Question saved");
        setQ({
            subject: "",
            text: "",
            choice1: "",
            choice2: "",
            choice3: "",
            choice4: "",
            correctIndex: 1,
        });
    };

    const saveExam = async () => {
        await api.post("/admin/exams", exam);
        setSaved("✅ Exam saved");
        setExam({
            title: "",
            subject: "",
            durationMinutes: "",
            startTime: "",
            endTime: "",
        });
        if (onExamAdded) onExamAdded();
    };

    const attachQuestion = async () => {
        if (!selectedExam || !selectedQuestion)
            return alert("Pick exam and question first!");
        await api.post(
            `/admin/exams/${selectedExam}/addQuestion/${selectedQuestion}`
        );
        setSaved("✅ Question attached to Exam");
    };

    return (
        <div className="mt-10 p-6 border rounded-xl bg-gray-50 shadow-inner">
            <h2 className="text-xl font-bold mb-4">⚙️ Admin Controls</h2>

            {/* Add Question */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">➕ Add Question</h3>
                {["subject", "text", "choice1", "choice2", "choice3", "choice4"].map(
                    (k) => (
                        <input
                            key={k}
                            placeholder={k}
                            value={q[k]}
                            onChange={(e) => setQ({ ...q, [k]: e.target.value })}
                            className="w-full p-2 mb-2 border rounded"
                        />
                    )
                )}
                <label className="block mb-2">
                    Correct Option (1-4):
                    <input
                        type="number"
                        min="1"
                        max="4"
                        value={q.correctIndex}
                        onChange={(e) =>
                            setQ({ ...q, correctIndex: +e.target.value })
                        }
                        className="ml-2 p-1 border rounded"
                    />
                </label>
                <button
                    onClick={saveQ}
                    className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                >
                    Save Question
                </button>
            </div>

            {/* Add Exam */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">📝 Add Exam</h3>
                <input
                    placeholder="Title"
                    value={exam.title}
                    onChange={(e) => setExam({ ...exam, title: e.target.value })}
                    className="w-full p-2 mb-2 border rounded"
                />
                <input
                    placeholder="Subject"
                    value={exam.subject}
                    onChange={(e) => setExam({ ...exam, subject: e.target.value })}
                    className="w-full p-2 mb-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={exam.durationMinutes}
                    onChange={(e) =>
                        setExam({ ...exam, durationMinutes: e.target.value })
                    }
                    className="w-full p-2 mb-2 border rounded"
                />
                <label className="block mb-2">
                    Start Time:
                    <input
                        type="datetime-local"
                        value={exam.startTime}
                        onChange={(e) =>
                            setExam({ ...exam, startTime: e.target.value })
                        }
                        className="w-full p-2 mt-1 border rounded"
                    />
                </label>
                <label className="block mb-2">
                    End Time:
                    <input
                        type="datetime-local"
                        value={exam.endTime}
                        onChange={(e) =>
                            setExam({ ...exam, endTime: e.target.value })
                        }
                        className="w-full p-2 mt-1 border rounded"
                    />
                </label>
                <button
                    onClick={saveExam}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                    Save Exam
                </button>
            </div>

            {/* Attach Question to Exam */}
            <div>
                <h3 className="text-lg font-semibold mb-2">
                    🔗 Attach Question to Exam
                </h3>
                <select
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                    className="p-2 border rounded mr-2"
                >
                    <option value="">-- Choose Exam --</option>
                    {exams.map((e) => (
                        <option key={e.id} value={e.id}>
                            {e.title}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedQuestion}
                    onChange={(e) => setSelectedQuestion(e.target.value)}
                    className="p-2 border rounded mr-2"
                >
                    <option value="">-- Choose Question --</option>
                    {questions.map((q) => (
                        <option key={q.id} value={q.id}>
                            {q.text}
                        </option>
                    ))}
                </select>

                <button
                    onClick={attachQuestion}
                    className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
                >
                    Attach
                </button>
            </div>

            {saved && <div className="mt-4 text-green-700">{saved}</div>}
        </div>
    );
}
