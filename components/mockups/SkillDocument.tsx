import type { SkillExcerpt } from "@/lib/skill-excerpt";

/** This week's skill as a document excerpt. Sized like Design's hero frame. */
export default function SkillDocument({ excerpt }: { excerpt: SkillExcerpt }) {
  const alt = `This week's skill, ${excerpt.name}. ${excerpt.what} Steps include ${excerpt.steps.slice(0, 3).join(", ")}.`;
  return (
    <div className="hero__visual">
      <article className="skill-doc" role="img" aria-label={alt}>
        <header className="skill-doc__bar" aria-hidden="true">
          <span className="skill-doc__mark" />
          <span className="skill-doc__file">{excerpt.filename}</span>
        </header>
        <div className="skill-doc__body" aria-hidden="true">
          <p className="skill-doc__label">Skill</p>
          <h3 className="skill-doc__title">{excerpt.name}</h3>
          <p className="skill-doc__kicker">What it does</p>
          <p className="skill-doc__what">{excerpt.what}</p>
          {excerpt.steps.length > 0 && (
            <>
              <p className="skill-doc__kicker">From the file</p>
              <ol className="skill-doc__steps">
                {excerpt.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </>
          )}
        </div>
      </article>
      <div className="hero__badge">
        <b>This week&apos;s skill</b>
        <span>{excerpt.name}</span>
        <small>Opens with your free account</small>
      </div>
    </div>
  );
}
