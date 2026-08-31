import express from 'express';
import multer from 'multer';
import { parseVoiceText, processVoiceAudio } from '../controllers/voiceController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/voice/parse-text - Parse transcription into { amount, category, description, date, type }
router.post('/parse-text', parseVoiceText);

// POST /api/voice/process-audio - Upload audio file -> Whisper STT -> JSON
router.post('/process-audio', upload.single('audio'), processVoiceAudio);

export default router;
