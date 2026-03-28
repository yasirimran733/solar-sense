import mongoose from "mongoose";
const counterSchema = new mongoose.Schema({
    date: {
        type: String, // e.g. "2026-03-28"
        required: true,
        unique: true
    },
    seq: {
        type: Number,
        default: 0
    }
});

const Counter = mongoose.model("Counter", counterSchema);
export default Counter