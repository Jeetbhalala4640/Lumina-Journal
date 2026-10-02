import { Blog, Category, User } from '../types';

export const INITIAL_USER: User = {
  id: 'usr-author-1',
  name: 'Elena Rostova',
  email: 'elena@lumina.journal',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  role: 'author',
  title: 'Principal Systems Architect & Essayist',
  bio: 'Writing on distributed systems, modern frontend ergonomics, human-centered interfaces, and the philosophy of building resilient software.',
  socialLinks: {
    twitter: 'https://twitter.com',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    website: 'https://lumina.journal',
  },
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-engineering',
    name: 'Engineering',
    slug: 'engineering',
    description: 'Deep dives into distributed architecture, performance, and craftsmanship.',
    color: '#3b82f6',
  },
  {
    id: 'cat-design',
    name: 'Design Systems',
    slug: 'design-systems',
    description: 'Interface ergonomics, typography, micro-interactions, and visual harmony.',
    color: '#8b5cf6',
  },
  {
    id: 'cat-ai',
    name: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    description: 'Frontier models, agentic workflows, and creative computing.',
    color: '#10b981',
  },
  {
    id: 'cat-philosophy',
    name: 'Essays & Craft',
    slug: 'essays-and-craft',
    description: 'Reflections on deliberate practice, writing, and long-term thinking.',
    color: '#d95d38',
  },
  {
    id: 'cat-leadership',
    name: 'Product & Strategy',
    slug: 'product-strategy',
    description: 'Navigating technical debt, high-leverage teams, and architectural strategy.',
    color: '#ec4899',
  },
];

