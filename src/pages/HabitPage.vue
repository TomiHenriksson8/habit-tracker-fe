<template>
  <div
    :class="{
      'grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 p-6': user,
      'w-full p-6': !user,
    }"
  >
    <!-- ✅ Left Side: Habit Tracker (Takes More Space) -->
    <div v-if="user">
      <!-- ✅ Welcome Popup (Unchanged) -->
      <div
        v-if="showWelcomePopup"
        @click.self="dismissWelcome"
        class="relative flex items-center justify-center cursor-pointer p-6 my-4 mb-8 rounded-xl bg-gradient-to-br from-yellow-50 to-white shadow-lg border-2 border-yellow-100 hover:scale-101 transition-all duration-100"
      >
        <!-- Close Button (Fixed Positioning) -->
        <button
          @click.stop="dismissWelcome"
          class="absolute cursor-pointer top-2 right-2 text-gray-700 hover:text-black transition"
        >
          ❌
        </button>

        <!-- Content Wrapper -->
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-900">
            🎉 Welcome to Habit Tracker!
          </h2>
          <p class="text-gray-700 mt-2">
            Start tracking your habits by clicking "Add Habit"!
          </p>
        </div>
      </div>
      <div class="bg-blue-50 rounded-xl shadow-md p-6">
        <h1 class="text-2xl font-bold text-center mb-4">Active Habits</h1>

        <div
          v-if="!loading && activeHabits.length === 0"
          class="text-center text-gray-500 mt-4"
        >
          No active habits. Click "Add Habit" to start tracking!
        </div>

        <!-- 🔹 Render All Active Habits by Frequency -->
        <div v-if="activeDailyHabits.length">
          <h2 class="text-lg font-semibold text-gray-700 mb-2">
            Daily Habits 🌅
          </h2>
          <ul class="space-y-3">
            <li
              @click="handleHabitClick(habit._id)"
              v-for="habit in activeDailyHabits"
              :key="habit._id"
              class="habit-item flex items-center justify-between p-4 bg-white rounded-lg shadow-md border-4 border-red-300 transition-all duration-200"
              :class="{ 'clicked-effect': clickedHabit === habit._id }"
            >
              <div class="flex items-center space-x-3 w-full cursor-pointer">
                <span class="text-2xl">{{ getHabitIcon(habit.title) }}</span>
                <h3 class="text-lg font-semibold">{{ habit.title }}</h3>
              </div>
              <span class="text-black font-bold mr-5">
                {{ habit.completion_count }}/1
              </span>

              <!-- ✅ Green Checkmark Button with Effect -->
              <button
                @click.stop="handleHabitClick(habit._id)"
                class="p-2 border border-green-500 text-green-500 rounded-full hover:bg-green-500 hover:text-white transition w-10 h-10 flex items-center justify-center"
              >
                ✔️
              </button>
            </li>
          </ul>
        </div>

        <div v-if="activeWeeklyHabits.length">
          <h2 class="text-lg font-semibold text-gray-700 mt-4 mb-2">
            Weekly Habits 📆
          </h2>
          <ul class="space-y-3">
            <li
              @click="handleHabitClick(habit._id)"
              v-for="habit in activeWeeklyHabits"
              :key="habit._id"
              class="habit-item flex items-center justify-between p-4 bg-white rounded-lg shadow-md border-4 border-blue-300 transition-all duration-200"
              :class="{ 'clicked-effect': clickedHabit === habit._id }"
            >
              <div class="flex items-center space-x-3 w-full cursor-pointer">
                <span class="text-2xl">{{ getHabitIcon(habit.title) }}</span>
                <h3 class="text-lg font-semibold">{{ habit.title }}</h3>
              </div>
              <span class="text-black font-bold mr-5">
                {{ habit.completion_count }}/7
              </span>

              <!-- ✅ Green Checkmark Button with Effect -->
              <button
                @click.stop="handleHabitClick(habit._id)"
                class="p-2 border border-green-500 text-green-500 rounded-full hover:bg-green-500 hover:text-white transition w-10 h-10 flex items-center justify-center"
              >
                ✔️
              </button>
            </li>
          </ul>
        </div>

        <div v-if="activeMonthlyHabits.length">
          <h2 class="text-lg font-semibold text-gray-700 mt-4 mb-2">
            Monthly Habits 📅
          </h2>
          <ul class="space-y-3">
            <li
              @click="handleHabitClick(habit._id)"
              v-for="habit in activeMonthlyHabits"
              :key="habit._id"
              class="habit-item flex items-center justify-between p-4 bg-white rounded-lg shadow-md border-4 border-green-300 transition-all duration-200"
              :class="{ 'clicked-effect': clickedHabit === habit._id }"
            >
              <div class="flex items-center space-x-3 w-full cursor-pointer">
                <span class="text-2xl">{{ getHabitIcon(habit.title) }}</span>
                <h3 class="text-lg font-semibold">{{ habit.title }}</h3>
              </div>
              <span class="text-black font-bold mr-5">
                {{ habit.completion_count }}/30
              </span>

              <!-- ✅ Green Checkmark Button with Effect -->
              <button
                @click.stop="handleHabitClick(habit._id)"
                class="p-2 border border-green-500 text-green-500 rounded-full hover:bg-green-500 hover:text-white transition w-10 h-10 flex items-center justify-center"
              >
                ✔️
              </button>
            </li>
          </ul>
        </div>

        <!-- ✅ Add Habit Button -->
        <button
          @click="goToAddHabit"
          class="relative mt-6 w-full py-3 cursor-pointer px-6 text-white font-bold text-lg rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-500 hover:to-blue-700 transition-all duration-300 ease-out active:scale-95 active:shadow-inner"
        >
          <span class="relative z-10">✨ Add Habit</span>

          <!-- ✅ Subtle Glow Effect on Hover -->
          <div
            class="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity duration-300 hover:opacity-10"
          ></div>
        </button>
      </div>

      <ul class="space-y-3 mt-10 bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold text-center mb-4">Completed Habits</h2>
        <li
          v-for="habit in paginatedCompletedHabits"
          :key="habit._id"
          class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md border-2 border-gray-400"
        >
          <div class="flex items-center space-x-3">
            <span class="text-2xl">{{ getHabitIcon(habit.title) }}</span>
            <div>
              <h3 class="line-through text-gray-500">{{ habit.title }}</h3>
              <p class="text-sm text-gray-600">
                {{ getFrequencyLabel(habit.frequency) }}
              </p>
            </div>
          </div>
          <button
            @click.stop="restartHabit(habit)"
            class="p-2 rounded-full text-white transition bg-blue-400 hover:bg-blue-600 flex items-center justify-center w-10 h-10"
          >
            🔁
          </button>
        </li>
      </ul>

      <!-- ✅ Pagination Controls -->
      <div class="flex justify-between mt-4">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <span class="text-lg font-semibold"
          >Page {{ currentPage }} / {{ totalPages }}</span
        >

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
    <div v-else class="bg-white rounded-xl shadow-md p-6 text-center">
      <h2 class="text-2xl font-bold text-gray-700">
        Welcome to Habit Tracker! 🎯
      </h2>
      <p class="text-gray-600 mt-2">
        Log in to start adding and tracking your habits.
      </p>
      <button
        @click="goToLogin"
        class="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-200"
      >
        Log In
      </button>
    </div>
    <!-- ✅ Right Side: Extra Widgets (Boxes) -->
    <div v-if="user" class="flex flex-col space-y-4">
      <div
        class="bg-gradient-to-br from-white to-red-100 shadow-lg border-2 border-orange-200 rounded-xl p-6 mt-4 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
      >
        <h3 class="text-lg font-bold flex items-center text-gray-800">
          🔥 Streaks
        </h3>

        <p class="text-gray-600 mt-2">Longest Streak:</p>

        <p class="text-2xl font-extrabold text-red-600 mt-1 animate-pulse">
          {{ longestStreak }} Days
        </p>
      </div>

      <div class="bg-white shadow-md rounded-lg p-4 mt-4">
        <h3 class="text-lg font-semibold">📊 Stats</h3>
        <p class="text-gray-600">Total Completed Habits:</p>
        <!-- ✅ Set a fixed size for the chart -->
        <div class="relative w-full h-[332px]">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </div>
      <div
        class="bg-white shadow-md rounded-lg p-4 transition-all duration-300"
      >
        <button
          @click="showInfo = !showInfo"
          class="w-full cursor-pointer text-left flex justify-between items-center px-4 py-2 font-semibold bg-gray-200 hover:bg-gray-300 rounded-lg transition-all"
        >
          ℹ️ How This App Works
          <span>{{ showInfo ? "⬆️" : "⬇️" }}</span>
        </button>

        <div
          v-if="showInfo"
          class="mt-3 p-6 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-md transition-all duration-500 ease-out transform scale-98 hover:scale-100"
        >
          <h3 class="text-xl font-bold text-gray-900 flex items-center">
            📌 Quick Guide
          </h3>

          <ul class="mt-3 text-gray-700 text-md list-disc pl-6 space-y-3">
            <li>➕ Click "+ Add Habit" to create a new habit.</li>
            <li>✅ Track progress by marking habits as completed.</li>
            <li>🔥 Check your <b>streaks</b> and <b>completed habits</b>.</li>
            <li>🔄 Restart habits when needed.</li>
            <li>🎯 Stay consistent and build strong habits!</li>
          </ul>

          <!-- 🌟 Habit Frequency Explanation -->
          <div
            class="mt-5 p-4 rounded-lg bg-white shadow-md border-l-4 border-blue-500"
          >
            <h4 class="text-lg font-semibold text-blue-600 flex items-center">
              📅 Understanding Habit Types
            </h4>
            <p class="text-gray-700 mt-2">
              🔹 <b>Daily Habits:</b> Track things you want to do
              <b>every single day</b>, like drinking water or meditating. 🔹
              <b>Weekly Habits:</b> Perfect for things you want to do a few
              times a week, like working out 3 times per week. 🔹
              <b>Monthly Habits:</b> Great for goals that don’t need daily
              attention, like reading a book or budgeting.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, watch, ref, computed } from "vue";
