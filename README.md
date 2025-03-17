# Habit Tracker Frontend (Vue 3)

This frontend project provides an intuitive user interface for a Habit Tracker application built using Vue 3, Tailwind CSS, and Vite. It seamlessly connects to a Rust-based backend to manage user authentication and habit management efficiently.

## 🚀 Technologies Used

- **Vue 3** (Composition API)
- **Vue Router** (Navigation)
- **Vite** (Build tool and development server)
- **Tailwind CSS** (Styling)
- **Axios** (HTTP client)
- **Chart.js** (Data visualization)
- **TypeScript**
- **Day.js** (Date manipulation)

## 📁 Project Structure

```
src
├── components
│   └── AddHabit.vue
├── hooks
│   ├── useApi.ts
│   ├── useAuth.ts
│   ├── useHabits.ts
│   └── useUser.ts
├── pages
│   ├── HabitDetail.vue
│   ├── HabitPage.vue
│   ├── HomePage.vue
│   ├── Login.vue
│   ├── Profile.vue
│   └── Register.vue
├── router
│   └── index.ts
├── App.vue
└── main.ts
```

## 🌐 Demo

[Live Demo](https://habit-tracker-ten-psi.vercel.app/)

## 🛠️ Installation

Clone the repository:

```bash
git clone https://github.com/TomiHenriksson8/habit-tracker-fe
cd habit-tracker-fe
```

Install the dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Your app will run at:

```
http://localhost:5173
```

## 🌐 Routes

| Route        | Component         | Description            |
| ------------ | ----------------- | ---------------------- |
| `/`          | `HabitPage.vue`   | Display user's habits  |
| `/add-habit` | `AddHabit.vue`    | Form to add new habits |
| `/habit/:id` | `HabitDetail.vue` | Details for a habit    |
| `/login`     | `Login.vue`       | User login             |
| `/register`  | `Register.vue`    | User registration      |
| `/profile`   | `Profile.vue`     | User profile page      |

## 📌 Main Features

- User authentication (login & register)
- Create, view, update, and delete habits
- Mark habits as completed
- Visual habit-tracking analytics with Chart.js

## 🔧 Building for Production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## ⚙️ Configuration

Aliases configured in Vite:

```typescript
alias: {
  '@': path.resolve(__dirname, 'src')
}
```

## 📈 Future Enhancements

- Enhanced analytics dashboards. fix date bug with the chart
- Improved responsiveness and mobile optimizations
- Push notifications
- dark mode
- user able to modify user. add pfp..
