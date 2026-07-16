Faceted Filters UI - Next.js

# Proyecto: Faceted Filters UI (Search Engine)

````markdown
# 🔍 Advanced Faceted Search Engine

A SaaS-grade e-commerce filtering system that implements cross-referenced set mathematics. Unlike basic filtering UIs that simply hide DOM elements, this engine calculates the exact availability of attributes across the entire dataset in real-time, completely eliminating "Zero Results" dead ends.

The interface follows a premium, black-and-white minimalist design language, prioritizing clear typography and immediate visual feedback.

## 🚀 Impact & Business Value

In e-commerce and data-heavy SaaS platforms, user retention drops dramatically when users hit empty search results. This engine preemptively disables unavailable filter combinations, guiding the user only toward existing data and significantly improving conversion rates.

## 🧠 Architectural Highlights

- **Faceted Logic (Cross-Evaluation):** The engine evaluates the dataset against all active filters _except_ the category currently being evaluated. This allows the UI to strike out options that have no stock under the current search parameters.
- **Complex AND/OR Intersections:** Functions as an inclusive `OR` within the same category (e.g., selecting Apple and Samsung) and a strict `AND` across different categories (e.g., Tablets under $1000).
- **Diamond Typing:** Strict TypeScript generics and interfaces prevent index errors and ensure data integrity across nested, complex mock data structures.
- **Active Chips Management:** A higher-order state manager that renders removable filter pills, allowing users to micro-manage their search parameters effortlessly.

## 🛠 Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Package Manager:** Bun

## 💻 Quick Start

Install dependencies and start the local environment:

```bash
bun install
bun run dev
```
````
