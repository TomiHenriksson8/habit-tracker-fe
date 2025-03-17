<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold text-center text-gray-800">New Habit</h1>

    <!-- Step 1: Category Selection -->
    <div v-if="step === 1" class="mt-6">
      <h2 class="text-xl font-semibold text-center text-gray-700">
        Select a Category
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectCategory(category)"
          class="flex flex-col items-center justify-center p-5 bg-white rounded-lg shadow-md border hover:bg-blue-50 transition"
        >
          <span class="text-4xl">{{ category.icon }}</span>
          <span class="text-lg font-semibold mt-2 text-gray-700">
            {{ category.name }}
          </span>
        </button>
      </div>

      <!-- Back Button to Go Back to Habit Page -->
      <button
        @click="router.push('/')"
        class="mt-6 block mx-auto text-gray-700 font-semibold py-2 px-6 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 transition"
      >
        ← Back to Habits
      </button>
    </div>

    <!-- Step 2: Habit Selection -->
    <div v-if="step === 2" class="mt-6">
      <h2 class="text-xl font-semibold text-center text-gray-700">
        {{ selectedCategory.name }}
      </h2>
      <p class="text-center text-gray-500">
        {{ selectedCategory.description }}
      </p>

      <ul class="mt-4 space-y-3">
        <li
          v-for="habit in selectedCategory.habits"
          :key="habit.id"
          class="p-4 bg-white rounded-lg shadow-md flex justify-between items-center border hover:bg-gray-100 transition"
        >
          <span class="text-lg">{{ habit.emoji }} {{ habit.name }}</span>
          <button
            @click="selectHabit(habit)"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
          >
            Add
          </button>
        </li>
      </ul>

      <!-- Back Button -->
      <button
        @click="goBack"
        class="mt-6 block mx-auto text-gray-700 font-semibold py-2 px-6 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 transition"
      >
        ← Back
      </button>
    </div>

    <!-- Step 3: Set Habit Details -->
    <div v-if="step === 3" class="mt-6">
      <h2 class="text-xl font-semibold text-center text-gray-700">
        Customize Your Habit
      </h2>

      <div class="mt-4">
        <label class="block text-gray-700 font-semibold">Frequency</label>
        <select
          v-model="habitData.frequency"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <!-- ✅ Save Button (Fixed) -->
      <button
        @click="saveHabit"
        :disabled="!habitData.title"
        class="mt-6 w-full bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Save Habit
      </button>

      <!-- Back Button -->
      <button
        @click="goBack"
        class="mt-4 block mx-auto text-gray-700 font-semibold py-2 px-6 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 transition"
      >
        ← Back
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useHabits } from "../hooks/useHabits";
import { useUser } from "../hooks/useUser";
import dayjs from "dayjs";

const { addHabit } = useHabits();
const { user } = useUser();
const router = useRouter();

const step = ref(1);
const selectedCategory = ref<any>(null);
const selectedHabit = ref<any>(null);
const habitData = ref({
  title: "",
  description: "",
  frequency: "daily",
});

// ✅ **Expanded Habit Categories**
const categories = [
  {
    id: "lifestyle",
    name: "Lifestyle",
    description: "Build habits to improve your daily life.",
    icon: "🏠",
    habits: [
      { id: "track-expenses", name: "Track Expenses", emoji: "📒" },
      { id: "save-money", name: "Save Money", emoji: "💰" },
      { id: "meditation", name: "Meditation", emoji: "🧘‍♂️" },
    ],
  },
  {
    id: "fitness",
    name: "Fitness",
    description: "Stay active and improve your health.",
    icon: "🏃‍♂️",
    habits: [
      { id: "walk", name: "Walk", emoji: "🚶‍♂️" },
      { id: "run", name: "Run", emoji: "🏃‍♂️" },
      { id: "yoga", name: "Yoga", emoji: "🧘‍♀️" },
      { id: "gym", name: "Go to Gym", emoji: "🏋️‍♂️" },
    ],
  },
  {
    id: "health",
    name: "Health",
    description: "Take care of your body and mind.",
    icon: "❤️",
    habits: [
      { id: "drink-water", name: "Drink Water", emoji: "💧" },
      { id: "less-sugar", name: "Eat Less Sugar", emoji: "🍭" },
      { id: "sleep", name: "Sleep 8 Hours", emoji: "🛏️" },
    ],
  },
  {
    id: "productivity",
    name: "Productivity",
    description: "Develop habits to boost efficiency.",
    icon: "📚",
    habits: [
      { id: "read-book", name: "Read a Book", emoji: "📖" },
      { id: "learn-skill", name: "Learn a New Skill", emoji: "🧠" },
      { id: "journal", name: "Write a Journal", emoji: "📝" },
    ],
  },
];

// ✅ **Step Navigation Functions**
const selectCategory = (category: any) => {
  selectedCategory.value = category;
  step.value = 2;
};

const selectHabit = (habit: any) => {
  selectedHabit.value = habit;
  habitData.value.title = habit.name;
  habitData.value.description = habit.description || "";
  step.value = 3;
};

// ✅ **Fixed: Save Habit and Navigate Back**
const saveHabit = async () => {
  if (!user.value) {
    alert("You must be logged in to add a habit.");
    return;
  }

  await addHabit({
    title: habitData.value.title,
    description: habitData.value.description || undefined,
    frequency: habitData.value.frequency,
    created_at: dayjs().toISOString(),
  });

  router.push("/"); // ✅ Navigates back to habits page after saving
};

const goBack = () => {
  if (step.value > 1) {
    step.value -= 1;
  } else {
    router.push("/"); // If on Step 1, go back to main habits page
  }
};
</script>
