// ─── Product Types ─────────────────────────────────────────────────────────

export interface Product {
  id: number;
  product_id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  best_for: string[];
  // Feature flags
  salary_income: boolean;
  student_income: boolean;
  medical_expenses: boolean;
  donations: boolean;
  employment_expenses: boolean;
  family_deductions: boolean;
  investment_income: boolean;
  capital_gains: boolean;
  foreign_income: boolean;
  rental_income: boolean;
  freelance_income: boolean;
  gig_work_income: boolean;
  business_expenses: boolean;
  home_office_expenses: boolean;
  vehicle_expenses: boolean;
  expert_help: boolean;
  full_service: boolean;
  corporate_filing: boolean;
  nil_corporate_return: boolean;
  sort_order: number;
  // Computed
  supported_features: string[];
  unsupported_features: string[];
}

// ─── Wizard / Recommendation Types ─────────────────────────────────────────

export interface WizardAnswers {
  filing_type: string;
  income_sources: string[];
  deductions: string[];
  help_preference: string;
  has_revenue?: boolean | null;
}

export interface UpgradeOption {
  product_id: string;
  product_name: string;
  price: number;
  reason: string;
}

export interface RecommendationResult {
  recommended_product_id: string;
  recommended_product_name: string;
  price: number;
  confidence: 'low' | 'medium' | 'high';
  reasons: string[];
  matched_inputs: string[];
  optional_upgrade?: UpgradeOption | null;
  warnings: string[];
  disclaimer: string;
}

// ─── AI Assistant Types ─────────────────────────────────────────────────────

export interface AssistantMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AssistantResponse {
  answer: string;
  recommended_product: string | null;
  confidence: string | null;
  reasons: string[];
  disclaimer: string;
  source: string;
}
