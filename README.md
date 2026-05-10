# ⚓ SmartPort Operations Dashboard

[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Redux](https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**SmartPort** is a high-performance, real-time port operations management system designed to monitor, simulate, and optimize maritime logistics. Built with a premium "Glassmorphism" aesthetic, it provides terminal operators with a comprehensive 360° view of port activities.

---

## 🚀 Key Features

- **Live Operations Map**: Interactive visualization of port berths and vessel positions.
- **Real-Time Simulation Engine**: Coordinated background processing for vessel movement, crane activities, and truck queues.
- **IoT Sensor Network**: Monitoring of environmental and infrastructure health sensors.
- **Predictive Analytics**: Dynamic charts for throughput, crane utilization, and logistics bottlenecks.
- **Unified Fleet Management**: Centralized tracking of Vessels, Cranes, and Trucking logistics.
- **Critical Activity Feed**: Instant alerts and logs for operational events with severity filtering.

## 🛠️ Tech Stack

- **Core**: React 19 + TypeScript + Vite 8
- **State Management**: Redux Toolkit (RTK) with coordinated state slicing.
- **Styling**: Tailwind CSS v4 + Lucide React (Icons).
- **Data Visualization**: Recharts for operational metrics.
- **Simulation**: High-frequency `requestAnimationFrame` driven dispatch system.
- **Testing**: Jest + React Testing Library for robust logic validation.

---

## 📦 Project Structure

```text
src/
├── components/     # UI Components (Map, Panels, Charts, etc.)
├── hooks/          # Custom hooks (e.g., Simulation Engine)
├── store/          # Redux Store configuration
│   └── slices/     # Domain-specific state (Vessels, Cranes, etc.)
├── __tests__/      # Unit and Integration tests
├── Dashboard.tsx   # Main Application Entry Point
└── main.tsx        # React Root
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/smart-port.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development
Start the development server with HMR:
```bash
npm run dev
```

### Production Build
Create an optimized production bundle:
```bash
npm run build
```

---

## ⚙️ Simulation Engine

The heart of SmartPort is the `useSimulator` hook. It drives the dashboard by dispatching "ticks" to individual Redux slices at specific intervals:

- **Vessels**: Update every 3s
- **Cranes**: Update every 2s
- **Sensors**: Update every 1.5s
- **Activity**: New event generated every 6s

This ensures the UI remains dynamic and reflects the constant motion of a real-world terminal.

---

## 🧪 Testing

Run the test suite to ensure state integrity:
```bash
npm test
```

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<p align="center">
  Developed with ❤️ for the Maritime Industry
</p>
