// Interview questions database and role configuration

export type Role = "SWE" | "PM" | "Data Scientist" | "UX Designer" | "DevOps";
export type Company = "Google" | "Amazon" | "Meta" | "Apple" | "Microsoft" | "Startup" | "Custom";
export type InterviewType = "Full" | "Phone Screen Only" | "Technical Only";
export type StageType = "phone-screen" | "technical" | "deep-dive" | "hr";
export type Verdict = "Pass" | "Fail" | "Marginal";

export interface StageQuestion {
  id: string;
  text: string;
  type: "behavioral" | "technical" | "hr" | "case-study";
  hint?: string;
  timeLimit: number; // seconds
}

export interface TechnicalChallenge {
  text: string;
  hint: string;
  duration: number; // seconds
  examples?: string;
}

export interface RoleConfig {
  stages: StageType[];
  phoneScreenQuestions: StageQuestion[];
  technicalChallenge: TechnicalChallenge;
  deepDiveQuestions: StageQuestion[];
  hrQuestions: StageQuestion[];
}

// ─── SWE ─────────────────────────────────────────────────────────────────────
const swePhoneScreen: StageQuestion[] = [
  {
    id: "swe-bs-1",
    text: "Tell me about a time you had to debug a particularly difficult production issue. Walk me through how you diagnosed and resolved it.",
    type: "behavioral",
    hint: "Use STAR: Situation → Task → Action → Result. Mention tools and metrics.",
    timeLimit: 120,
  },
  {
    id: "swe-bs-2",
    text: "Describe a project where you had to make a significant architectural trade-off. What options did you consider and how did you decide?",
    type: "behavioral",
    hint: "Highlight your engineering judgement and collaboration with the team.",
    timeLimit: 120,
  },
  {
    id: "swe-bs-3",
    text: "Tell me about a time you disagreed with a technical decision made by your team. How did you handle it?",
    type: "behavioral",
    hint: "Focus on constructive disagreement, data-driven reasoning, and outcome.",
    timeLimit: 120,
  },
];

const sweTechnical: TechnicalChallenge = {
  text: `Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Constraints:
• 2 ≤ nums.length ≤ 10⁴
• -10⁹ ≤ nums[i] ≤ 10⁹
• Only one valid answer exists.

Follow-up: Can you solve it in O(n) time?`,
  hint: "Consider using a hash map to store seen values. For each number, check if (target - number) is already in the map.",
  duration: 2700, // 45 min
  examples: `Example 1:
  Input: nums = [2,7,11,15], target = 9
  Output: [0,1]
  Explanation: nums[0] + nums[1] == 9

Example 2:
  Input: nums = [3,2,4], target = 6
  Output: [1,2]`,
};

const sweDeepDive: StageQuestion[] = [
  {
    id: "swe-dd-1",
    text: "Design a URL shortening service like bit.ly. Discuss capacity estimation, data model, API design, and scalability.",
    type: "technical",
    hint: "Consider: read vs write ratio, hash collisions, caching, database sharding.",
    timeLimit: 120,
  },
  {
    id: "swe-dd-2",
    text: "How would you design a distributed rate limiter that works across multiple servers? What algorithms would you consider?",
    type: "technical",
    hint: "Token bucket, sliding window, Redis, consistency trade-offs.",
    timeLimit: 120,
  },
];

const sweHR: StageQuestion[] = [
  {
    id: "swe-hr-1",
    text: "Where do you see yourself in 5 years? How does this role fit into your long-term career goals?",
    type: "hr",
    hint: "Be specific about the skills you want to grow and how this company accelerates that.",
    timeLimit: 120,
  },
  {
    id: "swe-hr-2",
    text: "What are your compensation expectations, and are you currently interviewing elsewhere?",
    type: "hr",
    hint: "Research market rates beforehand. It's fine to mention you're exploring options.",
    timeLimit: 120,
  },
  {
    id: "swe-hr-3",
    text: "Tell me about a time you went above and beyond your job description to help your team succeed.",
    type: "hr",
    hint: "Show ownership and impact beyond your immediate scope.",
    timeLimit: 120,
  },
];

