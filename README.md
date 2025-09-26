# Dark Forest Simulator

An interactive educational web application that explores the "Dark Forest" theory from science fiction through scenario-based decision-making exercises.

## Features

- **Educational Contexts**: Business strategy, philosophy & ethics, science & SETI, policy & governance
- **Interactive Scenarios**: 4 scenarios per context with real-world analogies
- **Decision Analysis**: Three strategic choices - Communicate, Maintain Silence, or Preemptive Strike
- **Scoring System**: Context-specific weighting for cooperation, caution, and aggression tendencies
- **Results Analysis**: Detailed profile generation and export functionality
- **Database Persistence**: PostgreSQL backend for session and user data
- **Multiplayer Support**: Group simulation sessions

## Technology Stack

- **Frontend**: React with TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Node.js with Express, Drizzle ORM
- **Database**: PostgreSQL (Neon)
- **Build Tools**: Vite, ESBuild
- **Authentication**: Session-based with secure cookie handling

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret
   ```

3. Push database schema:
   ```bash
   npm run db:push
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

The simulator guides users through:

1. **Introduction**: Theory explanation and context selection
2. **Simulation**: 4 scenarios with strategic decision-making
3. **Results**: Profile analysis, scoring, and export options

Each decision is weighted according to the selected educational context, providing personalized insights into decision-making patterns under uncertainty.

## Educational Applications

Perfect for courses in:
- Game Theory and Strategic Decision Making
- International Relations and Security Studies  
- Business Strategy and Competitive Intelligence
- Philosophy and Ethics
- Science Policy and Research Ethics

## License

MIT License - Educational Use Encouraged