import { useHabits } from "../hooks/useHabits";
import { useUser } from "../hooks/useUser";
import type { Habit } from "../hooks/useHabits.ts";
import Chart from "chart.js/auto";

const {
  habits,
  loading,
  error,
  fetchHabits,
  completeHabit,
  addHabit,
  completedHabitsPerDay,
  updateChartData, // ✅ Make sure this is called before updating the chart
} = useHabits();
const { user, fetchUser } = useUser();
const router = useRouter();
const showWelcomePopup = ref(true);
const showCompleted = ref(false);
const showInfo = ref(false);

const clickedHabit = ref<string | null>(null);

const handleHabitClick = async (habitId: string) => {
  clickedHabit.value = habitId; // Apply effect

  await completeHabitAndUpdate(habitId); // Complete the habit

  setTimeout(() => {
    clickedHabit.value = null; // Remove effect after animation
  }, 300); // Match the CSS animation duration
};

const getFrequencyLabel = (frequency: string) => {
  const labels: Record<string, string> = {
    daily: "1 day",
    weekly: "7 days",
    monthly: "30 days",
  };
  return labels[frequency] || "Unknown frequency";
};

const itemsPerPage = 5;
const currentPage = ref(1);

// ✅ Compute total pages dynamically
const totalPages = computed(() =>
  Math.ceil(completedHabits.value.length / itemsPerPage),
);