// ─── PM ──────────────────────────────────────────────────────────────────────
const pmPhoneScreen: StageQuestion[] = [
  {
    id: "pm-bs-1",
    text: "Tell me about a product you've shipped that had the biggest impact. How did you measure success?",
    type: "behavioral",
    hint: "Quantify impact with metrics. Explain how you defined and tracked KPIs.",
    timeLimit: 120,
  },
  {
    id: "pm-bs-2",
    text: "Walk me through how you prioritize a backlog when engineering resources are constrained.",
    type: "behavioral",
    hint: "Mention frameworks: RICE, MoSCoW, ICE. Show stakeholder management skills.",
    timeLimit: 120,
  },
  {
    id: "pm-bs-3",
    text: "Describe a time when data and intuition pointed you in different directions. What did you do?",
    type: "behavioral",
    hint: "Show analytical and decision-making skills. Be honest about uncertainty.",
    timeLimit: 120,
  },
];

const pmTechnical: TechnicalChallenge = {
  text: `Product Case Study: Instagram Stories is seeing a 20% drop in daily active users over the past month.

Your task:
1. Identify and prioritize potential root causes
2. Propose 2–3 hypotheses and outline how you would validate each
3. Suggest short-term mitigations and long-term product improvements
4. Define the metrics you would use to measure recovery`,
  hint: "Start with data segmentation (platform, region, user cohort). Use a structured framework. Balance qualitative and quantitative approaches.",
  duration: 2700,
  examples: `Consider factors such as:
• New feature introductions (your own or competitor)
• Changes in content recommendation algorithm
• External events or seasonality
• UX/navigation changes
• Performance degradation`,
};

const pmDeepDive: StageQuestion[] = [
  {
    id: "pm-dd-1",
    text: "How would you decide whether to build a feature in-house, buy a third-party solution, or partner with another company?",
    type: "case-study",
    hint: "Cover: build vs buy vs partner framework, cost, time-to-market, strategic differentiation.",
    timeLimit: 120,
  },
  {
    id: "pm-dd-2",
    text: "You're launching a new B2B SaaS product in a crowded market. How do you identify and win your first 100 enterprise customers?",
    type: "case-study",
    hint: "Think about ICP definition, sales motion, pricing, and early adopter incentives.",
    timeLimit: 120,
  },
];

const pmHR: StageQuestion[] = [
  {
    id: "pm-hr-1",
    text: "Why do you want to leave your current company, and why is this role at our company appealing?",
    type: "hr",
    hint: "Keep it positive. Focus on growth opportunities and alignment with your values.",
    timeLimit: 120,
  },
  {
    id: "pm-hr-2",
    text: "Tell me about a time you had to influence a team you had no authority over.",
    type: "hr",
    hint: "PMs often lead without authority. Show relationship-building and persuasion skills.",
    timeLimit: 120,
  },
  {
    id: "pm-hr-3",
    text: "How do you handle failure? Give me an example of a product decision that didn't work out.",
    type: "hr",
    hint: "Be candid. Show what you learned and how you applied those learnings.",
    timeLimit: 120,
  },
];

// ─── Data Scientist ───────────────────────────────────────────────────────────
const dsPhoneScreen: StageQuestion[] = [
  {
    id: "ds-bs-1",
    text: "Describe a machine learning project where your model didn't perform as expected in production. What went wrong and how did you fix it?",
    type: "behavioral",
    hint: "Cover: data drift, feature leakage, evaluation metric mismatch, monitoring.",
    timeLimit: 120,
  },
  {
    id: "ds-bs-2",
    text: "Tell me about a time you had to explain a complex statistical or ML concept to a non-technical stakeholder.",
    type: "behavioral",
    hint: "Focus on communication clarity, analogies, and business impact framing.",
    timeLimit: 120,
  },
  {
    id: "ds-bs-3",
    text: "Describe a situation where you had incomplete or low-quality data. How did you handle it?",
    type: "behavioral",
    hint: "Mention imputation strategies, outlier handling, feature engineering, domain knowledge.",
    timeLimit: 120,
  },
];

