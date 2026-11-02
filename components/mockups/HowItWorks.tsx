/** Design handoff (b). Swap this file if the frames change. */

export default function HowItWorks({ skillName }: { skillName: string }) {
  return (
    <ol className="hiw" aria-label="How it works, in three steps">
      <li className="hiw__card">
        <div
          className="hiw__art"
          role="img"
          aria-label={`An email in an inbox from Toby Egbuna. Subject: This week's skill, ${skillName}.`}
        >
          <div className="mini-mail" aria-hidden="true">
            <div className="mini-mail__row mini-mail__row--dim">
              <b>Benefits renewal</b>
              <span>Tue</span>
            </div>
            <div className="mini-mail__row mini-mail__row--active">
              <span className="mini-mail__unread" />
              <div>
                <b>Toby Egbuna</b>
                <span className="mini-mail__subj">This week&apos;s skill: {skillName}</span>
                <span className="mini-mail__prev">Plus one tip: write prompts like job descriptions.</span>
              </div>
            </div>
            <div className="mini-mail__row mini-mail__row--dim">
              <b>Calendar</b>
              <span>Mon</span>
            </div>
          </div>
        </div>
        <div className="hiw__text">
          <span className="hiw__num">1</span>
          <h3>Get the skill</h3>
          <p>Enter your work email. This week&apos;s skill opens now, and a new one arrives every Tuesday.</p>
        </div>
      </li>
      <li className="hiw__card">
        <div
          className="hiw__art"
          role="img"
          aria-label="A skill file named ta-portfolio-scorecard-prune.md. It contains intake questions, 8 steps, a definition of done, and common pitfalls."
        >
          <div className="mini-file" aria-hidden="true">
            <div className="mini-file__head">
              <span className="mini-file__icon">
                <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 1.5h5l3 3v10H4z" />
                  <path d="M9 1.5v3h3" />
                </svg>
              </span>
              <b>ta-portfolio-scorecard-prune.md</b>
            </div>
            <ul className="mini-file__toc">
              <li><span>Intake questions</span><i>✓</i></li>
              <li><span>Steps</span><i>8</i></li>
              <li><span>Definition of done</span><i>✓</i></li>
              <li><span>Common pitfalls</span><i>✓</i></li>
            </ul>
            <span className="mini-file__btn">Download skill</span>
          </div>
        </div>
        <div className="hiw__text">
          <span className="hiw__num">2</span>
          <h3>Download the file</h3>
          <p>One file per skill: the intake questions, the steps, and how to know it worked.</p>
        </div>
      </li>
      <li className="hiw__card">
        <div
          className="hiw__art"
          role="img"
          aria-label="A chat reply: 14 initiatives found, 5 with no owner, with two rows of a results table."
        >
          <div className="mini-chat" aria-hidden="true">
            <div className="mini-chat__user">Run the skill on our initiative list.</div>
            <div className="mini-chat__ai">
              <p>14 initiatives, 5 with no owner.</p>
              <div className="mini-chat__row">
                <span>Referral bonus pilot</span>
                <i className="tag tag--warn">No owner</i>
              </div>
              <div className="mini-chat__row">
                <span>Interviewer training v2</span>
                <i className="tag tag--ok">Owned</i>
              </div>
            </div>
          </div>
        </div>
        <div className="hiw__text">
          <span className="hiw__num">3</span>
          <h3>Run it in Claude or ChatGPT</h3>
          <p>Upload the file, add your team&apos;s data, and work through the steps.</p>
        </div>
      </li>
    </ol>
  );
}
