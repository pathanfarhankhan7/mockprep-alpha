// Sample interview tips data - 30+ tips across categories

export type TipCategory = "Behavioral" | "Technical" | "HR" | "Problem-Solving";
export type TipDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface InterviewTip {
  id: string;
  title: string;
  category: TipCategory;
  difficulty: TipDifficulty;
  readTime: number; // minutes
  rating: number; // 1-5
  summary: string;
  content: string;
  tags: string[];
  keyPoints: string[];
  example?: string;
  relatedTipIds: string[];
}

export const INTERVIEW_TIPS: InterviewTip[] = [
  // BEHAVIORAL
  {
    id: "b1",
    title: "Master the STAR Method for Behavioral Questions",
    category: "Behavioral",
    difficulty: "Beginner",
    readTime: 5,
    rating: 4.9,
    summary: "Learn how to structure your answers using the Situation, Task, Action, Result framework.",
    content: `The STAR method is the gold standard for answering behavioral interview questions. Interviewers ask behavioral questions to understand how you have handled real situations in the past, as past behavior is often a good predictor of future behavior.

**Situation**: Set the scene by describing the context. Be specific but concise. Explain when and where this happened.

**Task**: Describe your responsibility or the challenge you faced. What were you expected to do?

**Action**: Explain the specific steps you took. Use "I" not "we" — the interviewer wants to know your individual contribution.

**Result**: Share the outcome of your actions. Quantify if possible (e.g., "reduced processing time by 30%", "increased customer satisfaction scores by 15%").

The STAR method helps you give structured, memorable answers that demonstrate your competencies clearly. Practice crafting STAR stories for common themes: leadership, conflict resolution, teamwork, problem-solving, and failure/learning.`,
    tags: ["STAR", "structure", "behavioral", "framework"],
    keyPoints: [
      "Use Situation, Task, Action, Result structure",
      "Keep Situation and Task brief (20% of answer)",
      "Focus most time on Action steps (60%)",
      "Always share a concrete Result with numbers when possible",
      "Practice 8-10 core stories covering different competencies",
    ],
    example: `**Q: Tell me about a time you led a team through a difficult project.**

**S**: In my last role, our team had just 3 weeks to migrate a legacy system before a critical deadline.
**T**: As the tech lead, I was responsible for coordinating 5 engineers and ensuring zero data loss.
**A**: I broke the migration into daily milestones, held 15-minute standups, and set up automated rollback scripts.
**R**: We delivered on time with zero incidents, and the system's performance improved by 40%.`,
    relatedTipIds: ["b2", "b5", "b7"],
  },
  {
    id: "b2",
    title: "Handling 'Tell Me About Yourself' Perfectly",
    category: "Behavioral",
    difficulty: "Beginner",
    readTime: 4,
    rating: 4.8,
    summary: "Craft a compelling 2-minute professional summary that sets the tone for your interview.",
    content: `"Tell me about yourself" is almost always the first question. It is your chance to make a strong first impression and guide the conversation. Many candidates make the mistake of reciting their resume — instead, tell a story.

**The Present-Past-Future Formula**:
- **Present**: Start with your current role and most relevant responsibilities
- **Past**: Briefly mention key past experiences that led you here
- **Future**: Connect everything to why you're excited about this specific role

Keep your answer to 90 seconds to 2 minutes. Practice it out loud until it flows naturally.

**What to Avoid**:
- Don't start with "Well, I was born..." (too personal)
- Don't simply list job titles from your resume
- Don't mention unrelated hobbies unless they tie to the job
- Don't be too brief ("I'm a developer, that's it")`,
    tags: ["introduction", "first impression", "summary", "presentation"],
    keyPoints: [
      "Use the Present-Past-Future structure",
      "Keep it 90 seconds to 2 minutes",
      "End by connecting your background to this specific role",
      "Practice out loud at least 10 times",
      "Customize slightly for each company/role",
    ],
    relatedTipIds: ["b1", "hr1", "hr2"],
  },
  {
    id: "b3",
    title: "Answering 'What Is Your Greatest Weakness?'",
    category: "Behavioral",
    difficulty: "Intermediate",
    readTime: 4,
    rating: 4.7,
    summary: "Turn a tricky question into a strength by demonstrating self-awareness and growth mindset.",
    content: `This question trips up many candidates. The goal is not to trick you but to assess self-awareness and your ability to grow.

**The Formula**: Name a real weakness + Describe the steps you're taking to improve + Show progress.

**Avoid These Mistakes**:
- Disguised strengths: "I work too hard" — interviewers see through this
- Critical weaknesses: Never mention something essential to the role
- No growth plan: Mentioning a weakness without showing improvement steps

**Good Examples**:
- "I used to struggle with public speaking. I joined Toastmasters and have since presented to groups of 50+."
- "Early in my career, I had difficulty delegating. I've worked on trusting my team more and have seen our velocity increase significantly."

The best answers show genuine self-reflection and a concrete improvement journey.`,
    tags: ["weakness", "self-awareness", "growth mindset", "difficult questions"],
    keyPoints: [
      "Choose a real but non-critical weakness",
      "Always pair it with concrete improvement steps",
      "Show measurable progress where possible",
      "Avoid clichéd answers like 'I'm a perfectionist'",
      "Keep the answer concise (60-90 seconds)",
    ],
    relatedTipIds: ["b1", "b4"],
  },
  {
    id: "b4",
    title: "Discussing Failure and Learning from Mistakes",
    category: "Behavioral",
    difficulty: "Intermediate",
    readTime: 5,
    rating: 4.6,
    summary: "Show resilience and growth mindset by turning past failures into compelling stories.",
    content: `Questions about failure ("Tell me about a time you failed" or "Describe your biggest professional mistake") can reveal a lot about your character. Interviewers want to see self-awareness, resilience, and learning.

**Framework for Failure Questions**:
1. **Own it**: Don't deflect blame onto others. Take personal responsibility.
2. **Contextualize**: Briefly explain what happened and the stakes.
3. **Reflect**: What went wrong? What would you do differently?
4. **Apply**: How did you grow? What changed in your behavior?

**The Ideal Failure Story Has**:
- A real failure (not a minor mistake)
- Clear personal accountability
- A specific lesson learned
- Evidence you applied that lesson subsequently

Avoid choosing failures that are ongoing, catastrophic to the company, or that paint you as incompetent for the role you're applying to.`,
    tags: ["failure", "resilience", "growth", "accountability"],
    keyPoints: [
      "Take personal ownership without blaming others",
      "Choose a real, meaningful failure not a trivial slip",
      "Focus 50% of the answer on the lesson and what changed",
      "Show how you applied the lesson in a subsequent situation",
      "Practice the story until it sounds natural and reflective",
    ],
    relatedTipIds: ["b1", "b3"],
  },
  {
    id: "b5",
    title: "Demonstrating Leadership Without a Title",
    category: "Behavioral",
    difficulty: "Intermediate",
    readTime: 5,
    rating: 4.7,
    summary: "Show leadership qualities through influence, initiative, and impact regardless of your seniority.",
    content: `You don't need a management title to demonstrate leadership. Interviewers at all levels want to see leadership qualities — the ability to influence, inspire, and drive outcomes.

**Ways to Demonstrate Leadership**:
- **Mentoring**: Helping colleagues grow
- **Initiating**: Starting a project or process improvement nobody asked you to
- **Problem-solving**: Identifying issues and proposing solutions
- **Communication**: Keeping stakeholders aligned during complex projects
- **Decision-making**: Making tough calls under pressure

**Phrases That Signal Leadership**:
- "I noticed a gap and took the initiative to..."
- "I brought together different stakeholders to align on..."
- "I mentored a junior team member who went on to..."
- "When our team was stuck, I proposed..."

Use STAR format to tell these stories, focusing on your individual actions and their organizational impact.`,
    tags: ["leadership", "influence", "initiative", "impact"],
    keyPoints: [
      "Leadership is about influence, not titles",
      "Highlight initiative, mentoring, and stakeholder management",
      "Use specific examples with measurable outcomes",
      "Show how you brought others along with you",
      "Connect your leadership story to the role's requirements",
    ],
    relatedTipIds: ["b1", "b6"],
  },
  {
    id: "b6",
    title: "Handling Conflict in the Workplace",
    category: "Behavioral",
    difficulty: "Intermediate",
    readTime: 4,
    rating: 4.5,
    summary: "Navigate conflict questions by showing collaboration, empathy, and problem-resolution skills.",
    content: `Conflict resolution questions reveal your emotional intelligence and collaboration skills. Common questions: "Tell me about a time you disagreed with your manager" or "Describe a conflict with a coworker and how you resolved it."

**Key Principles**:
- Stay professional and neutral — don't badmouth anyone
- Focus on the issue, not the person
- Emphasize collaboration and finding common ground
- Show the positive outcome

**Good Answer Structure**:
1. Briefly describe the conflict (be neutral)
2. Explain your approach to resolution (empathy, active listening)
3. Describe the specific steps you took (private conversation, seeking to understand their perspective)
4. Share the outcome (relationship preserved or improved, project succeeded)

**Red Flags to Avoid**:
- "My coworker was impossible to work with..."
- Describing conflict you never resolved
- Showing you always need a manager to mediate`,
    tags: ["conflict", "collaboration", "emotional intelligence", "teamwork"],
    keyPoints: [
      "Keep all parties anonymous and described neutrally",
      "Show you sought to understand before being understood",
      "Emphasize the collaborative resolution process",
      "Highlight the positive outcome for the team/project",
      "Demonstrate emotional maturity throughout",
    ],
    relatedTipIds: ["b1", "b5"],
  },
  {
    id: "b7",
    title: "Answering 'Where Do You See Yourself in 5 Years?'",
    category: "Behavioral",
    difficulty: "Beginner",
    readTime: 3,
    rating: 4.5,
    summary: "Give an ambitious yet realistic answer that aligns your goals with the company's growth.",
    content: `This question assesses your ambition, self-awareness, and whether your goals align with what the company can offer. The key is to be ambitious but realistic, and to align your answer with the role and company.

**What Interviewers Want to Hear**:
- You're committed and not just looking for a temporary position
- Your growth ambitions are realistic and tied to skill development
- You see yourself growing within this company/industry

**The Formula**:
1. Express genuine enthusiasm for the role and what you'll learn
2. Mention a next-level aspiration (senior role, deeper expertise, leadership)
3. Tie it back to how this company can help you achieve that

**Example**: "In 5 years, I hope to have developed deep expertise in cloud architecture and be taking on more technical leadership — perhaps mentoring junior engineers. I see [Company] as the ideal place to do that given your focus on distributed systems."

**Avoid**: "I want your job", "I'll probably be at a different company", or no plan at all.`,
    tags: ["career goals", "long-term", "ambition", "planning"],
    keyPoints: [
      "Show commitment and genuine interest in the role",
      "Express realistic, achievable ambition",
      "Tie your goals to this company's opportunities",
      "Avoid specifics that imply you'll leave soon",
      "Focus on skill development and contribution, not just titles",
    ],
    relatedTipIds: ["b2", "hr3"],
  },

  // TECHNICAL
  {
    id: "t1",
    title: "How to Think Out Loud in Technical Interviews",
    category: "Technical",
    difficulty: "Beginner",
    readTime: 5,
    rating: 4.8,
    summary: "Turn the technical interview into a collaborative problem-solving session by narrating your thought process.",
    content: `One of the most underrated skills in technical interviews is the ability to think out loud. Interviewers are not just evaluating your final solution — they want to understand how you approach problems.

**Why It Matters**:
- Gives interviewers insight into your reasoning
- Allows them to guide you if you're going in the wrong direction
- Demonstrates communication skills critical for engineering roles
- Turns a failure to solve a problem into a partial success

**How to Think Out Loud**:
1. **Restate the problem**: "So what I'm hearing is that I need to find..."
2. **Ask clarifying questions**: "Can I assume the input is always sorted?"
3. **State your approach**: "I'm thinking of using a hash map to achieve O(1) lookups..."
4. **Narrate as you code**: "I'm initializing this variable to track the maximum..."
5. **Check your work**: "Let me trace through with this example input..."

**Common Mistakes**:
- Going silent for 5+ minutes
- Jumping straight into code without planning
- Not verifying your solution with test cases`,
    tags: ["communication", "problem-solving", "coding", "process"],
    keyPoints: [
      "Verbalize your thought process from the very start",
      "Ask clarifying questions before writing any code",
      "State your approach and its trade-offs before coding",
      "Narrate what you're doing as you write code",
      "Always test your solution with examples",
    ],
    relatedTipIds: ["t2", "t3", "ps1"],
  },
  {
    id: "t2",
    title: "Optimizing Algorithm Complexity: Time and Space",
    category: "Technical",
    difficulty: "Intermediate",
    readTime: 7,
    rating: 4.7,
    summary: "Understand Big-O notation and how to systematically improve your solutions.",
    content: `Big-O analysis is a fundamental skill for technical interviews. You need to not only solve problems but analyze and optimize your solutions.

**Key Complexity Classes** (best to worst):
- O(1) — Constant
- O(log n) — Logarithmic (binary search)
- O(n) — Linear
- O(n log n) — Linearithmic (efficient sorting)
- O(n²) — Quadratic (nested loops)
- O(2ⁿ) — Exponential (brute-force recursion)

**Optimization Strategies**:
1. **Trade space for time**: Use hash maps/sets for O(1) lookup instead of O(n) array search
2. **Avoid redundant work**: Memoization and dynamic programming
3. **Use sorted data**: Binary search reduces O(n) to O(log n)
4. **Two-pointer technique**: Reduces O(n²) to O(n) for array problems
5. **Sliding window**: Efficient for substring/subarray problems

**Always State Complexity**: After coding, proactively state: "This solution is O(n) time and O(1) space." Interviewers appreciate this.`,
    tags: ["algorithms", "Big-O", "optimization", "data structures"],
    keyPoints: [
      "Know the Big-O of common data structure operations",
      "Always analyze both time and space complexity",
      "Hash maps are often the key to reducing time complexity",
      "Look for patterns: two-pointer, sliding window, BFS/DFS",
      "Always discuss trade-offs between time and space",
    ],
    relatedTipIds: ["t1", "t3", "ps2"],
  },
  {
    id: "t3",
    title: "Mastering System Design Interviews",
    category: "Technical",
    difficulty: "Advanced",
    readTime: 10,
    rating: 4.9,
    summary: "Framework for approaching large-scale system design questions with confidence.",
    content: `System design interviews assess your ability to design scalable, reliable systems. These are typically given to senior engineers but increasingly appear at mid-level.

**The RESHADED Framework**:
- **R**equirements: Clarify functional and non-functional requirements
- **E**stimation: Scale estimation (users, requests/sec, storage)
- **S**torage: Data model and database choices
- **H**igh-level design: Core components and their interactions
- **A**PI design: Key endpoints and data contracts
- **D**etailed design: Deep-dive on critical components
- **E**valuate: Trade-offs, bottlenecks, failure points
- **D**istinguish: How your design handles edge cases

**Key Concepts to Know**:
- Load balancing (round-robin, least connections)
- Horizontal vs. vertical scaling
- CAP theorem and eventual consistency
- CDN for static content delivery
- Caching layers (Redis, Memcached)
- Message queues (Kafka, RabbitMQ)
- Database sharding and replication
- Microservices vs. monolith`,
    tags: ["system design", "scalability", "architecture", "distributed systems"],
    keyPoints: [
      "Always start by clarifying requirements",
      "Do back-of-envelope calculations for scale",
      "Draw diagrams and explain as you go",
      "Discuss trade-offs explicitly",
      "Know CAP theorem, consistency models, and common patterns",
    ],
    relatedTipIds: ["t2", "t4"],
  },
  {
    id: "t4",
    title: "Debugging Strategies in Technical Interviews",
    category: "Technical",
    difficulty: "Intermediate",
    readTime: 5,
    rating: 4.6,
    summary: "Systematic approaches to find and fix bugs in your code during live interviews.",
    content: `When your code doesn't work in a technical interview, how you debug is just as important as the solution itself.

**Systematic Debugging Approach**:
1. **Don't panic**: Take a breath and approach methodically
2. **Trace through**: Manually execute your code line by line with a simple example
3. **Check edge cases**: Empty input, single element, negative numbers, overflow
4. **Print/trace statements**: Mentally add debug output to narrow down the issue
5. **Review your logic**: Re-read the requirements — are you solving the right problem?

**Common Bug Sources**:
- Off-by-one errors in loops
- Null/undefined not handled
- Wrong termination condition
- Mutating input when you shouldn't
- Integer overflow for large inputs

**Pro Tip**: Before submitting, always trace through your solution with:
- A normal case
- An edge case (empty, single element)
- The example from the problem statement

Narrate your debugging process out loud — even the act of debugging systematically impresses interviewers.`,
    tags: ["debugging", "problem-solving", "coding", "testing"],
    keyPoints: [
      "Trace through code manually before claiming it's correct",
      "Test with at least 3 cases: normal, edge, and given example",
      "Narrate your debugging process to the interviewer",
      "Know common bug patterns: off-by-one, null handling",
      "Stay calm — methodical debugging shows engineering maturity",
    ],
    relatedTipIds: ["t1", "t2", "ps1"],
  },
  {
    id: "t5",
    title: "Preparing for Coding Interviews: 6-Week Plan",
    category: "Technical",
    difficulty: "Beginner",
    readTime: 8,
    rating: 4.8,
    summary: "Structured 6-week preparation plan covering all the patterns you need for coding interviews.",
    content: `A structured preparation plan is the difference between feeling lost and feeling confident. Here's a proven 6-week roadmap.

**Week 1-2: Foundations**
- Arrays and strings (two-pointer, sliding window)
- Hash maps and sets
- Sorting algorithms (know merge sort, quick sort complexity)

**Week 3: Trees and Graphs**
- Binary trees (traversals, BST operations)
- Graph traversal (BFS, DFS)
- Recursion and backtracking basics

**Week 4: Advanced Data Structures**
- Heaps/priority queues
- Stacks and queues
- Linked lists (reversal, cycle detection)

**Week 5: Dynamic Programming**
- 1D DP (climbing stairs, coin change)
- 2D DP (grid problems)
- Knapsack variants

**Week 6: Mock Interviews & Polish**
- Daily timed mock problems (45 minutes each)
- Review weak areas
- Practice thinking out loud

**Resources**: LeetCode (focus on top 150 questions), NeetCode roadmap, Cracking the Coding Interview.`,
    tags: ["preparation", "study plan", "coding", "LeetCode"],
    keyPoints: [
      "Follow a structured plan — don't grind randomly",
      "Focus on patterns, not individual problems",
      "Do mock interviews in the final week",
      "Prioritize medium difficulty problems",
      "Understand why solutions work, not just how",
    ],
    relatedTipIds: ["t1", "t2", "t4"],
  },
  {
    id: "t6",
    title: "Common Object-Oriented Design Interview Patterns",
    category: "Technical",
    difficulty: "Advanced",
    readTime: 8,
    rating: 4.6,
    summary: "Key OOP design patterns and how to apply them in technical interviews.",
    content: `Object-oriented design (OOD) interviews ask you to design classes and systems for real-world problems (e.g., design a parking lot, elevator system, chess game).

**Key Design Patterns to Know**:

**Creational**:
- **Singleton**: One instance only (e.g., database connection pool)
- **Factory**: Create objects without specifying exact class
- **Builder**: Construct complex objects step by step

**Structural**:
- **Adapter**: Make incompatible interfaces work together
- **Decorator**: Add behavior without modifying original class
- **Observer**: Notify multiple objects when state changes (event systems)

**Behavioral**:
- **Strategy**: Define a family of algorithms, make them interchangeable
- **Command**: Encapsulate requests as objects (undo/redo)

**OOD Interview Approach**:
1. Clarify requirements (ask questions!)
2. Identify core entities (nouns → classes)
3. Define relationships (has-a, is-a)
4. Add key methods (verbs → methods)
5. Apply SOLID principles`,
    tags: ["OOP", "design patterns", "architecture", "classes"],
    keyPoints: [
      "Know the most common design patterns by name and use case",
      "Apply SOLID principles (Single responsibility, Open-closed, etc.)",
      "Start with entity identification before jumping to code",
      "Discuss trade-offs of different pattern choices",
      "Use UML-style diagrams to communicate designs",
    ],
    relatedTipIds: ["t3", "t5"],
  },
  {
    id: "t7",
    title: "Whiteboard Coding Best Practices",
    category: "Technical",
    difficulty: "Beginner",
    readTime: 4,
    rating: 4.5,
    summary: "How to write clean, readable code on a whiteboard to impress interviewers.",
    content: `Whiteboard coding is a unique skill. Unlike coding on a computer, you can't run your code or use autocomplete. Here's how to do it well.

**Formatting Tips**:
- Write legibly — if your handwriting is poor, print
- Leave margins for corrections
- Use consistent indentation (4 spaces is readable)
- Write variable names clearly, not 'x' or 'temp'
- Leave space between lines for insertions

**Process Tips**:
1. Write pseudocode first, then translate to real code
2. Start from the top and work down
3. If you need to skip a section, mark it "TODO" and come back
4. Test with a simple example before declaring done
5. Don't erase — cross out and rewrite beside it

**Before You Write**:
- Define your function signature first
- List any helper functions you'll need
- Note what your code returns

**Code Quality Matters**: Clean, readable code on a whiteboard signals that you write clean code in production too.`,
    tags: ["whiteboard", "coding", "presentation", "interview skills"],
    keyPoints: [
      "Legibility over speed — neat handwriting matters",
      "Write pseudocode before actual code",
      "Define function signatures and return types first",
      "Test your solution on the whiteboard before finishing",
      "Narrate as you write",
    ],
    relatedTipIds: ["t1", "t4"],
  },

  // HR
  {
    id: "hr1",
    title: "Researching the Company Before Your Interview",
    category: "HR",
    difficulty: "Beginner",
    readTime: 5,
    rating: 4.8,
    summary: "How to research a company effectively so you can demonstrate genuine interest and culture fit.",
    content: `Nothing impresses interviewers more than a candidate who has done their homework. And nothing turns them off more than someone who clearly hasn't.

**What to Research**:
1. **Company basics**: Products/services, founding story, size, mission
2. **Recent news**: Press releases, funding rounds, product launches (last 6 months)
3. **Culture**: Glassdoor reviews, LinkedIn employee posts, company values
4. **Competitors**: Who they compete with and what differentiates them
5. **Financial health**: Publicly available reports for public companies
6. **The team**: LinkedIn profiles of your interviewers

**How to Use This Research**:
- Reference specific projects or initiatives in your answers
- Ask informed questions at the end ("I read about your expansion into X — how does this role contribute to that?")
- Connect your background to their specific challenges

**Where to Research**:
- Company website (especially About, Blog, Careers pages)
- LinkedIn (company page + employee posts)
- Glassdoor (culture insights)
- Crunchbase (funding and leadership)
- Google News for recent developments`,
    tags: ["research", "preparation", "culture fit", "company knowledge"],
    keyPoints: [
      "Research within 48 hours of the interview",
      "Focus on recent news and company mission",
      "Know your interviewers' backgrounds via LinkedIn",
      "Prepare 2-3 specific company mentions to work into your answers",
      "Use research to craft insightful closing questions",
    ],
    relatedTipIds: ["hr2", "hr3", "b2"],
  },
  {
    id: "hr2",
    title: "Why Do You Want to Work Here? — A Winning Answer",
    category: "HR",
    difficulty: "Beginner",
    readTime: 4,
    rating: 4.7,
    summary: "Craft an authentic, research-backed answer that shows genuine enthusiasm for the role and company.",
    content: `"Why do you want to work here?" is deceptively simple — yet many candidates fail it by giving generic answers.

**What Interviewers Are Really Asking**:
- Are you genuinely interested or just applying everywhere?
- Have you done your homework?
- Will you be engaged and stay long-term?

**The Three-Part Formula**:
1. **Company reason**: Something specific about this company (product, mission, recent achievement)
2. **Role reason**: Why this specific role excites you (growth, challenges, skills match)
3. **Personal fit**: How your values/strengths align with their culture

**Bad Example**:
"You're a great company with good culture and I heard the pay is good."

**Good Example**:
"I've been following [Company]'s work on AI-powered accessibility tools for a while — it directly aligns with my passion for inclusive tech. The [Role] specifically caught my eye because it combines product strategy with engineering, which is exactly where I want to grow. Your culture of cross-functional collaboration also resonates strongly with how I work best."

Always be specific. Generic answers signal generic interest.`,
    tags: ["motivation", "culture fit", "research", "HR questions"],
    keyPoints: [
      "Be specific — reference actual company products, values, or news",
      "Connect the role to your genuine professional interests",
      "Show alignment between your values and the company culture",
      "Research competitors to show you've made an intentional choice",
      "Enthusiasm is contagious — let yours show",
    ],
    relatedTipIds: ["hr1", "hr3", "b2"],
  },
  {
    id: "hr3",
    title: "Negotiating Your Salary with Confidence",
    category: "HR",
    difficulty: "Advanced",
    readTime: 6,
    rating: 4.9,
    summary: "Evidence-based salary negotiation tactics that get you the compensation you deserve.",
    content: `Salary negotiation is one of the most important but overlooked interview skills. Studies show that 85% of employers have room to negotiate — but many candidates don't ask.

**Before the Negotiation**:
1. Research market rates (Glassdoor, Levels.fyi, LinkedIn Salary)
2. Know your BATNA (Best Alternative to Negotiated Agreement) — your walkaway point
3. Prepare your value argument (specific contributions, rare skills)

**Key Principles**:
- **Let them make the first offer** when possible
- **Never give a single number** — give a range where your target is the low end
- **Anchor high** — research suggests the first number anchors the negotiation
- **Silence is powerful** — after stating your number, stay quiet
- **Negotiate the whole package**: base, equity, bonus, remote flexibility, PTO

**Phrases That Work**:
- "Based on my research and experience, I was expecting something in the $X-Y range."
- "I'm very excited about this opportunity. Is there flexibility on the base compensation?"
- "I have another offer I'm considering at $X — can you match or come close to that?"

**Never Apologize for Negotiating**: Hiring managers expect it.`,
    tags: ["salary", "negotiation", "compensation", "offer"],
    keyPoints: [
      "Research market rates before any salary conversation",
      "Let the employer make the first offer when possible",
      "Negotiate the full package, not just base salary",
      "Use silence as a tool after stating your number",
      "Always be respectful — you'll work with these people",
    ],
    relatedTipIds: ["hr1", "hr2"],
  },
  {
    id: "hr4",
    title: "Asking Powerful Questions at the End of the Interview",
    category: "HR",
    difficulty: "Beginner",
    readTime: 4,
    rating: 4.7,
    summary: "The 5 best questions to ask at the end of an interview that show depth and leave a lasting impression.",
    content: `"Do you have any questions for us?" — the answer should never be "No." The questions you ask reveal your level of preparation, critical thinking, and genuine interest.

**Top 5 Questions to Ask**:

1. "What does success look like for someone in this role in the first 90 days?"
   → Shows you're result-oriented and ready to hit the ground running.

2. "What are the biggest challenges someone in this role will face?"
   → Shows you're realistic and want to be prepared.

3. "How would you describe the team culture and how the team collaborates?"
   → Shows culture is important to you (it signals retention thinking).

4. "What are the most important skills or qualities for someone to excel in this role beyond what's listed in the job description?"
   → Shows you want to exceed expectations.

5. "What do you personally enjoy most about working here?"
   → Personal and humanizing — great for building rapport.

**Questions to Avoid**:
- "What does the company do?" (you should already know)
- "How much vacation time do I get?" (save for offer stage)
- "When will I be promoted?" (too early)`,
    tags: ["questions", "interview close", "engagement", "impression"],
    keyPoints: [
      "Always prepare 5-7 questions in advance",
      "Ask questions that reveal you've done research",
      "Avoid asking about salary/benefits in first round",
      "Listen actively to answers — ask follow-ups",
      "Your questions are part of your evaluation",
    ],
    relatedTipIds: ["hr1", "hr2", "b2"],
  },
  {
    id: "hr5",
    title: "Virtual Interview Best Practices",
    category: "HR",
    difficulty: "Beginner",
    readTime: 4,
    rating: 4.6,
    summary: "Technical and behavioral tips for making a great impression in video interviews.",
    content: `Video interviews have become the norm. Technical issues or poor setup can hurt your chances even if your answers are excellent.

**Technical Setup**:
- Test your camera, microphone, and internet 30 minutes before
- Use a wired connection if possible for video calls
- Have a backup plan (phone hotspot, phone number to call in)
- Close unnecessary tabs and notifications
- Use headphones with a built-in microphone for clarity

**Environment**:
- Clean, uncluttered background (or use a professional virtual background)
- Good lighting: face a window or use a ring light
- No distractions: pets, people, notifications silenced
- Camera at eye level (not looking up at ceiling)

**Appearance and Body Language**:
- Dress professionally from head to mid-torso at least
- Look at the camera (not the screen) when speaking
- Smile and nod to show engagement
- Sit straight, don't slouch

**During the Interview**:
- Join 5 minutes early
- Have your resume and notes visible but off-screen
- Mute when not speaking if there's background noise
- It's okay to ask "Can you repeat that?" for poor audio`,
    tags: ["virtual interview", "video call", "technical setup", "remote"],
    keyPoints: [
      "Test all technology at least 30 minutes before",
      "Optimize lighting, background, and camera angle",
      "Look at the camera to simulate eye contact",
      "Join the call 5 minutes early",
      "Dress professionally from the waist up at minimum",
    ],
    relatedTipIds: ["hr1", "hr4"],
  },
  {
    id: "hr6",
    title: "Following Up After an Interview",
    category: "HR",
    difficulty: "Beginner",
    readTime: 3,
    rating: 4.4,
    summary: "Write a thank-you email that reinforces your candidacy and keeps you top-of-mind.",
    content: `A follow-up thank-you email is a small action with big impact. Only about 25% of candidates send one — making it an easy way to differentiate yourself.

**When to Send**: Within 24 hours of the interview.

**What to Include**:
1. Express genuine gratitude for their time
2. Reference a specific topic from the interview (shows you were engaged)
3. Reinforce one key strength or fit that you want them to remember
4. Express continued enthusiasm for the role

**Template**:
"Hi [Name], Thank you for taking the time to speak with me today about the [Role] position. I really enjoyed learning about [specific topic discussed]. Our conversation reinforced my excitement about this opportunity — particularly [specific thing about role/company]. I believe my background in [relevant strength] would enable me to contribute to [specific goal you discussed]. I look forward to next steps. Please don't hesitate to reach out if you need any additional information."

**Personalization Tips**:
- Send individual emails to each interviewer
- Reference something unique from each conversation
- Keep it concise (150-200 words)`,
    tags: ["follow-up", "thank you email", "networking", "post-interview"],
    keyPoints: [
      "Send within 24 hours of the interview",
      "Reference a specific topic from the conversation",
      "Reinforce your top selling point",
      "Keep it brief (150-200 words)",
      "Send individual emails to each person you met",
    ],
    relatedTipIds: ["hr1", "hr4"],
  },

  // PROBLEM-SOLVING
  {
    id: "ps1",
    title: "Breaking Down Complex Problems Systematically",
    category: "Problem-Solving",
    difficulty: "Intermediate",
    readTime: 6,
    rating: 4.8,
    summary: "A step-by-step framework for approaching any complex problem with clarity and confidence.",
    content: `Complex problems feel overwhelming because we try to solve them all at once. The key is to break them into manageable pieces.

**The IDEAL Problem-Solving Framework**:
- **I**dentify the problem clearly (restate it in your own words)
- **D**efine what success looks like (what does the solution look like?)
- **E**xplore multiple approaches (don't commit to the first idea)
- **A**ct on the best approach (implement with checkpoints)
- **L**ook back and learn (did it work? what would you do differently?)

**Clarifying Questions to Ask**:
- "What constraints do we have?"
- "What does the ideal outcome look like?"
- "What happens if we don't solve this?"
- "Have we tried similar approaches before?"
- "What resources do we have available?"

**Common Decomposition Strategies**:
1. **Divide and conquer**: Split into sub-problems
2. **Work backwards**: Start from the goal and trace backwards
3. **Analogize**: Think of a similar problem you've solved
4. **Simplify first**: Solve the simplest version, then add complexity`,
    tags: ["problem-solving", "framework", "analytical thinking", "decomposition"],
    keyPoints: [
      "Always restate the problem before attempting to solve it",
      "Explore at least 2-3 approaches before committing",
      "Break large problems into sub-problems",
      "Define what 'done' looks like before starting",
      "Reflect on outcomes to improve future problem-solving",
    ],
    relatedTipIds: ["ps2", "ps3", "t1"],
  },
  {
    id: "ps2",
    title: "Data-Driven Decision Making in Interviews",
    category: "Problem-Solving",
    difficulty: "Intermediate",
    readTime: 5,
    rating: 4.7,
    summary: "Show analytical rigor by backing your decisions with data, metrics, and evidence.",
    content: `Strong candidates don't just answer questions — they answer with evidence. Data-driven thinking is one of the most valued competencies across all roles.

**How to Incorporate Data**:
- Quantify your past impact: "I reduced load time by 40%", "Increased conversion by 12%"
- Use metrics to frame problems: "We saw a 30% drop in retention, so..."
- Reference research or industry benchmarks when appropriate
- Show hypothesis-driven thinking: "My hypothesis was X, and I tested it by..."

**The Data Story Structure**:
1. **Context**: What was the situation/metric?
2. **Hypothesis**: What did you think was causing it?
3. **Analysis**: How did you investigate?
4. **Insight**: What did the data reveal?
5. **Action**: What did you do based on the data?
6. **Outcome**: What happened?

**Even Without Data**:
If you don't have exact numbers, estimate: "I believe it saved around 2-3 hours per week across the team." Estimates with reasoning are better than no data at all.`,
    tags: ["data-driven", "metrics", "analytics", "decision making"],
    keyPoints: [
      "Always quantify your impact where possible",
      "Structure data stories with hypothesis and outcome",
      "Use estimates with reasoning when exact data isn't available",
      "Show how data informed your decisions, not just that you had it",
      "Connect metrics to business outcomes",
    ],
    relatedTipIds: ["ps1", "ps3", "b1"],
  },
  {
    id: "ps3",
    title: "Creative Thinking and Innovation in Interviews",
    category: "Problem-Solving",
    difficulty: "Intermediate",
    readTime: 5,
    rating: 4.6,
    summary: "Demonstrate creative problem-solving and innovative thinking to stand out as a candidate.",
    content: `Companies want problem solvers who think beyond conventional solutions. Demonstrating creative thinking can significantly differentiate you from other candidates.

**Showing Creative Thinking**:
- **Challenge assumptions**: "What if we didn't need to solve it that way?"
- **Combine ideas**: Borrow concepts from different domains
- **Think at different scales**: What if we had unlimited budget? What if we had none?
- **Reverse the problem**: Instead of "How do we get more users?", ask "How could we make it easier for users to invite others?"

**Frameworks for Creative Thinking**:
1. **SCAMPER**: Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse
2. **First principles**: Break down to fundamental truths and rebuild
3. **Six thinking hats**: Look at a problem from 6 perspectives (data, emotion, risk, optimism, creativity, process)

**In Interviews, Show Your Creative Process**:
- "My first instinct was X, but I stepped back and considered Y"
- "We also brainstormed alternatives like Z, but chose this approach because..."
- "One unconventional idea I had was..." (even if it wasn't used)`,
    tags: ["creativity", "innovation", "lateral thinking", "brainstorming"],
    keyPoints: [
      "Show you explore multiple solutions before committing",
      "Use frameworks like SCAMPER or first principles",
      "Challenge assumptions explicitly in your answers",
      "Share unconventional ideas alongside conventional ones",
      "Connect creative ideas to business/technical constraints",
    ],
    relatedTipIds: ["ps1", "ps2", "b5"],
  },
  {
    id: "ps4",
    title: "Handling Ambiguous Questions with Confidence",
    category: "Problem-Solving",
    difficulty: "Advanced",
    readTime: 5,
    rating: 4.8,
    summary: "Navigate deliberately vague interview questions with a structured, confident approach.",
    content: `Some interview questions are intentionally vague to test how you handle ambiguity — a critical workplace skill. Examples: "How many golf balls fit in an airplane?" or "Design a system to improve our onboarding."

**Why Interviewers Ask Vague Questions**:
- To see if you ask for clarification (good!) or guess blindly (bad)
- To assess your reasoning process
- To understand how you handle uncertainty

**Framework for Ambiguous Questions**:
1. **Restate**: "Let me make sure I understand the question..."
2. **Ask clarifying questions**: "Are we optimizing for cost or speed?", "What's the scale?"
3. **State your assumptions**: "I'm going to assume..."
4. **Break it down**: Identify sub-components
5. **Reason out loud**: Show your thinking step by step
6. **Sense-check**: "Does that seem reasonable to you?"

**Fermi Estimation Example**:
"How many Starbucks are in the US?"
- US population: 330M
- Average Starbucks serves ~500 customers/day
- Americans visit Starbucks avg 2x/week → ~94M visits/day
- ~94M / 500 = ~188,000 (actual: ~16,000 — so adjust assumptions)

The process is more important than the exact number.`,
    tags: ["ambiguity", "estimation", "Fermi", "reasoning"],
    keyPoints: [
      "Always ask clarifying questions before diving in",
      "State your assumptions explicitly and get confirmation",
      "Show your reasoning process, not just the answer",
      "Sense-check your answer against intuition",
      "Comfort with ambiguity is itself a valuable signal",
    ],
    relatedTipIds: ["ps1", "ps2", "t1"],
  },
  {
    id: "ps5",
    title: "Product Thinking for Non-PM Roles",
    category: "Problem-Solving",
    difficulty: "Advanced",
    readTime: 6,
    rating: 4.5,
    summary: "Apply product thinking principles to demonstrate business acumen in technical and other interviews.",
    content: `Even in engineering and non-PM roles, showing product thinking — understanding users, business goals, and trade-offs — is a major differentiator.

**Core Product Thinking Skills**:
1. **User empathy**: Who uses this? What are their pain points?
2. **Prioritization**: What matters most right now and why?
3. **Trade-off reasoning**: What do we gain and lose with each option?
4. **Metrics orientation**: How do we know if it's working?
5. **Business awareness**: How does this generate or protect revenue?

**The PM Question Framework** (works for engineers too):
- Clarify the goal (what are we trying to achieve?)
- Define the user (who are we solving this for?)
- Identify pain points (what problems do they have?)
- Generate solutions (list 5 options)
- Evaluate and prioritize (pick top 2-3 with trade-offs)
- Define success metrics (how do we know it worked?)

**Applying to Engineering Interviews**:
When discussing technical decisions, always include the "why" in business terms: "I chose this architecture because it would scale to 10x users without a rewrite, which aligns with our 18-month growth plan."`,
    tags: ["product thinking", "business acumen", "trade-offs", "user empathy"],
    keyPoints: [
      "Show you understand users and business goals, not just technical specs",
      "Always discuss trade-offs in your decisions",
      "Connect technical choices to business impact",
      "Use metrics to define success even for technical solutions",
      "Practice the PM question framework for design questions",
    ],
    relatedTipIds: ["ps1", "ps4", "t3"],
  },
  {
    id: "ps6",
    title: "Prioritization Frameworks for Problem-Solving",
    category: "Problem-Solving",
    difficulty: "Intermediate",
    readTime: 5,
    rating: 4.6,
    summary: "Use proven frameworks to prioritize tasks, features, and solutions in interview questions.",
    content: `Interviewers frequently ask about prioritization: "How would you prioritize a backlog with 50 items?" or "If you could only fix 3 bugs, which would you choose?"

**Popular Prioritization Frameworks**:

**RICE Score**:
- Reach × Impact × Confidence / Effort
- Great for feature prioritization

**ICE Score** (simpler):
- Impact × Confidence × Ease
- Quick prioritization when data is limited

**MoSCoW Method**:
- Must have, Should have, Could have, Won't have (this time)

**Eisenhower Matrix**:
- Urgent+Important → Do now
- Important, not urgent → Schedule
- Urgent, not important → Delegate
- Neither → Eliminate

**The 2x2 Value vs. Effort Matrix**:
- High value, low effort → Do first
- High value, high effort → Plan carefully
- Low value, low effort → Do if time permits
- Low value, high effort → Avoid

In interviews, pick a framework, apply it, and explain why you chose it.`,
    tags: ["prioritization", "RICE", "frameworks", "decision making"],
    keyPoints: [
      "Know 2-3 prioritization frameworks and when to apply each",
      "Always state your criteria before prioritizing",
      "Show trade-off awareness in your prioritization",
      "Back prioritization with data or reasoning",
      "Acknowledge what you're NOT prioritizing and why",
    ],
    relatedTipIds: ["ps1", "ps4", "ps5"],
  },
  {
    id: "ps7",
    title: "Case Interview Fundamentals",
    category: "Problem-Solving",
    difficulty: "Advanced",
    readTime: 8,
    rating: 4.7,
    summary: "Master the structured thinking required for consulting-style case interviews.",
    content: `Case interviews are common in consulting, strategy, and increasingly in tech. They test structured thinking, business acumen, and communication.

**The Case Interview Process**:
1. **Listen carefully**: Understand the problem fully before speaking
2. **Ask clarifying questions**: Scope, constraints, what success looks like
3. **State your framework**: "I'd like to approach this by looking at X, Y, and Z"
4. **Work through structured**: One branch at a time, out loud
5. **Synthesize**: "Based on my analysis, I recommend X because Y"

**Common Case Frameworks**:
- **Profitability**: Revenue (price × volume) vs. Cost (fixed + variable)
- **Market entry**: Market size, competition, capabilities, financial case
- **M&A**: Strategic fit, financial fit, integration risks
- **Operations**: Bottlenecks, capacity, process efficiency

**Math in Cases**:
- Do simple mental math out loud
- Round numbers to make calculation easier
- Double-check by estimating from a different angle
- State units clearly

**Communication Tips**:
- Structure your answer with "First... Second... Finally..."
- Summarize periodically: "So far we've found that..."
- Ask for feedback: "Does this approach make sense?"`,
    tags: ["case interview", "consulting", "frameworks", "business analysis"],
    keyPoints: [
      "Always structure your approach before diving in",
      "Use issue trees to decompose complex business problems",
      "Practice mental math and estimation",
      "Synthesize findings into a clear recommendation",
      "Practice 20+ case interviews from case books",
    ],
    relatedTipIds: ["ps1", "ps4", "ps5"],
  },
  {
    id: "ps8",
    title: "Analytical Thinking Under Pressure",
    category: "Problem-Solving",
    difficulty: "Intermediate",
    readTime: 4,
    rating: 4.5,
    summary: "Techniques to stay calm and think clearly when facing tough interview questions.",
    content: `High-pressure interviews can cause even prepared candidates to freeze. Learning to manage stress and maintain analytical clarity is a critical skill.

**Managing Interview Anxiety**:
1. **Prepare physically**: Good sleep, exercise, and nutrition before the interview
2. **Controlled breathing**: 4-count inhale, 4-count hold, 4-count exhale
3. **Power posing**: 2 minutes of confident posture before the interview
4. **Reframe nerves**: Research shows that saying "I'm excited" not "I'm nervous" improves performance

**When You Get Stuck**:
- Ask for a moment: "Let me take a second to think about this"
- Restate the problem: "So what we're really asking is..."
- Think out loud: "My first instinct is X, but let me also consider Y..."
- Ask a clarifying question to buy time and re-focus
- Start with what you do know

**Under Time Pressure**:
- Prioritize key assumptions — don't get lost in details
- Use "for now, let me assume X" to keep moving
- Regularly check in: "Am I on the right track?"
- Aim for a good answer over a perfect one

The ability to perform under pressure is itself a data point for the interviewer.`,
    tags: ["pressure", "anxiety", "mental performance", "clarity"],
    keyPoints: [
      "Practice mindful breathing to reduce cortisol in the moment",
      "Reframe nerves as excitement — it's physiologically similar",
      "It's okay to ask for a moment to think",
      "Start with what you know and work outward",
      "Interviewers expect some hesitation — how you recover matters",
    ],
    relatedTipIds: ["ps1", "ps4", "b1"],
  },
];

