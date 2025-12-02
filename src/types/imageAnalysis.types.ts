// Image Analysis API Types

export interface AnalyzeAndPlanRequest {
  Image: any; // File object from image picker
  CropName?: string;
  FieldAreaM2?: number;
  FieldName?: string;
  CropPlantedDate?: string;
  Latitude?: number;
  Longitude?: number;
}

export interface ImmediateActionDto {
  needWaterNow: boolean;
  waterAmountLiters: number;
  waterAmountBuckets: number;
  waterAmountCans: number;
  urgencyLevel: string;
  simpleInstruction: string;
}

export interface FieldInfoDto {
  soilCondition: string;
  soilMoisture: number;
  cropType: string;
  cropHealth: string;
  fieldAreaM2: number;
  location: string;
  temperature: number;
  weather: string;
}

export interface UpcomingIrrigationDto {
  date: string;
  dateDisplay: string;
  waterLiters: number;
  waterBuckets: number;
  waterCans: number;
  urgency: string;
  expectedTemp: number;
  expectedWeather: string;
}

export interface IrrigationScheduleDto {
  planId: number;
  totalDays: number;
  nextIrrigationDate?: string;
  upcomingIrrigations: UpcomingIrrigationDto[];
}

export interface AnalyzeAndPlanResponse {
  success: boolean;
  message: string;
  immediateAction: ImmediateActionDto;
  fieldInfo: FieldInfoDto;
  irrigationSchedule: IrrigationScheduleDto;
  analysisId: number;
  confidence: number;
  analyzedAt: string;
}

// Irrigation Schedule Item from analyze-and-plan API
export interface IrrigationScheduleItem {
  planId: number;
  day: string;
  cropName: string;
  status: 'inprogress' | 'expired' | 'locked' | 'complete';
  isCompleted: boolean;
  text: string;
  waterAmountBuckets: number;
  urgencyLevel: 'High' | 'Medium' | 'Low';
  waterAmountLiters: number;
  date: string;
  dateDisplay: string;
  instruction: string;
  expectedWeather: string;
  expectedTemperature: number;
  statusMessage: string;
  startTime: string;
  endTime: string;
}