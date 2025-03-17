<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-center mb-4">{{ habit?.title }}</h1>

    <div class="text-center text-gray-600">
      {{ habit?.description || "No description available." }}
    </div>

    <p class="text-center text-gray-500 mt-2">
      Frequency: {{ habit?.frequency }}
    </p>

    <button
      @click="deleteHabitNow"
      class="mt-6 bg-red-500 text-white px-6 py-3 w-full rounded-full shadow-lg hover:bg-red-600 transition-all duration-200"
    >
      Delete Habit
    </button>

    <button
      @click="goBack"
      class="mt-4 text-gray-600 underline block text-center"
    >
      ← Back to Habits
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { useHabits } from "../hooks/useHabits";
import type { Habit } from "../hooks/useHabits.ts";

const { fetchHabits, deleteHabit, habits } = useHabits();
const router = useRouter();
const route = useRoute();

const habit = ref<Habit | null>(null);

onMounted(() => {
  fetchHabits();
  habit.value = habits.value.find((h) => h._id === route.params.id) ?? null;
});

// Delete habit and go back
const deleteHabitNow = async () => {
  if (habit.value) {
    await deleteHabit(habit.value._id);
    router.push("/habit");
  }
};

// Go back to habit list
const goBack = () => {
  router.push("/habit");
};
</script>