const dsTechnical: TechnicalChallenge = {
  text: `SQL & Analytics Challenge:

Given a table 'orders' with columns:
  order_id (INT), user_id (INT), amount (DECIMAL), created_at (TIMESTAMP), status (VARCHAR)

Write queries to answer:
1. Find the top 5 users by total revenue in the last 30 days (only completed orders)
2. Calculate 7-day rolling average of daily order amounts
3. Find users who placed orders in January but not February (churn analysis)
4. Identify any suspicious spike in order amounts (> 3 standard deviations from monthly mean)`,
  hint: "Use CTEs for readability. Consider WINDOW functions for rolling stats. Think about NULL handling and edge cases.",
  duration: 2700,
  examples: `Sample data:
  order_id | user_id | amount | created_at          | status
  1        | 101     | 50.00  | 2024-01-15 10:00:00 | completed
  2        | 102     | 200.00 | 2024-01-16 14:00:00 | completed
  3        | 101     | 75.00  | 2024-02-03 09:00:00 | pending`,
};

const dsDeepDive: StageQuestion[] = [
  {
    id: "ds-dd-1",
    text: "How do you evaluate and select between competing ML models for a classification task? Walk me through your evaluation framework.",
    type: "technical",
    hint: "Precision/recall tradeoff, AUC-ROC, cross-validation, business cost of false positives vs negatives.",
    timeLimit: 120,
  },
  {
    id: "ds-dd-2",
    text: "You're asked to build a recommendation system from scratch for a new e-commerce platform with cold-start problem. What is your approach?",
    type: "technical",
    hint: "Content-based filtering, collaborative filtering, hybrid approaches, cold-start strategies.",
    timeLimit: 120,
  },
];

const dsHR: StageQuestion[] = [
  {
    id: "ds-hr-1",
    text: "How do you stay current with the rapidly evolving machine learning and data science landscape?",
    type: "hr",
    hint: "Mention papers, conferences, open-source contributions, side projects.",
    timeLimit: 120,
  },
  {
    id: "ds-hr-2",
    text: "Tell me about a time you pushed back on a request to build a model when you didn't think it was the right solution.",
    type: "hr",
    hint: "Show analytical thinking and courage to advocate for the right approach.",
    timeLimit: 120,
  },
  {
    id: "ds-hr-3",
    text: "How do you balance exploration (trying new approaches) with exploitation (using proven methods) in your work?",
    type: "hr",
    hint: "Show pragmatism and research mindset balance.",
    timeLimit: 120,
  },
];

// ─── UX Designer ─────────────────────────────────────────────────────────────
const uxPhoneScreen: StageQuestion[] = [
  {
    id: "ux-bs-1",
    text: "Walk me through your design process for a recent project from discovery to delivery.",
    type: "behavioral",
    hint: "Cover: research methods, ideation, prototyping, testing, and stakeholder collaboration.",
    timeLimit: 120,
  },
  {
    id: "ux-bs-2",
    text: "Tell me about a time user research revealed something that completely changed your design direction.",
    type: "behavioral",
    hint: "Show how you turn insights into design decisions. Be specific about research methods used.",
    timeLimit: 120,
  },
  {
    id: "ux-bs-3",
    text: "Describe a situation where you had to advocate for a user-centered design decision against business or engineering constraints.",
    type: "behavioral",
    hint: "Show how you balance user needs with business goals.",
    timeLimit: 120,
  },
];

const uxTechnical: TechnicalChallenge = {
  text: `Design Challenge: Redesign the checkout flow for a mobile e-commerce app.

Current pain points:
• 78% cart abandonment rate at the payment step
• Users report confusion about shipping costs appearing late in the flow
• Many users have to re-enter address information they've saved before
• The current flow has 6 steps

Your task:
1. Identify the core usability problems in the current flow
2. Sketch/describe a revised checkout flow (can use text to describe screens)
3. Explain how you would validate your redesign assumptions
4. Define success metrics for the redesign`,
  hint: "Think about progressive disclosure, reducing cognitive load, trust signals, and one-tap payments. Describe screens in detail.",
  duration: 2700,
  examples: `Consider:
• One-page checkout vs multi-step
• Guest checkout vs account creation
• Address autocomplete and saved addresses
• Payment method options and Apple/Google Pay
• Order summary visibility throughout`,
};

