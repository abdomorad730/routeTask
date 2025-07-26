import noteModel from "../../DB/models/note.model.js";
import { OpenAI } from "openai";






export const summarizeNote = async (req, res, next) => {
    try {
        if (!process.env.OPENROUTER_API_KEY) {
            return res.status(404).json({ msg: "Note not found" });

        }
        const openai = new OpenAI({
            apiKey: process.env.OPENROUTER_API_KEY,
            baseURL: 'https://openrouter.ai/api/v1',
            defaultHeaders: {
                'HTTP-Referer': 'http://localhost',
                'X-Title': 'Note Summarizer App',
            }
        });
        const { id } = req.params;

        const note = await noteModel.findById(id);
        if (!note) {
            return res.status(404).json({ msg: "Note not found" });
        }

        const completion = await openai.chat.completions.create({
            model: "anthropic/claude-3-haiku:beta", 
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant that summarizes note content into a clear, short paragraph.",
                },
                {
                    role: "user",
                    content: `Please summarize the following in 3 sentences:\n\n${note.content}`,
                },
            ],
        });

        const summary = completion.choices[0].message.content;
        return res.status(200).json({ summary });

    } catch (error) {
        console.error("Summarization Error:", error);
        return res.status(500).json({ msg: "Failed to summarize", error: error.message });
    }
};
export const addNote = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const note = await noteModel.create({ title, content, user: req.user._id });
        return res.status(201).json({ msg: 'Note added successfully', note });
    } catch (error) {
        next(error);
    }
};

export const deleteNote = async (req, res, next) => {
    try {
        const { id } = req.params;

        const note = await noteModel.findById(id).lean();
        if (!note) {
            return res.status(404).json({ msg: 'Note not found' });
        }

        if (!note.user.equals(req.user._id)) {
            return res.status(403).json({ msg: 'Access denied: not your note' });
        }

        await noteModel.findByIdAndDelete(id);
        return res.status(200).json({ msg: 'Note deleted successfully' });
    } catch (error) {
        next(error);
    }
};
