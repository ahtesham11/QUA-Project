import axios from 'axios';
import type { Product, WizardAnswers, RecommendationResult, AssistantResponse } from './types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Products ─────────────────────────────────────────────────────────────

export async function fetchProducts(): Promise<Product[]> {
  const res = await api.get<Product[]>('/api/products/');
  return res.data;
}

export async function fetchProduct(productId: string): Promise<Product> {
  const res = await api.get<Product>(`/api/products/${productId}/`);
  return res.data;
}

// ─── Recommendation ────────────────────────────────────────────────────────

export async function getRecommendation(answers: WizardAnswers): Promise<RecommendationResult> {
  const res = await api.post<RecommendationResult>('/api/recommend/', answers);
  return res.data;
}

// ─── Assistant ─────────────────────────────────────────────────────────────

export async function askAssistant(question: string): Promise<AssistantResponse> {
  const res = await api.post<AssistantResponse>('/api/assistant/', { question });
  return res.data;
}