const uxDeepDive: StageQuestion[] = [
  {
    id: "ux-dd-1",
    text: "Walk me through a piece of work from your portfolio that you're most proud of. What was your unique contribution?",
    type: "case-study",
    hint: "Be specific about your design decisions. Connect them to user research and business outcomes.",
    timeLimit: 120,
  },
  {
    id: "ux-dd-2",
    text: "How do you approach designing for accessibility? Give an example from a past project.",
    type: "case-study",
    hint: "WCAG guidelines, screen readers, color contrast, keyboard navigation, inclusive design.",
    timeLimit: 120,
  },
];

const uxHR: StageQuestion[] = [
  {
    id: "ux-hr-1",
    text: "How do you handle critical feedback on your designs, especially from people you disagree with?",
    type: "hr",
    hint: "Show openness to feedback, ability to separate personal attachment from design decisions.",
    timeLimit: 120,
  },
  {
    id: "ux-hr-2",
    text: "Tell me about a time you had to design under extremely tight deadlines. How did you manage scope?",
    type: "hr",
    hint: "Show prioritization, communication about tradeoffs, and quality vs speed balance.",
    timeLimit: 120,
  },
  {
    id: "ux-hr-3",
    text: "What's your process for collaborating with product managers and engineers?",
    type: "hr",
    hint: "Emphasize communication, documentation, handoffs, and iterative feedback loops.",
    timeLimit: 120,
  },
];

// ─── DevOps ───────────────────────────────────────────────────────────────────
const devopsPhoneScreen: StageQuestion[] = [
  {
    id: "devops-bs-1",
    text: "Describe the most complex CI/CD pipeline you've built or maintained. What made it challenging?",
    type: "behavioral",
    hint: "Cover: tool stack, multi-environment deployments, testing gates, rollback strategy.",
    timeLimit: 120,
  },
  {
    id: "devops-bs-2",
    text: "Tell me about a major production outage you were involved in resolving. Walk me through the incident response.",
    type: "behavioral",
    hint: "STAR format. Cover: detection, triage, mitigation, post-mortem, preventative measures.",
    timeLimit: 120,
  },
  {
    id: "devops-bs-3",
    text: "Describe how you've approached infrastructure-as-code in a previous role. What worked well and what didn't?",
    type: "behavioral",
    hint: "Terraform, Pulumi, CDK, state management, drift detection, team adoption challenges.",
    timeLimit: 120,
  },
];

const devopsTechnical: TechnicalChallenge = {
  text: `Infrastructure Problem: A containerized microservices application is experiencing intermittent high latency spikes (P99 response time jumping from 50ms to 2s) in production, affecting 5% of requests.

The stack:
• Kubernetes cluster (50 pods across 3 services: API, Auth, Database)
• PostgreSQL (managed, RDS)
• Redis cache layer
• AWS ALB for load balancing

Your task:
1. Describe your systematic debugging approach
2. List the observability signals you would check first (metrics, logs, traces)
3. Identify the most likely root causes and how to confirm each
4. Describe your remediation steps and how you'd prevent recurrence`,
  hint: "Think about: connection pool exhaustion, memory pressure, GC pauses, noisy neighbors, network issues, slow queries. Mention specific tools (Prometheus, Grafana, Jaeger, kubectl).",
  duration: 2700,
  examples: `Key signals to investigate:
• CPU/Memory utilization per pod
• Network I/O and packet loss
• Database connection pool metrics
• Cache hit rate
• Application-level error rates
• External dependency latencies`,
};

