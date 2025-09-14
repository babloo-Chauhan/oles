import React, { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const [exams, setExams] = useState([]);
    const role = localStorage.getItem("role");

    const fetchExams = async () => {
        try {
            if (role === "ADMIN") {
                const res = await api.get("/admin/exams");
                setExams(res.data);
            } else {
                const res = await api.get("/candidate/exams");
                setExams(res.data);
            }
        } catch (err) {
            console.error("Error fetching exams", err);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">📚 Available Exams</h2>

            {/* Exam List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map((e) => (
                    <div
                        key={e.id}
                        className="p-4 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition bg-white"
                    >
                        <h3 className="text-lg font-semibold">{e.title}</h3>
                        <p className="text-sm text-gray-600">📘 {e.subject}</p>
                        <p className="text-sm mt-1">⏳ {e.durationMinutes} minutes</p>
                        {e.startTime && (
                            <p className="text-xs text-gray-500 mt-1">
                                🕒 {new Date(e.startTime).toLocaleString()} →{" "}
                                {new Date(e.endTime).toLocaleString()}
                            </p>
                        )}
                        <Link
                            to={`/exam/${e.id}`}
                            className="inline-block mt-3 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            Start Exam
                        </Link>
                    </div>
                ))}
            </div>

            <div className="mt-8">
                <Link
                    to="/results"
                    className="text-blue-700 underline hover:text-blue-900"
                >
                    📊 My Results
                </Link>
            </div>

            {/* Only show Admin Controls if role is ADMIN */}
            {role === "ADMIN" && <AdminBox onExamAdded={fetchExams} />}
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