// Helper: Get tips by category
export function getTipsByCategory(category: TipCategory): InterviewTip[] {
  return INTERVIEW_TIPS.filter(tip => tip.category === category);
}

// Helper: Get tip by id
export function getTipById(id: string): InterviewTip | undefined {
  return INTERVIEW_TIPS.find(tip => tip.id === id);
}

// Helper: Get related tips
export function getRelatedTips(tipId: string): InterviewTip[] {
  const tip = getTipById(tipId);
  if (!tip) return [];
  return tip.relatedTipIds
    .map(id => getTipById(id))
    .filter(Boolean) as InterviewTip[];
}

// Helper: Search tips
export function searchTips(query: string, category?: TipCategory, difficulty?: TipDifficulty): InterviewTip[] {
  const lowerQuery = query.toLowerCase();
  return INTERVIEW_TIPS.filter(tip => {
    const matchesQuery = !query || (
      tip.title.toLowerCase().includes(lowerQuery) ||
      tip.summary.toLowerCase().includes(lowerQuery) ||
      tip.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      tip.content.toLowerCase().includes(lowerQuery)
    );
    const matchesCategory = !category || tip.category === category;
    const matchesDifficulty = !difficulty || tip.difficulty === difficulty;
    return matchesQuery && matchesCategory && matchesDifficulty;
  });
}

export const CATEGORIES: TipCategory[] = ["Behavioral", "Technical", "HR", "Problem-Solving"];
export const DIFFICULTIES: TipDifficulty[] = ["Beginner", "Intermediate", "Advanced"];

export const CATEGORY_COLORS: Record<TipCategory, string> = {
  Behavioral: "bg-blue-100 text-blue-800",
  Technical: "bg-purple-100 text-purple-800",
  HR: "bg-green-100 text-green-800",
  "Problem-Solving": "bg-orange-100 text-orange-800",
};

export const DIFFICULTY_COLORS: Record<TipDifficulty, string> = {
  Beginner: "bg-emerald-100 text-emerald-800",
  Intermediate: "bg-amber-100 text-amber-800",
  Advanced: "bg-red-100 text-red-800",
};