export const INITIAL_BLOGS: Blog[] = [
  {
    id: 'blog-1',
    slug: 'crafting-resilient-frontend-architectures',
    title: 'Crafting Resilient Frontend Architectures in the Modern Web Era',
    subtitle: 'Principles for building sustainable, type-safe web applications that outlive current framework hypes.',
    excerpt: 'How we decouple business invariants from rendering layers, leverage edge computing, and build UI states that remain robust at enterprise scale.',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    coverImageCaption: 'Distributed systems topology in perspective — NASA Earth Observatory',
    category: 'Engineering',
    tags: ['Architecture', 'TypeScript', 'React', 'Performance', 'WebDev'],
    status: 'published',
    author: {
      id: INITIAL_USER.id,
      name: INITIAL_USER.name,
      avatar: INITIAL_USER.avatar,
      bio: INITIAL_USER.bio || '',
      title: INITIAL_USER.title || '',
    },
    readingTime: 6,
    views: 14250,
    likes: 482,
    featured: true,
    popular: true,
    createdAt: '2026-09-12T10:00:00.000Z',
    updatedAt: '2026-09-18T14:30:00.000Z',
    publishedAt: '2026-09-14T08:00:00.000Z',
    seo: {
      metaTitle: 'Crafting Resilient Frontend Architectures | Lumina Journal',
      metaDescription: 'Discover architectural patterns for decoupled, maintainable frontend systems with TypeScript and modern web principles.',
      keywords: ['frontend architecture', 'typescript', 'software engineering', 'web performance'],
    },
    content: `
      <p>When software teams experience architectural degradation, the culprit is rarely the choice of framework. Rather, it is the failure to distinguish between <strong>transient presentation mechanics</strong> and <strong>core domain invariants</strong>.</p>
      
      <h2>1. The Illusion of Framework Longevity</h2>
      <p>Over the past decade, JavaScript tooling has undergone tectonic shifts. Frameworks rise with promises of zero-cost abstractions, only to be replaced by next-generation primitives. If your application logic is intertwined with a specific component lifecycle, migrations become existential threats.</p>
      
      <blockquote>
        "Architecture is about making the important decisions early, and keeping the options open for as long as possible."
      </blockquote>
      
      <h3>Key Pillars of Decoupled Architecture</h3>
      <ul>
        <li><strong>Pure Domain Services:</strong> Business rules expressed in vanilla TypeScript with zero DOM or framework dependencies.</li>
        <li><strong>Unidirectional Data Flow:</strong> Predictable state transitions validated through schema boundaries.</li>
        <li><strong>Optimistic UI with Conflict Resolution:</strong> Instant perceived latency paired with resilient background sync.</li>
      </ul>

      <h2>2. Concrete Architecture Patterns</h2>
      <p>Consider the following state orchestrator pattern designed to decouple API fetching from view components:</p>

      <pre><code class="language-typescript">interface EntityRepository&lt;T, ID&gt; {
  findById(id: ID): Promise&lt;T | null&gt;;
  save(entity: T): Promise&lt;void&gt;;
  subscribe(callback: (event: SyncEvent&lt;T&gt;) =&gt; void): () =&gt; void;
}

export class ArticleService {
  constructor(private readonly repo: EntityRepository&lt;Article, string&gt;) {}

  async publish(articleId: string): Promise&lt;Result&lt;Article, PublishError&gt;&gt; {
    const article = await this.repo.findById(articleId);
    if (!article) return Result.err(new ArticleNotFoundError(articleId));

    const validated = article.markPublished(new Date());
    await this.repo.save(validated);
    return Result.ok(validated);
  }
}</code></pre>

      <h2>3. Benchmarks & Operational Metrics</h2>
      <p>Here is an empirical comparison of architecture styles across 4 production iterations:</p>

      <table>
        <thead>
          <tr>
            <th>Architecture Style</th>
            <th>First Input Delay (ms)</th>
            <th>Refactor Time (hrs)</th>
            <th>Test Coverage (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Monolithic Component Logic</td>
            <td>142ms</td>
            <td>48 hrs</td>
            <td>42%</td>
          </tr>
          <tr>
            <td>Hook-Centric Coupling</td>
            <td>68ms</td>
            <td>24 hrs</td>
            <td>68%</td>
          </tr>
          <tr>
            <td><strong>Decoupled Domain Layer</strong></td>
            <td><strong>18ms</strong></td>
            <td><strong>4 hrs</strong></td>
            <td><strong>94%</strong></td>
          </tr>
        </tbody>
      </table>

      <h2>4. Strategic Recommendations</h2>
      <ol>
        <li>Define your data schemas before touching component JSX.</li>
        <li>Treat network calls as asynchronous side effects, never as inline render logic.</li>
        <li>Build for the next developer who will inherit your system in 24 months.</li>
      </ol>
      <p>By enforcing clear boundaries, you construct applications that weather industry changes without structural collapse.</p>
    `,
  },
  {
    id: 'blog-2',
    slug: 'the-art-of-quiet-software-and-minimal-ui',
    title: 'The Art of Quiet Software: Designing Minimalist, Content-First Interfaces',
    subtitle: 'Why eliminating interface noise is the highest form of respect for human attention.',
    excerpt: 'An inquiry into micro-typography, generous whitespace, subdued chromatic palettes, and interfaces that get out of the reader’s way.',
    coverImage: 'https://images.unsplash.com/photo-1507842229451-79b1be886a27?auto=format&fit=crop&w=1600&q=80',
    coverImageCaption: 'Subtle light interplay in contemporary architectural spaces',
    category: 'Design Systems',
    tags: ['Design', 'Minimalism', 'Typography', 'UI/UX', 'Productivity'],
    status: 'published',
    author: {
      id: INITIAL_USER.id,
      name: INITIAL_USER.name,
      avatar: INITIAL_USER.avatar,
      bio: INITIAL_USER.bio || '',
      title: INITIAL_USER.title || '',
    },
    readingTime: 4,
    views: 9840,
    likes: 350,
    featured: false,
    popular: true,
    createdAt: '2026-09-20T11:15:00.000Z',
    updatedAt: '2026-09-22T16:00:00.000Z',
    publishedAt: '2026-09-21T09:00:00.000Z',
    seo: {
      metaTitle: 'The Art of Quiet Software | Lumina Journal',
      metaDescription: 'Why eliminating interface noise creates superior editorial experiences and respects reader focus.',
      keywords: ['minimalist design', 'editorial typography', 'ui ux', 'quiet software'],
    },
    content: `
      <p>Every pixel on a screen competes for cognitive bandwidth. In an era dominated by aggressive notification badges, rainbow gradients, and gamified animations, creating <em>quiet software</em> is a deliberate act of craft.</p>
      
      <h2>1. The Typography-First Doctrine</h2>
      <p>When you strip away distracting badges and decorative borders, typography carries the entire weight of communication. Editorial rhythm is established through calculated proportional scaling, precise line-heights, and optical kerning.</p>

      <blockquote>
        "Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away." — Antoine de Saint-Exupéry
      </blockquote>

      <h3>Four Rules for Quiet Typography</h3>
      <ul>
        <li><strong>Scale restrains:</strong> Limit your type system to no more than four distinct optical sizes.</li>
        <li><strong>Line length harmony:</strong> Keep body text between 55 and 75 characters per line to minimize eye fatigue.</li>
        <li><strong>Intentional Contrast:</strong> Use deep charcoal instead of harsh pure black on white backgrounds.</li>
      </ul>

      <h2>2. Subtle Animation as Feedback, Not Spectacle</h2>
      <p>Animations should last between 150ms and 250ms with custom cubic bezier curves (such as <code>cubic-bezier(0.16, 1, 0.3, 1)</code>). If the user notices the animation before noticing the content, the timing is too slow.</p>

      <h2>3. The Reader's Sanctum</h2>
      <p>When designing publishing platforms, respect the sacred state of immersion. Give readers uninterrupted reading space, dynamic progress feedback, and effortless typography toggle controls.</p>
    `,
  },
  {
    id: 'blog-3',
    slug: 'agentic-ai-and-the-future-of-coding',
    title: 'Agentic Systems & The Evolution of Engineering Workflows',
    subtitle: 'From predictive autocomplete to collaborative synthesis in autonomous software development.',
    excerpt: 'Exploring how multi-agent loops, context curation, and tool verification are reshaping how we architect and ship complex products.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
    coverImageCaption: 'Generative geometric forms simulating multidimensional neural latent spaces',
    category: 'Artificial Intelligence',
    tags: ['AI', 'Machine Learning', 'FutureOfWork', 'DevTools'],
    status: 'published',
    author: {
      id: INITIAL_USER.id,
      name: INITIAL_USER.name,
      avatar: INITIAL_USER.avatar,
      bio: INITIAL_USER.bio || '',
      title: INITIAL_USER.title || '',
    },
    readingTime: 7,
    views: 18420,
    likes: 620,
    featured: true,
    popular: true,
    createdAt: '2026-09-24T14:00:00.000Z',
    updatedAt: '2026-09-28T18:20:00.000Z',
    publishedAt: '2026-09-25T12:00:00.000Z',
    seo: {
      metaTitle: 'Agentic AI & Software Engineering | Lumina Journal',
      metaDescription: 'A deep dive into multi-agent systems, verification loops, and the future of human-agent pair programming.',
      keywords: ['agentic ai', 'software engineering', 'ai coding', 'devtools'],
    },
    content: `
      <p>We have moved beyond the introductory phase of generative AI. The early novelty of simple single-turn prompts has given way to deterministic execution loops, autonomous subagent delegation, and continuous verification.</p>

      <h2>1. The Anatomy of an Agentic Loop</h2>
      <p>Modern agent frameworks succeed not because the underlying LLMs are omniscient, but because they are equipped with tightly constrained feedback loops:</p>

      <pre><code class="language-bash">User Goal
   │
   ▼
[ Planner ] ──► [ Execution Subagent ] ──► [ Tool Invocation ]
   ▲                                               │
   │                                               ▼
   └─────────── [ Automated Verification ] ◄───────┘</code></pre>

      <h2>2. Verification as the Core Moat</h2>
      <p>Without verification (compilation, automated tests, AST linting, DOM inspection), code generation produces compounding errors. When agents can evaluate their own outputs against deterministic test suites, reliability increases non-linearly.</p>

      <blockquote>
        "The highest-leverage engineers in 2026 are not the fastest typists; they are the most rigorous architects of verification specifications."
      </blockquote>

      <h2>3. The Hybrid Human-Agent Symbiosis</h2>
      <p>Human judgment remains irreplaceable in system boundaries, ethical considerations, and qualitative taste. Machines handle repetitive refactorings, boilerplate scaffoldings, and edge-case testing.</p>
    `,
  },
  {
    id: 'blog-4',
    slug: 'notes-on-engineering-taste-and-craftsmanship',
    title: 'Notes on Engineering Taste, Mastery, and Deliberate Practice',
    subtitle: 'Reflections on why the invisible details determine whether software endures.',
    excerpt: 'Thoughts on naming conventions, error messages as user interfaces, edge cases, and the patience required to build lasting artifacts.',
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80',
    coverImageCaption: 'The desk of an artisan — focused, intentional, and composed',
    category: 'Essays & Craft',
    tags: ['Craftsmanship', 'Productivity', 'Career', 'Philosophy'],
    status: 'published',
    author: {
      id: INITIAL_USER.id,
      name: INITIAL_USER.name,
      avatar: INITIAL_USER.avatar,
      bio: INITIAL_USER.bio || '',
      title: INITIAL_USER.title || '',
    },
    readingTime: 5,
    views: 7310,
    likes: 295,
    featured: false,
    popular: false,
    createdAt: '2026-09-28T09:00:00.000Z',
    updatedAt: '2026-09-30T10:00:00.000Z',
    publishedAt: '2026-09-29T10:00:00.000Z',
    seo: {
      metaTitle: 'Notes on Engineering Taste | Lumina Journal',
      metaDescription: 'Why taste, precision, and craftsmanship matter in modern software development.',
      keywords: ['engineering taste', 'craftsmanship', 'software leadership'],
    },
    content: `
      <p>Taste is often considered subjective, but in engineering, taste manifests as clarity, predictability, and empathy for whoever reads your code next.</p>
      
      <h2>1. The Empathy of Error Messages</h2>
      <p>A mediocre system throws an unhandled exception or cryptic code. A well-crafted system treats error states with the same design rigor as the primary success flow.</p>

      <h2>2. The Discipline of Saying No</h2>
      <p>Every feature added is an ongoing tax on documentation, performance, testing, and cognitive overhead. Great products are defined by what they omit.</p>
    `,
  },
  {
    id: 'blog-5',
    slug: 'building-zero-latency-edge-apis',
    title: 'Building Zero-Latency Edge APIs with Distributed Caching',
    subtitle: 'A practical guide to multi-region replication, stale-while-revalidate strategies, and edge compute.',
    excerpt: 'Exploring real-time synchronization, edge compute runtimes, and sub-10ms response times across international audiences.',
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
    coverImageCaption: 'High density datacenter fiber interconnects',
    category: 'Engineering',
    tags: ['Edge', 'Performance', 'Backend', 'API', 'Caching'],
    status: 'draft',
    author: {
      id: INITIAL_USER.id,
      name: INITIAL_USER.name,
      avatar: INITIAL_USER.avatar,
      bio: INITIAL_USER.bio || '',
      title: INITIAL_USER.title || '',
    },
    readingTime: 8,
    views: 0,
    likes: 0,
    featured: false,
    popular: false,
    createdAt: '2026-10-01T15:00:00.000Z',
    updatedAt: '2026-10-02T19:45:00.000Z',
    publishedAt: null,
    seo: {
      metaTitle: 'Building Zero-Latency Edge APIs | Lumina Journal',
      metaDescription: 'Draft notes on multi-region edge architectures.',
      keywords: ['edge compute', 'api architecture', 'distributed systems'],
    },
    content: `
      <p><em>(Draft in progress)</em></p>
      <h2>Executive Summary</h2>
      <p>Modern applications can no longer afford centralized roundtrips across continents. By placing compute and read caches within 10ms of end users, we achieve instantaneous rendering.</p>
      <h2>Architecture Schema</h2>
      <p>Reviewing edge workers with geographic routing...</p>
    `,
  },
];