// ✅ Get the paginated habits for the current page
const paginatedCompletedHabits = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return completedHabits.value.slice(start, start + itemsPerPage);
});

// ✅ Pagination controls
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const toggleCompleted = () => {
  showCompleted.value = !showCompleted.value;
};

const completeHabitAndUpdate = async (habitId: string) => {
  console.log(`⏳ Completing habit: ${habitId}...`);

  // ✅ Find the habit and update UI immediately
  const habit = habits.value.find((h) => h._id === habitId);
  if (habit) {
    const maxCount = Number(getMaxCompletion(habit.frequency));
    habit.completed = habit.completion_count >= maxCount;
    console.log("🔹 UI updated locally.");
  }

  // ✅ Call backend to persist change
  await completeHabit(habitId);
  console.log("✅ Habit marked as completed in backend!");

  // ✅ Update localStorage & chart data first
  updateChartData();

  // ✅ Delay fetching to prevent blinking (allows Vue to process first update)
  setTimeout(async () => {
    await fetchHabits(); // ✅ Get the latest data after a slight delay
    console.log("🔄 UI fully updated from backend!");
  }, 100); // Delay by 100ms to prevent the double render effect
};
const loadStoredStats = () => {
  console.log("🔹 Loading stored stats from localStorage...");

  const storedStats = localStorage.getItem("completedHabitsPerDay");
  if (storedStats) {
    completedHabitsPerDay.value = JSON.parse(storedStats);
    console.log("✅ Stats loaded:", completedHabitsPerDay.value);
  } else {
    console.log("⚠️ No data found in localStorage!");
  }
};

const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chartInstance: Chart | null = null; // Store chart instance

