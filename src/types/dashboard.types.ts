// Dashboard Type Definitions

export interface TodayTasksResponse {
  hasTask: boolean;
  message: string;
  totalWaterLiters: number;
  totalWaterBuckets: number;
  nextTaskDate: string | null;
  fields: Array<{
    fieldName: string;
    cropType: string;
    waterLiters: number;
    waterBuckets: number;
    urgency: 'Critical' | 'High' | 'Medium' | 'Low';
  }>;
}

export interface IrrigationPlanDetailsDto {
  id: number;
  fieldName: string;
  fieldAreaM2: number;
  fieldLocation: string;
  soilType: string;
  cropType: string;
  cropGrowthStage: string;
  planStartDate: string;
  planEndDate: string;
  planDurationDays: number;
  isActive: boolean;
  schedules: any[];
  summary: {
    totalSchedules: number;
    completedSchedules: number;
    pendingSchedules: number;
    totalPlannedWaterLiters: number;
    totalUsedWaterLiters: number;
    averageWaterPerIrrigation: number;
    nextScheduledDate: string | null;
  };
}

export interface WeatherResponse {
  name: string;
  main: {
    temp: number;
    temp_min: number; // API returns snake_case
    temp_max: number; // API returns snake_case
    humidity: number;
  };
  weather: Array<{
    main: string;
    description?: string;
  }>;
}

export interface AnalysisHistoryItem {
  id: string;
  date: string;
  soilType: string;
  cropType: string;
  moisturePercentage: number;
  cropHealthStatus: 'Healthy' | 'Warning' | 'Critical';
  imageUrl?: string;
}

export interface CompleteTaskRequest {
  scheduleId: number;
  actualWaterUsed?: number;
  notes?: string;
}

// Recommendations Types
export interface SeasonalRecommendation {
  season: string;
  description: string;
  topCrops: string[];
  keyInsights: string[];
  sowingWindow: string;
  harvestingWindow: string;
}

export interface RegionalHighlight {
  region: string;
  description: string;
  bestCrops: string[];
  specialNotes: string[];
}

export interface CropRequirement {
  soilPH: string;
  moisture: string;
  nitrogen: string;
}

export interface TopCrop {
  cropName: string;
  suitabilityScore: number;
  regions: string[];
  seasons: string[];
  keyBenefits: string[];
  requirements: CropRequirement;
}

export interface FarmingCalendarMonth {
  month: string;
  activities: string[];
  cropsToSow: string[];
  cropsToHarvest: string[];
}

export interface RecommendationsResponse {
  success: boolean;
  message: string;
  generatedAt: string;
  totalCropsAnalyzed: number;
  rawResponse: any | null;
  seasonalRecommendations: SeasonalRecommendation[];
  regionalHighlights: RegionalHighlight[];
  topCrops: TopCrop[];
  farmingCalendar: FarmingCalendarMonth[];
  summary: string;
  keyTakeaways: string[];
  recommendations: any[];
}