const devopsDeepDive: StageQuestion[] = [
  {
    id: "devops-dd-1",
    text: "How would you design a zero-downtime deployment strategy for a stateful application with a database schema migration?",
    type: "technical",
    hint: "Blue-green, canary releases, rolling updates, expand-contract pattern for DB migrations.",
    timeLimit: 120,
  },
  {
    id: "devops-dd-2",
    text: "Describe your approach to building a cost-optimized yet highly available Kubernetes infrastructure on a cloud provider.",
    type: "technical",
    hint: "Spot/preemptible instances, HPA, VPA, cluster autoscaler, multi-AZ, reserved capacity.",
    timeLimit: 120,
  },
];

const devopsHR: StageQuestion[] = [
  {
    id: "devops-hr-1",
    text: "How do you feel about on-call rotations? Describe your ideal on-call culture.",
    type: "hr",
    hint: "Show maturity about reliability responsibilities. Mention runbooks, alert quality, blameless culture.",
    timeLimit: 120,
  },
  {
    id: "devops-hr-2",
    text: "Tell me about a time you introduced a significant tool or process change that faced resistance from the team.",
    type: "hr",
    hint: "Show change management skills, empathy, and data-driven approach to building buy-in.",
    timeLimit: 120,
  },
  {
    id: "devops-hr-3",
    text: "How do you prioritize security in a fast-moving development environment where speed is valued?",
    type: "hr",
    hint: "Shift-left security, DevSecOps, automated scanning, security-as-code principles.",
    timeLimit: 120,
  },
];

// ─── Role configs ─────────────────────────────────────────────────────────────
export const ROLE_CONFIGS: Record<Role, RoleConfig> = {
  SWE: {
    stages: ["phone-screen", "technical", "deep-dive", "hr"],
    phoneScreenQuestions: swePhoneScreen,
    technicalChallenge: sweTechnical,
    deepDiveQuestions: sweDeepDive,
    hrQuestions: sweHR,
  },
  PM: {
    stages: ["phone-screen", "technical", "deep-dive", "hr"],
    phoneScreenQuestions: pmPhoneScreen,
    technicalChallenge: pmTechnical,
    deepDiveQuestions: pmDeepDive,
    hrQuestions: pmHR,
  },
  "Data Scientist": {
    stages: ["phone-screen", "technical", "deep-dive", "hr"],
    phoneScreenQuestions: dsPhoneScreen,
    technicalChallenge: dsTechnical,
    deepDiveQuestions: dsDeepDive,
    hrQuestions: dsHR,
  },
  "UX Designer": {
    stages: ["phone-screen", "technical", "deep-dive", "hr"],
    phoneScreenQuestions: uxPhoneScreen,
    technicalChallenge: uxTechnical,
    deepDiveQuestions: uxDeepDive,
    hrQuestions: uxHR,
  },
  DevOps: {
    stages: ["phone-screen", "technical", "deep-dive", "hr"],
    phoneScreenQuestions: devopsPhoneScreen,
    technicalChallenge: devopsTechnical,
    deepDiveQuestions: devopsDeepDive,
    hrQuestions: devopsHR,
  },
};