const createChart = () => {
  if (!chartCanvas.value) return;

  // Get the canvas context to create a gradient
  const ctx = chartCanvas.value.getContext("2d");
  if (!ctx) return;

  // Create a gradient fill
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, "rgba(75,192,192,1)"); // Teal
  gradient.addColorStop(1, "rgba(153,102,255,0.8)"); // Soft Purple

  if (!chartInstance) {
    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Completed Habits",
            data: [...completedHabitsPerDay.value],
            backgroundColor: gradient, // Use gradient effect
            borderRadius: 8, // Round bar edges
            borderWidth: 2,
            borderColor: "rgba(75,192,192,1)", // Matching border
            hoverBackgroundColor: "rgba(75,192,192,1)", // Highlight effect
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000, // Smooth animation effect
          easing: "easeOutQuart",
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(200, 200, 200, 0.2)", // Softer grid lines
            },
            ticks: {
              color: "#333", // Darker text
              font: {
                weight: "bold",
              },
            },
          },
          x: {
            grid: {
              display: false, // Hide x-axis grid lines for cleaner look
            },
            ticks: {
              color: "#555",
              font: {
                weight: "bold",
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false, // Hide legend for a cleaner look
          },
          tooltip: {
            enabled: true,
            backgroundColor: "rgba(0, 0, 0, 0.8)", // Darker tooltip
            titleColor: "#fff",
            bodyColor: "#ddd",
            cornerRadius: 6,
            padding: 10,
          },
        },
      },
    });
  } else {
    chartInstance.data.datasets[0].data = [...completedHabitsPerDay.value];
    chartInstance.update();
  }
};
onMounted(async () => {
  console.log("🔹 Mounted, fetching user...");
  await fetchUser();
  loadStoredStats(); // ✅ Load localStorage stats first

  if (user.value && habits.value.length === 0) {
    await fetchHabits();
  }

  updateChartData(); // ✅ Ensure chart is updated
});
watch(completedHabitsPerDay, (newData, oldData) => {
  if (JSON.stringify(newData) !== JSON.stringify(oldData)) {
    // ✅ Update only if data changes
    createChart();
  }
});

watch(user, (newUser) => {
  if (newUser) {
    fetchHabits();
  }
});
const goToAddHabit = () => {
  router.push("/add-habit"); // Ensure you have a route for adding a habit
};
const goToLogin = () => {
  router.push("/login"); // Make sure you have a login route
};

// **Filter Active & Completed Habits**
const activeHabits = computed(() => habits.value.filter((h) => !h.completed));
const completedHabits = computed(() => habits.value.filter((h) => h.completed));
const totalCompletedHabits = computed(() => completedHabits.value.length);

const longestStreak = computed(() => {
  if (!completedHabits.value.length) return 0;

  const completionDates = completedHabits.value
    .map((habit) => habit.last_completed)
    .filter((date): date is string => !!date) // ✅ Remove null/undefined values
    .map((date) => {
      const parsedDate = new Date(date);
      return isNaN(parsedDate.getTime())
        ? null
        : parsedDate.toISOString().split("T")[0]; // ✅ Handle invalid dates
    })
    .filter((date): date is string => !!date); // ✅ Remove any `null` values

  // Sort dates in ascending order
  completionDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  let maxStreak = 0;
  let currentStreak = 1;
  for (let i = 1; i < completionDates.length; i++) {
    const prevDate = new Date(completionDates[i - 1]);
    const currDate = new Date(completionDates[i]);

    // Check if current date is exactly one day after previous date
    const diffInDays =
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);

    if (diffInDays === 1) {
      currentStreak++;
    } else {
      maxStreak = Math.max(maxStreak, currentStreak);
      currentStreak = 1;
    }
  }

  return Math.max(maxStreak, currentStreak);
});

// **Group active habits by frequency**
const activeDailyHabits = computed(() =>
  activeHabits.value.filter((h) => h.frequency === "daily"),
);
const activeWeeklyHabits = computed(() =>
  activeHabits.value.filter((h) => h.frequency === "weekly"),
);
const activeMonthlyHabits = computed(() =>
  activeHabits.value.filter((h) => h.frequency === "monthly"),
);

// **Helper function for max completion count**
const getMaxCompletion = (frequency: string) => {
  if (frequency === "daily") return 1;
  if (frequency === "weekly") return 7;
  if (frequency === "monthly") return 30;
  return "?";
};

// ✅ **Fix: Define getHabitIcon function**
const getHabitIcon = (title: string) => {
  const habitIcons: Record<string, string> = {
    "Track Expenses": "📒",
    "Save Money": "💰",
    "Eat Less Sugar": "🍭",
    Meditation: "🧘‍♂️",
    "Read a Book": "📚",
    Walk: "🚶‍♂️",
    Run: "🏃‍♂️",
    Yoga: "🧘‍♀️",
    "Drink Water": "💧",
    Exercise: "💪",
  };
  return habitIcons[title] || "📌";
};

// **Restart a completed habit**
const restartHabit = async (habit: Habit) => {
  await addHabit({
    title: habit.title,
    description: habit.description,
    frequency: habit.frequency,
  });

  await fetchHabits();
};

const dismissWelcome = () => {
  showWelcomePopup.value = false;
};
</script>
