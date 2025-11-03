import AsyncStorage from '@react-native-async-storage/async-storage';
import { IrrigationPlanDetailsDto } from '../types/dashboard.types';

const PLANS_CACHE_KEY = 'irrigation_plans_cache';
const PLANS_CACHE_TIMESTAMP_KEY = 'irrigation_plans_cache_timestamp';

// Cache expiration time: 24 hours
const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000;

class IrrigationPlansCache {
  /**
   * Save irrigation plans to AsyncStorage
   */
  async savePlans(plans: IrrigationPlanDetailsDto[]): Promise<void> {
    try {
      const timestamp = new Date().toISOString();
      await AsyncStorage.setItem(PLANS_CACHE_KEY, JSON.stringify(plans));
      await AsyncStorage.setItem(PLANS_CACHE_TIMESTAMP_KEY, timestamp);
      console.log('✅ [PlansCache] Saved plans to cache:', plans.length);
    } catch (error) {
      console.error('❌ [PlansCache] Error saving plans to cache:', error);
      throw error;
    }
  }

  /**
   * Load irrigation plans from AsyncStorage
   */
  async loadPlans(): Promise<IrrigationPlanDetailsDto[] | null> {
    try {
      const cachedPlans = await AsyncStorage.getItem(PLANS_CACHE_KEY);
      const timestamp = await AsyncStorage.getItem(PLANS_CACHE_TIMESTAMP_KEY);

      if (!cachedPlans || !timestamp) {
        console.log('📭 [PlansCache] No cached plans found');
        return null;
      }

      // Check if cache is expired
      const cacheDate = new Date(timestamp);
      const now = new Date();
      const age = now.getTime() - cacheDate.getTime();

      if (age > CACHE_EXPIRATION_MS) {
        console.log('⏰ [PlansCache] Cache expired, removing old data');
        await this.clearCache();
        return null;
      }

      const plans = JSON.parse(cachedPlans) as IrrigationPlanDetailsDto[];
      console.log('✅ [PlansCache] Loaded plans from cache:', plans.length);
      return plans;
    } catch (error) {
      console.error('❌ [PlansCache] Error loading plans from cache:', error);
      return null;
    }
  }

  /**
   * Check if cached plans exist and are valid
   */
  async hasValidCache(): Promise<boolean> {
    try {
      const timestamp = await AsyncStorage.getItem(PLANS_CACHE_TIMESTAMP_KEY);
      if (!timestamp) return false;

      const cacheDate = new Date(timestamp);
      const now = new Date();
      const age = now.getTime() - cacheDate.getTime();

      return age <= CACHE_EXPIRATION_MS;
    } catch (error) {
      console.error('❌ [PlansCache] Error checking cache validity:', error);
      return false;
    }
  }

  /**
   * Clear cached plans
   */
  async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PLANS_CACHE_KEY);
      await AsyncStorage.removeItem(PLANS_CACHE_TIMESTAMP_KEY);
      console.log('🗑️ [PlansCache] Cleared cache');
    } catch (error) {
      console.error('❌ [PlansCache] Error clearing cache:', error);
    }
  }

  /**
   * Get cache timestamp
   */
  async getCacheTimestamp(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(PLANS_CACHE_TIMESTAMP_KEY);
    } catch (error) {
      console.error('❌ [PlansCache] Error getting cache timestamp:', error);
      return null;
    }
  }
}

export const irrigationPlansCache = new IrrigationPlansCache();

