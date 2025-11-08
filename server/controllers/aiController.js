import OpenAI from "openai";
import prisma from '../configs/db.js';
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'
import pdf from 'pdf-parse/lib/pdf-parse.js'
import FormData from 'form-data'

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req, res)=>{
    try {
        const userId = req.userId; // From JWT auth middleware
        const { prompt, length } = req.body;

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: length,
        });

        const content = response.choices[0].message.content;

        await prisma.creation.create({
            data: {
                userId,
                prompt,
                content,
                type: 'article'
            }
        });

        res.json({ success: true, content });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const generateBlogTitle = async (req, res)=>{
    try {
        const userId = req.userId; // From JWT auth middleware
        const { prompt } = req.body;

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 100,
        });

        const content = response.choices[0].message.content;

        await prisma.creation.create({
            data: {
                userId,
                prompt,
                content,
                type: 'blog-title'
            }
        });

        res.json({ success: true, content });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const generateImage = async (req, res)=>{
    try {
        const userId = req.userId; // From JWT auth middleware
        const { prompt, publish } = req.body;

        console.log('🎨 Image generation request:', { prompt });
        
        // Using Pollinations.ai - Completely FREE, no API key needed!
        const cleanPrompt = prompt.trim().replace(/\s+/g, ' ');
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}`;
        
        console.log('📡 Fetching image from Pollinations.ai...');
        console.log('URL:', imageUrl);
        
        // Download the image with proper headers
        const response = await axios({
            method: 'GET',
            url: imageUrl,
            responseType: 'arraybuffer',
            timeout: 90000,
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Accept': 'image/*'
            },
            maxRedirects: 5,
        });

        console.log('✅ Image fetched, size:', response.data.length, 'bytes');

        const base64Image = `data:image/jpeg;base64,${Buffer.from(response.data).toString('base64')}`;

        console.log('☁️ Uploading to Cloudinary...');
        const { secure_url } = await cloudinary.uploader.upload(base64Image, {
            folder: 'aivora-generations',
            resource_type: 'image'
        });
        console.log('✅ Uploaded to Cloudinary:', secure_url);

        await prisma.creation.create({
            data: {
                userId,
                prompt,
                content: secure_url,
                type: 'image',
                publish: publish ?? false
            }
        });

        res.json({ success: true, content: secure_url });

    } catch (error) {
        console.error('❌ Image generation error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            message: error.message
        });
        
        // Better error handling
        let errorMessage = 'Failed to generate image. Please try again.';
        if (error.code === 'ECONNABORTED') {
            errorMessage = 'Request timeout. Please try again.';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        res.json({ success: false, message: errorMessage });
    }
}

export const removeImageBackground = async (req, res)=>{
    try {
        const userId = req.userId; // From JWT auth middleware
        const image = req.file;

        const { secure_url } = await cloudinary.uploader.upload(image.path, {
            transformation: [
                {
                    effect: 'background_removal',
                    background_removal: 'remove_the_background'
                }
            ]
        });

        await prisma.creation.create({
            data: {
                userId,
                prompt: 'Remove background from image',
                content: secure_url,
                type: 'image'
            }
        });

        res.json({ success: true, content: secure_url });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const removeImageObject = async (req, res)=>{
    try {
        const userId = req.userId; // From JWT auth middleware
        const { object } = req.body;
        const image = req.file;

        const { public_id } = await cloudinary.uploader.upload(image.path);

        const imageUrl = cloudinary.url(public_id, {
            transformation: [{ effect: `gen_remove:${object}` }],
            resource_type: 'image'
        });

        await prisma.creation.create({
            data: {
                userId,
                prompt: `Removed ${object} from image`,
                content: imageUrl,
                type: 'image'
            }
        });

        res.json({ success: true, content: imageUrl });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export const resumeReview = async (req, res)=>{
    try {
        const userId = req.userId; // From JWT auth middleware
        const resume = req.file;

        if(resume.size > 5 * 1024 * 1024){
            return res.json({ success: false, message: "Resume file size exceeds allowed size (5MB)." });
        }

        const dataBuffer = fs.readFileSync(resume.path);
        const pdfData = await pdf(dataBuffer);

        const prompt = `Review the following resume and provide constructive feedback on its strengths, weaknesses, and areas for improvement. Resume Content:\n\n${pdfData.text}`;

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1000,
        });

        const content = response.choices[0].message.content;

        await prisma.creation.create({
            data: {
                userId,
                prompt: 'Review the uploaded resume',
                content,
                type: 'resume-review'
            }
        });

        res.json({ success: true, content });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
