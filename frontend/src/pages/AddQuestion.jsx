import React from "react";

export default function AddQuestion() {
    return (
        <div>
            <h2>Add Question</h2>
            {/* Add your form and logic here */}
            <form>
                <div>
                    <label>Question:</label>
                    <input type="text" name="question" />
                </div>
                <div>
                    <label>Options:</label>
                    <input type="text" name="option1" placeholder="Option 1" />
                    <input type="text" name="option2" placeholder="Option 2" />
                    <input type="text" name="option3" placeholder="Option 3" />
                    <input type="text" name="option4" placeholder="Option 4" />
                </div>
                <div>
                    <label>Correct Answer:</label>
                    <input type="text" name="answer" />
                </div>
                <button type="submit">Add Question</button>
            </form>
            <div>
                <h3>Development Commands</h3>
                <p>To start the development server, run:</p>
                <code>npm run dev</code>
            </div>
        </div>
    );
}