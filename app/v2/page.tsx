"use client";

import { ArrowUpRight, ExternalLink, Mail, Move, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import DotGridBackground from "@/components/ui/dot-grid-background";
import { cvData } from "@/data/cv";

export default function V2Page() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem("icareer-theme");
    if (stored === "light" || stored === "dark") setTheme(stored);
  }, []);

  return (
    <main className={`v2-shell ${theme}`}>
      <DotGridBackground
        cols={28}
        dotSize={3}
        dotSpacing={5}
        dotColor={theme === "dark" ? "#a78bfa" : "#6941c6"}
        backgroundColor={theme === "dark" ? "#131316" : "#f9fafb"}
        scaleFactor={7}
        inertiaDamping={0.92}
        inertia
      >
        <div className="v2-page">
          <header className="v2-header">
            <span className="v2-brand">AH<span>•</span>L / CV v2</span>
            <div className="v2-actions">
              <span className="v2-drag-hint"><Move size={13} /> drag field</span>
              <button type="button" className="v2-button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme">
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              </button>
              <a className="v2-button" href="/" aria-label="Open original CV">v1 <ArrowUpRight size={13} /></a>
            </div>
          </header>

          <section className="v2-hero">
            <p className="v2-kicker">Software developer · interactive profile</p>
            <h1>{cvData.contact.name}</h1>
            <p className="v2-summary">{cvData.summary}</p>
            <div className="v2-links">
              <a className="v2-primary" href={`mailto:${cvData.contact.email}`}><Mail size={15} /> Start a conversation</a>
              <a className="v2-link" href={cvData.contact.github} target="_blank" rel="noreferrer"><ExternalLink size={14} /> GitHub</a>
            </div>
          </section>

          <section className="v2-grid">
            <article className="v2-panel">
              <span className="v2-label">Current track</span>
              <h2>{cvData.training[0].role}</h2>
              <p>{cvData.training[0].institution} · {cvData.training[0].period}</p>
              <span className="v2-status">● active</span>
            </article>
            <article className="v2-panel">
              <span className="v2-label">Selected work</span>
              <h2>{cvData.projects[0].title}</h2>
              <p>{cvData.projects[0].subtitle} · {cvData.projects[0].period}</p>
              <div className="v2-pills">{cvData.projects[0].stack.slice(0, 4).map((item) => <span key={item}>{item}</span>)}</div>
            </article>
          </section>
        </div>
      </DotGridBackground>
    </main>
  );
}
