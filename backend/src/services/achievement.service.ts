import { GoalModel } from '../models/goal.model';
import { SaleModel } from '../models/sale.model';
import { AchievementModel } from '../models/achievement.model';
import type {
  Achievement,
  RuleType,
  RuleParams,
  ThresholdParams,
  EarlyCompletionParams,
  OvershootParams,
  EarlyRatioParams,
  MonetaryMinParams,
  SameDayParams,
} from '../models/achievement.model';

export interface AwardedAchievement {
  achievement: Achievement;
}

/** Context passed to every rule evaluator. All fields are goal-relative. */
interface EvalContext {
  /** Current progress as a percentage of target (can exceed 100). */
  percent: number;
  /** Calendar days remaining until goal end_date (negative if past deadline). */
  daysLeft: number;
  /** Total calendar days in the goal window. */
  daysTotal: number;
  /** Absolute sum of sales for this goal (raw value, not percentage). */
  total: number;
  /** Goal type: 'monetary' or 'units'. */
  goalType: 'monetary' | 'units';
}

// --- Evaluator registry ---
type Evaluator<P extends RuleParams> = (ctx: EvalContext, params: P) => boolean;

const evaluators: { [K in RuleType]: Evaluator<RuleParams> } = {
  threshold: (ctx, params) => ctx.percent >= (params as ThresholdParams).percent,

  early_completion: (ctx, params) => {
    const p = params as EarlyCompletionParams;
    return ctx.percent >= p.required_percent && ctx.daysLeft >= p.days_before;
  },

  overshoot: (ctx, params) => ctx.percent >= (params as OvershootParams).percent,

  early_ratio: (ctx, params) => {
    const p = params as EarlyRatioParams;
    const timeRemainingFraction = ctx.daysTotal > 0 ? ctx.daysLeft / ctx.daysTotal : 0;
    return ctx.percent >= p.required_percent && timeRemainingFraction >= p.time_ratio;
  },

  /**
   * monetary_min: awarded when a monetary goal is fully complete (100%+)
   * AND the total sold value is at least `min_amount`.
   * Example params: { "min_amount": 10000 }
   */
  monetary_min: (ctx, params) => {
    const p = params as MonetaryMinParams;
    return ctx.goalType === 'monetary' && ctx.percent >= 100 && ctx.total >= p.min_amount;
  },

  /**
   * same_day: awarded when the goal reaches `required_percent`% on the very
   * same calendar day it started (daysLeft equals daysTotal — no time has elapsed).
   * Example params: { "required_percent": 100 }
   */
  same_day: (ctx, params) => {
    const p = params as SameDayParams;
    return ctx.percent >= p.required_percent && ctx.daysLeft >= ctx.daysTotal;
  },
};

function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

export const AchievementService = {
  /**
   * Evaluates every achievement against all goals for the user.
   * An achievement is awarded to the user if ANY goal satisfies its rule.
   * Returns only the achievements that were newly awarded in this call.
   */
  checkAndAward(userId: number): AwardedAchievement[] {
    const goals        = GoalModel.findByUserId(userId);
    const achievements = AchievementModel.findAll();
    const today        = new Date().toLocaleDateString('en-CA');
    const newlyAwarded: AwardedAchievement[] = [];

    for (const achievement of achievements) {
      const evaluate = evaluators[achievement.rule_type];
      if (!evaluate) throw new Error(`Unknown achievement rule_type: "${achievement.rule_type}" (id: ${achievement.id})`);

      // Award if any single goal satisfies the rule
      const satisfied = goals.some(goal => {
        const total     = SaleModel.sumValueByTypeAndDateRange(userId, goal.type, goal.start_date, goal.end_date);
        const percent   = goal.target > 0 ? (total / goal.target) * 100 : 0;
        const daysTotal = daysBetween(goal.start_date, goal.end_date);
        const daysLeft  = daysBetween(today, goal.end_date);
        return evaluate({ percent, daysLeft, daysTotal, total, goalType: goal.type }, achievement.rule_params);
      });

      if (satisfied) {
        const wasNew = AchievementModel.awardToUser(userId, achievement.id);
        if (wasNew) newlyAwarded.push({ achievement });
      }
    }

    return newlyAwarded;
  },
};

