/** Tuesday email picture from the home handoff. */

export default function IssuePreview({
  skillName,
  skillLine,
}: {
  skillName: string;
  skillLine: string;
}) {
  return (
    <div
      className="issue"
      role="img"
      aria-label={`Preview of a Tuesday email from Toby Egbuna: this week's skill, ${skillName}, and a tip on writing prompts like job descriptions.`}
    >
      <div className="issue__meta" aria-hidden="true">
        <span>From</span>
        <b>Toby at Skills for People</b>
        <span>Subject</span>
        <b>This week&apos;s skill: {skillName}</b>
      </div>
      <div className="issue__body" aria-hidden="true">
        <div className="issue__block">
          <small>This week&apos;s skill</small>
          <b>{skillName}</b>
          <p>{skillLine}</p>
        </div>
        <div className="issue__block issue__block--tip">
          <small>Tip</small>
          <b>Write your prompts like job descriptions</b>
          <p>Say what the role is, what good work looks like, and what&apos;s out of scope.</p>
        </div>
      </div>
    </div>
  );
}
