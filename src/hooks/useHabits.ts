import { ref } from "vue";
import apiClient from "./useApi";
import { useAuth } from "./useAuth"; // Import authentication hook
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

export interface Habit {
  _id: string;
  title: string;
  description?: string;
  frequency: string;
  completed: boolean;
  created_at: string;
  last_completed?: string | null;
  completion_count: number;
  completion_history: string[];
  userId: string;
}
export function useHabits() {
  const { user } = useAuth(); // Get the logged-in user
  const habits = ref<Habit[]>([]);
  const error = ref<string | null>(null);
  const loading = ref(false);
  const recentlyCompleted = ref<Set<string>>(new Set());
  const completedHabitsPerDay = ref<number[]>([0, 0, 0, 0, 0, 0, 0]);

  dayjs.extend(utc);
  dayjs.extend(timezone);

  const updateChartData = () => {
    console.log("🔹 Running updateChartData()...");

    const storedStats = localStorage.getItem("completedHabitsPerDay");
    completedHabitsPerDay.value = storedStats
      ? JSON.parse(storedStats)
      : [0, 0, 0, 0, 0, 0, 0];

    const today = dayjs().tz("Europe/Helsinki");
    const uniqueCompletionDates = new Set(); // ✅ Avoid duplicate completions

    habits.value.forEach((habit) => {
      habit.completion_history.forEach((completionDate) => {
        const completedDay = dayjs(completionDate);
        const diff = today.diff(completedDay, "day");

        if (
          diff < 7 &&
          !uniqueCompletionDates.has(completedDay.format("YYYY-MM-DD"))
        ) {
          uniqueCompletionDates.add(completedDay.format("YYYY-MM-DD"));
          completedHabitsPerDay.value[6 - diff] += 1; // ✅ Prevent double counting
        }
      });
    });

    console.log("✅ Final updated chart data:", completedHabitsPerDay.value);
    localStorage.setItem(
      "completedHabitsPerDay",
      JSON.stringify(completedHabitsPerDay.value),
    );
  };
  const fetchHabits = async () => {
    loading.value = true;
    try {
      const response = await apiClient.get("/habits");

      console.log("Fetched habits:", response.data); // ✅ Debugging log

      habits.value = response.data.map((habit: any) => ({
        ...habit,
        _id: habit._id?.$oid || habit._id,
        completed: habit.completed || false,
        completion_count: habit.completion_count || 0,
        created_at: habit.created_at
          ? dayjs(habit.created_at).format("YYYY-MM-DD")
          : null,
        last_completed: habit.last_completed
          ? dayjs(habit.last_completed).format("YYYY-MM-DD")
          : null,
        completion_history: habit.completion_history || [], // ✅ Ensure completion history is initialized
      }));

      console.log("Updated habits list:", habits.value); // ✅ Debugging log
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const addHabit = async (habit: {
    title: string;
    description?: string | undefined;
    frequency: string;
    created_at?: string;
  }) => {
    if (!user.value) {
      error.value = "User not logged in.";
      return;
    }

    loading.value = true;
    try {
      const response = await apiClient.post("/habits", {
        ...habit,
        userId: user.value.id,
        completed: false,
        completion_count: 0, // ✅ Initialize to zero
        created_at: new Date().toISOString(), // Add created_at timestamp
        completion_history: [],
      });

      habits.value.push({
        ...response.data,
        _id: response.data._id.$oid,
        completed: false,
      });
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };
  const getMaxCompletion = (frequency: string) => {
    if (frequency === "daily") return 1;
    if (frequency === "weekly") return 7;
    if (frequency === "monthly") return 30;
    return Infinity; // Default to allow unlimited tracking if no frequency is defined
  };

  const completeHabit = async (id: string) => {
    if (loading.value) return; // Prevent multiple calls
    loading.value = true;

    try {
      console.log(`🔹 Sending PUT request to complete habit: ${id}`);

      const habit = habits.value.find((h) => h._id === id);
      if (!habit) {
        console.error("❌ Habit not found.");
        return;
      }

      const todayStr = dayjs().tz("Europe/Helsinki").format("YYYY-MM-DD");
      const maxCount = getMaxCompletion(habit.frequency);

      // ✅ Count how many times it has been completed today
      const todayCompletions = habit.completion_history.filter(
        (date) => date === todayStr,
      ).length;

      if (todayCompletions >= maxCount) {
        console.log(
          `⚠️ Habit already fully completed today (${todayCompletions}/${maxCount}).`,
        );
        return;
      }

      // ✅ If the backend blocks duplicates, prevent sending extra requests unnecessarily
      if (
        habit.completion_history.includes(todayStr) &&
        habit.frequency === "daily"
      ) {
        console.log("⚠️ Daily habit already completed today. Skipping...");
        return;
      }

      // ✅ Send request to backend
      const response = await apiClient.put(`/habits/${id}/complete`);
      console.log("✅ Completed habit response:", response.data);

      // ✅ Update local Vue state
      habits.value = habits.value.map((h) => {
        if (h._id === id) {
          const newCount = Math.min(h.completion_count + 1, maxCount);
          const isCompleted = newCount >= maxCount;

          return {
            ...h,
            completion_count: newCount,
            completed: isCompleted,
            last_completed: todayStr,
            completion_history: [...h.completion_history, todayStr],
          };
        }
        return h;
      });

      console.log("✅ Updated habits:", habits.value);
    } catch (err: any) {
      console.error("❌ Error completing habit:", err.message);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };
  const resetHabitCompletion = async (id: string) => {
    loading.value = true;
    try {
      await apiClient.put(`/ habits / ${id}`, {
        completed: false,
        completion_count: 0,
      });
      habits.value = habits.value.map((habit) =>
        habit._id === id
          ? {
            ...habit,
            completed: false,
            completion_count: 0,
            last_completed: null,
          }
          : habit,
      );
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // **Delete a habit**
  const deleteHabit = async (id: string) => {
    loading.value = true;
    try {
      await apiClient.delete(`/ habits / ${id}`);
      habits.value = habits.value.filter((habit) => habit._id !== id);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    habits,
    error,
    loading,
    fetchHabits,
    addHabit,
    completeHabit,
    resetHabitCompletion,
    deleteHabit,
    updateChartData, // ✅ Expose updateChartData
    completedHabitsPerDay,
    recentlyCompleted, // ✅ Expose recently completed habits
  };
}