// ─── Company-specific deep dive overrides ─────────────────────────────────────
export const COMPANY_DEEP_DIVE: Record<Company, StageQuestion[]> = {
  Google: [
    {
      id: "google-dd-1",
      text: "Google is known for its 'moonshot' thinking. Tell me about a time you approached a problem with 10x thinking rather than incremental improvement.",
      type: "behavioral",
      hint: "Reflect on ambitious goal-setting, first-principles thinking, and comfort with ambiguity.",
      timeLimit: 120,
    },
    {
      id: "google-dd-2",
      text: "How would you improve Google Search for users in emerging markets with limited connectivity?",
      type: "case-study",
      hint: "Think about data efficiency, offline capabilities, low-end device support, and localization.",
      timeLimit: 120,
    },
  ],
  Amazon: [
    {
      id: "amazon-dd-1",
      text: "Tell me about a time you demonstrated 'Ownership' — when you took responsibility for something beyond your immediate role.",
      type: "behavioral",
      hint: "Amazon LP: Ownership means thinking long-term and not saying 'that's not my job'.",
      timeLimit: 120,
    },
    {
      id: "amazon-dd-2",
      text: "Describe a time you had to 'Disagree and Commit'. How did you handle it when you disagreed with a decision but needed to move forward?",
      type: "behavioral",
      hint: "Demonstrate Amazon LP: voice your concerns clearly, but commit fully once a decision is made.",
      timeLimit: 120,
    },
  ],
  Meta: [
    {
      id: "meta-dd-1",
      text: "Meta values moving fast. Tell me about a project where you shipped something imperfect to learn quickly. What were the results?",
      type: "behavioral",
      hint: "Show bias for action, hypothesis-driven development, and iterative improvement.",
      timeLimit: 120,
    },
    {
      id: "meta-dd-2",
      text: "How would you approach designing a feature that could have significant social impact or safety implications?",
      type: "case-study",
      hint: "Show awareness of platform responsibility, trust & safety, and diverse user considerations.",
      timeLimit: 120,
    },
  ],
  Apple: [
    {
      id: "apple-dd-1",
      text: "Apple has an extremely high bar for quality and user experience. Describe a time you went back and improved something you'd already shipped because it wasn't good enough.",
      type: "behavioral",
      hint: "Show craftsmanship, attention to detail, and pride in quality work.",
      timeLimit: 120,
    },
    {
      id: "apple-dd-2",
      text: "How do you design and build with privacy in mind from the start, rather than as an afterthought?",
      type: "case-study",
      hint: "Privacy by design, on-device processing, minimal data collection, differential privacy.",
      timeLimit: 120,
    },
  ],
  Microsoft: [
    {
      id: "microsoft-dd-1",
      text: "Microsoft has a growth mindset culture. Tell me about a major technical skill you taught yourself and how you applied it at work.",
      type: "behavioral",
      hint: "Show curiosity, self-directed learning, and translating learning into impact.",
      timeLimit: 120,
    },
    {
      id: "microsoft-dd-2",
      text: "How would you approach building a feature that needs to work across Microsoft's diverse product ecosystem (Azure, Office, Xbox, etc.)?",
      type: "case-study",
      hint: "Cross-platform consistency, API design, extensibility, accessibility standards.",
      timeLimit: 120,
    },
  ],
  Startup: [
    {
      id: "startup-dd-1",
      text: "Startups require wearing many hats. Tell me about a time you took on a completely new responsibility outside your expertise to help the company move forward.",
      type: "behavioral",
      hint: "Show adaptability, learning agility, and entrepreneurial mindset.",
      timeLimit: 120,
    },
    {
      id: "startup-dd-2",
      text: "How do you decide what NOT to build when resources are extremely limited?",
      type: "case-study",
      hint: "Show ruthless prioritization, customer focus, and ability to say no strategically.",
      timeLimit: 120,
    },
  ],
  Custom: [
    {
      id: "custom-dd-1",
      text: "Tell me about the most complex technical challenge you've solved in your career. Why was it hard and what was your approach?",
      type: "behavioral",
      hint: "Showcase your problem-solving process, technical depth, and impact.",
      timeLimit: 120,
    },
    {
      id: "custom-dd-2",
      text: "Where do you see this industry heading in the next 5 years, and how does your background position you to contribute?",
      type: "case-study",
      hint: "Show strategic thinking, industry awareness, and self-awareness about your strengths.",
      timeLimit: 120,
    },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getStageName(stage: StageType): string {
  const names: Record<StageType, string> = {
    "phone-screen": "Phone Screen",
    technical: "Technical Round",
    "deep-dive": "Deep Dive",
    hr: "HR Round",
  };
  return names[stage];
}

export function getStagesForType(
  role: Role,
  type: InterviewType
): StageType[] {
  const config = ROLE_CONFIGS[role];
  if (type === "Phone Screen Only") return ["phone-screen"];
  if (type === "Technical Only") return ["technical"];
  return config.stages;
}

export function getStageRoute(stage: StageType): string {
  const routes: Record<StageType, string> = {
    "phone-screen": "/interview/phone-screen",
    technical: "/interview/technical",
    "deep-dive": "/interview/deep-dive",
    hr: "/interview/hr",
  };
  return routes[stage];
}
