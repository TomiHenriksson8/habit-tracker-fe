import { ref } from "vue";
import apiClient from "./useApi";

interface Habit {
  _id: string;
  name: string;
}

export function useHabits() {
  const habits = ref<Habit[]>([]);
  const error = ref<string | null>(null);
  const loading = ref(false);

  // Fetch all habits
  const fetchHabits = async () => {
    loading.value = true;
    try {
      const response = await apiClient.get("/habits");
      habits.value = response.data;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // Add a new habit
  const addHabit = async (habit: { name: string }) => {
    loading.value = true;
    try {
      const response = await apiClient.post("/habits", habit);
      habits.value.push(response.data);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // Delete a habit
  const deleteHabit = async (id: string) => {
    loading.value = true;
    try {
      await apiClient.delete(`/habits/${id}`);
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
    deleteHabit,
  };
}
