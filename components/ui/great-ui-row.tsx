import type { TrainingExperience } from "@/types/cv";

type GreatUIRowProps = {
  item: TrainingExperience;
};

export function GreatUIRow({ item }: GreatUIRowProps) {
  return (
    <article className="revision-row">
      <div className="revision-marker" aria-hidden="true"><span /></div>
      <div className="revision-content">
        <div className="revision-header">
          <div><h3>{item.role}</h3><p>{item.institution}</p></div>
          <span className="caption tabular period">{item.period}</span>
        </div>
        <div className="meta-line"><span>{item.organization}</span><span>{item.mode}</span><span>{item.location}</span>{item.isCurrent && <span className="current-tag">Current</span>}</div>
        <ul className="impact-list">{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
        {item.upcomingModules && <div className="module-line"><span className="caption">Upcoming modules</span><div className="pill-row">{item.upcomingModules.map((module) => <span className="pill" key={module}>{module}</span>)}</div></div>}
      </div>
    </article>
  );
}
