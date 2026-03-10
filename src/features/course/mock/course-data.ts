import { Course } from "@/features/course/types/course.types";

export const MOCK_COURSES: Course[] = [
  {
    id: "course-react-holetex-01",
    title: "React Mastery with Hooks and Real Projects",
    description:
      "A complete React course covering core concepts, hooks, performance optimization, and real-world projects like chat apps and dashboards.",
    thumbnail: "https://i.ytimg.com/vi/Up3YNeLA6MQ/hqdefault.jpg",
    author: "HoleTex",
    level: "Intermediate",
    tags: ["React", "Hooks", "Performance", "TypeScript"],
    requirements: [
      "Basic JavaScript and ES6+ knowledge",
      "Familiarity with HTML and CSS",
      "Node.js and a package manager (npm or yarn) installed",
    ],
    learningOutcomes: [
      "Understand core React concepts like components, props, and state",
      "Use React Hooks effectively (useState, useEffect, useMemo, useCallback, useRef, useReducer)",
      "Share global state using Context API",
      "Improve React performance with memoization, Profiler, debounce and throttle",
      "Build real-world React applications and deploy them",
      "Use TypeScript with React in modern workflows",
    ],

    totalLessons: 23,
    totalSections: 4,
    totalDuration: 23 * 1800, // mock ~30 min per video

    createdAt: 1709251200000,
    sections: [
      {
        id: "section-react-holetex-01",
        title: "React Fundamentals",
        order: 1,
        totalLessons: 3,
        courseId: "course-react-holetex-01",
        lessons: [
          {
            id: "lesson-react-holetex-01",
            title: "React Basics in 30 Minutes",
            content:
              "Get an overview of React, JSX syntax, components, props, and state to understand how React applications are structured.",
            videoId: "Up3YNeLA6MQ",
            order: 1,
            duration: 2159,
            courseId: "course-react-holetex-01",
            sectionId: "section-react-holetex-01",
          },
          {
            id: "lesson-react-holetex-02",
            title: "React 18 Overview",
            content:
              "Discover what is new in React 18, including concurrent features and improvements that affect modern React applications.",
            videoId: "aaoHil-PnNw",
            order: 2,
            duration: 600,
            courseId: "course-react-holetex-01",
            sectionId: "section-react-holetex-01",
          },
          {
            id: "lesson-react-holetex-03",
            title: "Learning React Effectively in 2023+",
            content:
              "Learn how to use the new React documentation and follow an effective learning path for React in modern projects.",
            videoId: "5_eTX37wHIw",
            order: 3,
            duration: 1500,
            courseId: "course-react-holetex-01",
            sectionId: "section-react-holetex-01",
          },
        ],
      },
      {
        id: "section-react-holetex-02",
        title: "React Hooks Deep Dive",
        order: 2,
        totalLessons: 11,
        courseId: "course-react-holetex-01",
        lessons: [
          {
            id: "lesson-react-holetex-04",
            title: "useState Fundamentals",
            content:
              "Learn how to manage local state in functional components using the useState hook and avoid common pitfalls.",
            videoId: "JvrHjk-CJw4",
            order: 1,
            duration: 2100,
            courseId: "course-react-holetex-01",
            sectionId: "section-react-holetex-02",
          },
          {
            id: "lesson-react-holetex-05",
            title: "useEffect and Side Effects",
            content:
              "Handle side effects such as data fetching, subscriptions, and timers using the useEffect hook.",
            videoId: "9-2qTNawqxY",
            order: 2,
            duration: 2100,
            courseId: "course-react-holetex-01",
            sectionId: "section-react-holetex-02",
          },
          {
            id: "lesson-react-holetex-06",
            title: "useMemo for Expensive Computations",
            content:
              "Use useMemo to memoize expensive calculations and improve rendering performance.",
            videoId: "j3UhzdD-vMc",
            order: 3,
            duration: 1500,
            courseId: "course-react-holetex-01",
            sectionId: "section-react-holetex-02",
          },
          {
            id: "lesson-react-holetex-07",
            title: "useCallback for Stable Functions",
            content:
              "Prevent unnecessary re-renders by memoizing callback functions with useCallback.",
            videoId: "cgXtak3_O3E",
            order: 4,
            duration: 1500,
            courseId: "course-react-holetex-01",
            sectionId: "section-react-holetex-02",
          },
          {
            id: "lesson-react-holetex-08",
            title: "React.memo vs useMemo",
            content:
              "Understand the differences between React.memo and useMemo and when to leverage each for optimization.",
            videoId: "QtqSeOTHq3Y",
            order: 5,
            duration: 1200,
            courseId: "course-react-holetex-01",
            sectionId: "section-react-holetex-02",
          },
          {
            id: "lesson-react-holetex-09",
            title: "useRef and DOM References",
            content:
              "Use useRef to persist values across renders and interact with DOM elements directly.",
            videoId: "Z20edymyQdc",
            order: 6,
            duration: 1500,
            courseId: "course-react-holetex-01",
            sectionId: "section-react-holetex-02",
          },
          {
            id: "lesson-react-holetex-10",
            title: "useReducer for Complex State",
            content:
              "Manage complex state transitions using the useReducer hook, inspired by Redux patterns.",
            videoId: "oDO40MCPaKg",
            order: 7,
            duration: 1800,
            courseId: "course-react-holetex-01",
            sectionId: "section-react-holetex-02",
          },
          {
            id: "lesson-react-holetex-11",
            title: "Custom Hooks",
            content:
              "Extract reusable logic into custom hooks to keep components small and focused.",
            videoId: "bRZMNCnRDSA",
            order: 8,
            duration: 1200,
            courseId: "course-react-holetex-01",
            sectionId: "section-react-holetex-02",
          },
          {
            id: "lesson-react-holetex-12",
            title: "New Hooks in React 18",
            content:
              "Explore new hooks like useId, useTransition, and useDeferredValue introduced with React 18.",
            videoId: "78vjoLkWCBw",
            order: 9,
            duration: 1200,
            courseId: "course-react-holetex-01",
            sectionId: "section-react-holetex-02",
          },
          {
            id: "lesson-react-holetex-13",
            title: "Hooks Tips and Patterns",
            content:
              "Learn lesser-known tips, patterns, and best practices when working with React Hooks.",
            videoId: "npRAtdsnBc8",
            order: 10,
            duration: 1200,
            courseId: "course-react-holetex-01",
            sectionId: "section-react-holetex-02",
          },
          {
            id: "lesson-react-holetex-14",
            title: "Dependency Arrays Explained",
            content:
              "Understand how dependency arrays work in hooks and how to avoid infinite loops or stale values.",
            videoId: "ewuDuErxWwY",
            order: 11,
            duration: 900,
            courseId: "course-react-holetex-01",
            sectionId: "section-react-holetex-02",
          },
        ],
      },
      {
        id: "section-react-holetex-03",
        title: "State Management and Performance",
        order: 3,
        totalLessons: 4,
        courseId: "course-react-holetex-01",
        lessons: [
          {
            id: "lesson-react-holetex-15",
            title: "Context API and useContext",
            content:
              "Use the Context API and useContext hook to share state across components without prop drilling.",
            videoId: "SjoWgz0x15s",
            order: 1,
            duration: 1800,
            courseId: "course-react-holetex-01",
            sectionId: "section-react-holetex-03",
          },
          {
            id: "lesson-react-holetex-16",
            title: "Why Not Use Index as Key",
            content:
              "Learn why using array indexes as keys can cause bugs and how to choose stable keys instead.",
            videoId: "7jKMAWvlAbY",
            order: 2,
            duration: 900,
            courseId: "course-react-holetex-01",
            sectionId: "section-react-holetex-03",
          },
          {
            id: "lesson-react-holetex-17",
            title: "Improving Performance with Profiler",
            content:
              "Profile your React components and identify performance bottlenecks using the React Profiler.",
            videoId: "MH7laDSqzPY",
            order: 3,
            duration: 1500,
            courseId: "course-react-holetex-01",
            sectionId: "section-react-holetex-03",
          },
          {
            id: "lesson-react-holetex-18",
            title: "Debounce and Throttle in React",
            content:
              "Use debounce and throttle techniques to optimize frequent events like scrolling and typing.",
            videoId: "IIFGpyGxBrI",
            order: 4,
            duration: 1200,
            courseId: "course-react-holetex-01",
            sectionId: "section-react-holetex-03",
          },
        ],
      },
      {
        id: "section-react-holetex-04",
        title: "Real-World Projects and TypeScript",
        order: 4,
        totalLessons: 5,
        courseId: "course-react-holetex-01",
        lessons: [
          {
            id: "lesson-react-holetex-19",
            title: "Covid-19 Tracker App",
            content:
              "Build a Covid-19 tracker dashboard using React, Material UI, and charting libraries.",
            videoId: "EyV9fqoWhzc",
            order: 1,
            duration: 3600,
            courseId: "course-react-holetex-01",
            sectionId: "section-react-holetex-04",
          },
          {
            id: "lesson-react-holetex-20",
            title: "Real-Time Chat Application",
            content:
              "Create a real-time chat application with React and Firebase for real-time messaging.",
            videoId: "YZhNUU4_Pjw",
            order: 2,
            duration: 5400,
            courseId: "course-react-holetex-01",
            sectionId: "section-react-holetex-04",
          },
          {
            id: "lesson-react-holetex-21",
            title: "Fullstack Notes App",
            content:
              "Build and deploy a fullstack notes application using React, Node.js, GraphQL, MongoDB, and Firebase.",
            videoId: "aM_XIWjxcYA",
            order: 3,
            duration: 7200,
            courseId: "course-react-holetex-01",
            sectionId: "section-react-holetex-04",
          },
          {
            id: "lesson-react-holetex-22",
            title: "React with TypeScript Essentials",
            content:
              "Learn how to use TypeScript with React, including typing props, state, and hooks in modern apps.",
            videoId: "PWjfBREub44",
            order: 4,
            duration: 3600,
            courseId: "course-react-holetex-01",
            sectionId: "section-react-holetex-04",
          },
          {
            id: "lesson-react-holetex-23",
            title: "Creating React Projects in 2025",
            content:
              "Set up new React projects using up-to-date tooling, folder structures, and best practices.",
            videoId: "m1Qa21anb1k",
            order: 5,
            duration: 1800,
            courseId: "course-react-holetex-01",
            sectionId: "section-react-holetex-04",
          },
        ],
      },
    ],
  },
  {
    id: "course-react-01",
    title: "React for Beginners",
    description:
      "Learn the fundamentals of React including components, props, state, and hooks to build modern web applications.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    author: "John Doe",
    level: "Beginner",
    tags: ["React", "Frontend", "Hooks"],
    requirements: [
      "Basic JavaScript knowledge",
      "A code editor (VS Code recommended)",
      "Node.js & npm installed",
    ],
    learningOutcomes: [
      "Build component-based UIs with React",
      "Manage state using hooks",
      "Create reusable UI components",
      "Understand React rendering behavior",
    ],

    totalLessons: 9,
    totalSections: 3,
    totalDuration: 5400, // 1.5 hours

    createdAt: 1709251200000,
    sections: [
      {
        id: "section-react-01",
        title: "Getting Started with React",
        order: 1,
        totalLessons: 3,
        courseId: "course-react-01",
        lessons: [
          {
            id: "lesson-react-01",
            title: "What is React?",
            content:
              "Explore the core concepts of React and why it is a powerful UI library.",
            videoId: "react-intro",
            order: 1,
            duration: 360,
            courseId: "course-react-01",
            sectionId: "section-react-01",
          },
          {
            id: "lesson-react-02",
            title: "JSX and Components",
            content:
              "Learn how to build UIs using JSX and compose components effectively.",
            videoId: "react-jsx",
            order: 2,
            duration: 480,
            courseId: "course-react-01",
            sectionId: "section-react-01",
          },
          {
            id: "lesson-react-03",
            title: "Props and State",
            content:
              "Understand how to pass data to components and manage component state.",
            videoId: "react-props-state",
            order: 3,
            duration: 540,
            courseId: "course-react-01",
            sectionId: "section-react-01",
          },
        ],
      },
      {
        id: "section-react-02",
        title: "Working with Hooks",
        order: 2,
        totalLessons: 3,
        courseId: "course-react-01",
        lessons: [
          {
            id: "lesson-react-04",
            title: "useEffect and Side Effects",
            content:
              "Handle side effects and data fetching in functional components.",
            videoId: "react-use-effect",
            order: 1,
            duration: 600,
            courseId: "course-react-01",
            sectionId: "section-react-02",
          },
          {
            id: "lesson-react-05",
            title: "Custom Hooks",
            content:
              "Extract reusable logic using custom hooks for cleaner components.",
            videoId: "react-custom-hooks",
            order: 2,
            duration: 480,
            courseId: "course-react-01",
            sectionId: "section-react-02",
          },
          {
            id: "lesson-react-06",
            title: "Context API",
            content:
              "Share state between components without prop drilling using context.",
            videoId: "react-context",
            order: 3,
            duration: 540,
            courseId: "course-react-01",
            sectionId: "section-react-02",
          },
        ],
      },
      {
        id: "section-react-03",
        title: "Routing and Performance",
        order: 3,
        totalLessons: 3,
        courseId: "course-react-01",
        lessons: [
          {
            id: "lesson-react-07",
            title: "React Router Basics",
            content:
              "Add navigation to your app using routing and dynamic routes.",
            videoId: "react-router",
            order: 1,
            duration: 420,
            courseId: "course-react-01",
            sectionId: "section-react-03",
          },
          {
            id: "lesson-react-08",
            title: "Performance Optimization",
            content:
              "Learn techniques to optimize rendering and prevent unnecessary re-renders.",
            videoId: "react-performance",
            order: 2,
            duration: 600,
            courseId: "course-react-01",
            sectionId: "section-react-03",
          },
          {
            id: "lesson-react-09",
            title: "Testing React Components",
            content:
              "Write unit tests for UI components using React Testing Library.",
            videoId: "react-testing",
            order: 3,
            duration: 510,
            courseId: "course-react-01",
            sectionId: "section-react-03",
          },
        ],
      },
    ],
  },
  {
    id: "course-nextjs-01",
    title: "Next.js Full Course",
    description:
      "Build production-ready fullstack applications with Next.js, Server Components, routing, and API integration.",
    thumbnail: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3",
    author: "Jane Smith",
    level: "Intermediate",
    tags: ["Next.js", "Fullstack", "SSR"],
    requirements: [
      "Familiarity with React",
      "Basic TypeScript knowledge",
      "Node.js installed",
    ],
    learningOutcomes: [
      "Understand routing and layouts in Next.js",
      "Build server and client components",
      "Integrate APIs and handle data fetching",
      "Deploy a Next.js application",
    ],

    totalLessons: 9,
    totalSections: 3,
    totalDuration: 7200, // 2 hours

    createdAt: 1709337600000,
    sections: [
      {
        id: "section-nextjs-01",
        title: "Getting Started with Next.js",
        order: 1,
        totalLessons: 3,
        courseId: "course-nextjs-01",
        lessons: [
          {
            id: "lesson-nextjs-01",
            title: "Next.js 101",
            content:
              "Learn the fundamentals of Next.js, pages, and file-system routing.",
            videoId: "nextjs-intro",
            order: 1,
            duration: 420,
            courseId: "course-nextjs-01",
            sectionId: "section-nextjs-01",
          },
          {
            id: "lesson-nextjs-02",
            title: "Layouts and Nested Routing",
            content: "Build reusable layouts and nested routing structures.",
            videoId: "nextjs-layouts",
            order: 2,
            duration: 540,
            courseId: "course-nextjs-01",
            sectionId: "section-nextjs-01",
          },
          {
            id: "lesson-nextjs-03",
            title: "Server Components vs Client Components",
            content:
              "Understand the differences and when to use each component type.",
            videoId: "nextjs-server-client",
            order: 3,
            duration: 600,
            courseId: "course-nextjs-01",
            sectionId: "section-nextjs-01",
          },
        ],
      },
      {
        id: "section-nextjs-02",
        title: "Data Fetching and APIs",
        order: 2,
        totalLessons: 3,
        courseId: "course-nextjs-01",
        lessons: [
          {
            id: "lesson-nextjs-04",
            title: "Fetching Data in Next.js",
            content: "Learn the different data fetching strategies in Next.js.",
            videoId: "nextjs-data-fetching",
            order: 1,
            duration: 600,
            courseId: "course-nextjs-01",
            sectionId: "section-nextjs-02",
          },
          {
            id: "lesson-nextjs-05",
            title: "API Routes",
            content: "Create serverless API routes and handle backend logic.",
            videoId: "nextjs-api-routes",
            order: 2,
            duration: 540,
            courseId: "course-nextjs-01",
            sectionId: "section-nextjs-02",
          },
          {
            id: "lesson-nextjs-06",
            title: "Authentication in Next.js",
            content: "Secure routes and handle authentication using NextAuth.",
            videoId: "nextjs-auth",
            order: 3,
            duration: 660,
            courseId: "course-nextjs-01",
            sectionId: "section-nextjs-02",
          },
        ],
      },
      {
        id: "section-nextjs-03",
        title: "Deploying and Optimization",
        order: 3,
        totalLessons: 3,
        courseId: "course-nextjs-01",
        lessons: [
          {
            id: "lesson-nextjs-07",
            title: "Optimizing Performance",
            content: "Optimize images, caching, and application performance.",
            videoId: "nextjs-performance",
            order: 1,
            duration: 540,
            courseId: "course-nextjs-01",
            sectionId: "section-nextjs-03",
          },
          {
            id: "lesson-nextjs-08",
            title: "Deploying to Vercel",
            content:
              "Deploy your Next.js app and configure environment variables.",
            videoId: "nextjs-deploy",
            order: 2,
            duration: 480,
            courseId: "course-nextjs-01",
            sectionId: "section-nextjs-03",
          },
          {
            id: "lesson-nextjs-09",
            title: "Monitoring and Analytics",
            content:
              "Add analytics and monitoring to your production application.",
            videoId: "nextjs-analytics",
            order: 3,
            duration: 600,
            courseId: "course-nextjs-01",
            sectionId: "section-nextjs-03",
          },
        ],
      },
    ],
  },
  {
    id: "course-typescript-01",
    title: "TypeScript Complete Guide",
    description:
      "Master TypeScript from basics to advanced types to write scalable and maintainable JavaScript applications.",
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    author: "Michael Lee",
    level: "Intermediate",
    tags: ["TypeScript", "Typing", "JavaScript"],
    requirements: [
      "Basic JavaScript knowledge",
      "Familiarity with ES6+ syntax",
      "Comfortable with npm/yarn",
    ],
    learningOutcomes: [
      "Write type-safe JavaScript with TypeScript",
      "Use advanced type features effectively",
      "Integrate TypeScript into existing projects",
      "Debug and refactor TypeScript code",
    ],

    totalLessons: 9,
    totalSections: 3,
    totalDuration: 6000, // 1h40m

    createdAt: 1709424000000,
    sections: [
      {
        id: "section-ts-01",
        title: "TypeScript Basics",
        order: 1,
        totalLessons: 3,
        courseId: "course-typescript-01",
        lessons: [
          {
            id: "lesson-ts-01",
            title: "Type System Introduction",
            content:
              "Learn how TypeScript adds types to JavaScript and why it matters.",
            videoId: "ts-intro",
            order: 1,
            duration: 420,
            courseId: "course-typescript-01",
            sectionId: "section-ts-01",
          },
          {
            id: "lesson-ts-02",
            title: "Interfaces and Types",
            content:
              "Declare interfaces, types, and use them to model data structures.",
            videoId: "ts-interfaces",
            order: 2,
            duration: 480,
            courseId: "course-typescript-01",
            sectionId: "section-ts-01",
          },
          {
            id: "lesson-ts-03",
            title: "Type Inference and Guards",
            content:
              "Understand how TypeScript infers types and how to narrow them.",
            videoId: "ts-inference",
            order: 3,
            duration: 540,
            courseId: "course-typescript-01",
            sectionId: "section-ts-01",
          },
        ],
      },
      {
        id: "section-ts-02",
        title: "Advanced TypeScript",
        order: 2,
        totalLessons: 3,
        courseId: "course-typescript-01",
        lessons: [
          {
            id: "lesson-ts-04",
            title: "Generics",
            content: "Write reusable functions and components with generics.",
            videoId: "ts-generics",
            order: 1,
            duration: 600,
            courseId: "course-typescript-01",
            sectionId: "section-ts-02",
          },
          {
            id: "lesson-ts-05",
            title: "Utility Types",
            content:
              "Use built-in utility types like Partial, Pick, and Record.",
            videoId: "ts-utility-types",
            order: 2,
            duration: 480,
            courseId: "course-typescript-01",
            sectionId: "section-ts-02",
          },
          {
            id: "lesson-ts-06",
            title: "TypeScript with React",
            content: "Add strong typing to your React components and props.",
            videoId: "ts-react",
            order: 3,
            duration: 540,
            courseId: "course-typescript-01",
            sectionId: "section-ts-02",
          },
        ],
      },
      {
        id: "section-ts-03",
        title: "Tooling and Best Practices",
        order: 3,
        totalLessons: 3,
        courseId: "course-typescript-01",
        lessons: [
          {
            id: "lesson-ts-07",
            title: "Compiler Options",
            content:
              "Configure TypeScript compiler options for safe and fast builds.",
            videoId: "ts-config",
            order: 1,
            duration: 420,
            courseId: "course-typescript-01",
            sectionId: "section-ts-03",
          },
          {
            id: "lesson-ts-08",
            title: "Linting and Formatting",
            content:
              "Use ESLint and Prettier with TypeScript for consistent code.",
            videoId: "ts-lint",
            order: 2,
            duration: 480,
            courseId: "course-typescript-01",
            sectionId: "section-ts-03",
          },
          {
            id: "lesson-ts-09",
            title: "Migrating JavaScript Projects",
            content:
              "Learn a safe migration strategy from JavaScript to TypeScript.",
            videoId: "ts-migrate",
            order: 3,
            duration: 540,
            courseId: "course-typescript-01",
            sectionId: "section-ts-03",
          },
        ],
      },
    ],
  },
  {
    id: "course-nodejs-01",
    title: "Node.js Backend Development",
    description:
      "Learn how to build REST APIs with Node.js, Express, authentication, and database integration.",
    thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
    author: "David Kim",
    level: "Intermediate",
    tags: ["Node.js", "API", "Backend"],
    requirements: [
      "JavaScript fundamentals",
      "Basic command line usage",
      "Node.js installed",
    ],
    learningOutcomes: [
      "Build REST APIs with Express",
      "Manage authentication and security",
      "Connect to databases (MongoDB/PostgreSQL)",
      "Deploy backend services",
    ],

    totalLessons: 9,
    totalSections: 3,
    totalDuration: 6300, // 1h45m

    createdAt: 1709510400000,
    sections: [
      {
        id: "section-node-01",
        title: "Node.js Fundamentals",
        order: 1,
        totalLessons: 3,
        courseId: "course-nodejs-01",
        lessons: [
          {
            id: "lesson-node-01",
            title: "Node.js Overview",
            content:
              "Understand the Node.js runtime and how it differs from the browser.",
            videoId: "node-intro",
            order: 1,
            duration: 420,
            courseId: "course-nodejs-01",
            sectionId: "section-node-01",
          },
          {
            id: "lesson-node-02",
            title: "Working with the File System",
            content: "Read and write files using Node.js fs module.",
            videoId: "node-fs",
            order: 2,
            duration: 540,
            courseId: "course-nodejs-01",
            sectionId: "section-node-01",
          },
          {
            id: "lesson-node-03",
            title: "Event Loop and Async",
            content:
              "Learn how Node handles concurrency with the event loop and async patterns.",
            videoId: "node-event-loop",
            order: 3,
            duration: 600,
            courseId: "course-nodejs-01",
            sectionId: "section-node-01",
          },
        ],
      },
      {
        id: "section-node-02",
        title: "APIs with Express",
        order: 2,
        totalLessons: 3,
        courseId: "course-nodejs-01",
        lessons: [
          {
            id: "lesson-node-04",
            title: "Building REST APIs",
            content:
              "Create RESTful routes using Express and handle requests/responses.",
            videoId: "node-express",
            order: 1,
            duration: 600,
            courseId: "course-nodejs-01",
            sectionId: "section-node-02",
          },
          {
            id: "lesson-node-05",
            title: "Middleware and Error Handling",
            content:
              "Implement middleware for validation, logging, and errors.",
            videoId: "node-middleware",
            order: 2,
            duration: 540,
            courseId: "course-nodejs-01",
            sectionId: "section-node-02",
          },
          {
            id: "lesson-node-06",
            title: "Authentication Strategies",
            content:
              "Secure APIs with JWT, sessions, and role-based access control.",
            videoId: "node-auth",
            order: 3,
            duration: 600,
            courseId: "course-nodejs-01",
            sectionId: "section-node-02",
          },
        ],
      },
      {
        id: "section-node-03",
        title: "Databases and Deployment",
        order: 3,
        totalLessons: 3,
        courseId: "course-nodejs-01",
        lessons: [
          {
            id: "lesson-node-07",
            title: "Working with Databases",
            content: "Connect Node.js apps to MongoDB and SQL databases.",
            videoId: "node-database",
            order: 1,
            duration: 540,
            courseId: "course-nodejs-01",
            sectionId: "section-node-03",
          },
          {
            id: "lesson-node-08",
            title: "Testing APIs",
            content: "Write integration tests for your API endpoints.",
            videoId: "node-testing",
            order: 2,
            duration: 480,
            courseId: "course-nodejs-01",
            sectionId: "section-node-03",
          },
          {
            id: "lesson-node-09",
            title: "Deploying to the Cloud",
            content:
              "Deploy a Node.js service to platforms like Heroku and Vercel.",
            videoId: "node-deploy",
            order: 3,
            duration: 600,
            courseId: "course-nodejs-01",
            sectionId: "section-node-03",
          },
        ],
      },
    ],
  },
];

export function getCourseById(id: string) {
  return MOCK_COURSES.find((course) => course.id === id);
}

export function getLessonById(courseId: string, lessonId: string) {
  const course = getCourseById(courseId);
  if (!course) return undefined;

  for (const section of course.sections) {
    const lesson = section.lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson;
  }

  return undefined;
}
