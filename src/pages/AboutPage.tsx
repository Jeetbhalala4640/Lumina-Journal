import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Sparkles, Terminal, Code2, Layers, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AboutPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Bio Header */}
      <section className="flex flex-col sm:flex-row gap-8 sm:gap-12 items-center sm:items-start text-center sm:text-left">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
          alt="Elena Rostova"
          className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl object-cover ring-4 ring-neutral-200 dark:ring-neutral-800 shadow-xl flex-shrink-0"
        />
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Author &amp; Architect</span>
          </div>

          <h1 className="font-serif font-bold text-3xl sm:text-5xl text-neutral-900 dark:text-white tracking-tight">
            Elena Rostova
          </h1>

          <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg leading-relaxed font-light">
            Principal Systems Architect based in Zurich. Writing on distributed system invariants, type-safe web engines, minimalist user interface craft, and the emerging paradigms of agentic workflows.
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="mailto:elena@lumina.journal"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Get in Touch</span>
            </a>
          </div>
        </div>
      </section>

      {/* Manifesto / Editorial Philosophy */}
      <section className="p-8 sm:p-10 rounded-3xl bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
        <h2 className="font-serif font-bold text-2xl text-neutral-900 dark:text-white">
          The Lumina Publishing Philosophy
        </h2>
        <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
          In a digital landscape overcrowded by ephemeral social soundbites and automated noise, <em>Lumina Journal</em> is built as a sanctum for rigorous, contemplative writing. Every essay is synthesized from first-principles engineering and real production battle tests.
        </p>
        <blockquote className="font-serif italic text-base border-l-2 border-brand-500 pl-4 text-neutral-600 dark:text-neutral-400 my-4">
          &ldquo;Software architecture is not the art of building complex things; it is the discipline of creating simplicity out of inherent chaos.&rdquo;
        </blockquote>
      </section>

      {/* Pillars of Engineering Craft */}
      <section className="space-y-6">
        <h2 className="font-serif font-bold text-2xl text-neutral-900 dark:text-white">
          Core Pillars of Focus
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
              Decoupled Architecture
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Writing systems that cleanly isolate core domain logic from UI presentation frameworks and third-party APIs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
              Interface Ergonomics
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Crafting minimal, quiet typography, fast micro-interactions, and accessible keyboard-first software.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white">
              Agentic Workflows
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Leveraging multi-agent loops, continuous AST validation, and human-in-the-loop pair engineering.
            </p>
          </div>
        </div>
      </section>

      {/* Career Timeline */}
      <section className="space-y-6">
        <h2 className="font-serif font-bold text-2xl text-neutral-900 dark:text-white">
          Chronology &amp; Background
        </h2>

        <div className="border-l-2 border-neutral-200 dark:border-neutral-800 ml-3 space-y-8 pl-6">
          <div className="relative">
            <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-brand-500 ring-4 ring-white dark:ring-neutral-950" />
            <span className="text-xs text-brand-600 dark:text-brand-400 font-semibold">2024 — Present</span>
            <h4 className="font-serif font-bold text-base text-neutral-900 dark:text-white mt-0.5">
              Principal Architect &amp; Writer — Lumina Systems
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
              Researching zero-latency edge distribution and authoring technical journals on modern web ergonomics.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-neutral-400 dark:bg-neutral-600 ring-4 ring-white dark:ring-neutral-950" />
            <span className="text-xs text-neutral-500">2020 — 2024</span>
            <h4 className="font-serif font-bold text-base text-neutral-900 dark:text-white mt-0.5">
              Staff Frontend Engineer — CloudScale Labs
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
              Architected real-time collaboration engines, web-based canvas environments, and design system infrastructures.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-neutral-400 dark:bg-neutral-600 ring-4 ring-white dark:ring-neutral-950" />
            <span className="text-xs text-neutral-500">2016 — 2020</span>
            <h4 className="font-serif font-bold text-base text-neutral-900 dark:text-white mt-0.5">
              Senior Systems Engineer — Apex Robotics
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
              Implemented telemetry dashboards and low-latency serialization pipelines for autonomous fleets.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
