"use client";

import { useState } from "react";
import type { Project } from "@/types/cv";

type FluidTabsProps = {
  projects: Project[];
};

export function FluidTabs({ projects }: FluidTabsProps) {
  const [active, setActive] = useState(projects[0]?.slug ?? "");
  const project = projects.find((item) => item.slug === active) ?? projects[0];
  if (!project) return null;
  return (
    <div className="project-explorer">
      <div className="tab-list" role="tablist" aria-label="Project selection">
        {projects.map((item) => (
          <button key={item.slug} type="button" role="tab" aria-selected={active === item.slug} className={active === item.slug ? "tab active" : "tab"} onClick={() => setActive(item.slug)}>
            {item.title}
          </button>
        ))}
      </div>
      <div className="project-detail" role="tabpanel">
        <div className="project-detail-header">
          <div><h3>{project.title}</h3><p>{project.subtitle}{project.type ? ` · ${project.type}` : ""}</p></div>
          <span className="caption tabular">{project.period}</span>
        </div>
        <div className="pill-row">{project.stack.map((technology) => <span className="pill" key={technology}>{technology}</span>)}</div>
        <ul className="impact-list">{project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
      </div>
    </div>
  );
}
