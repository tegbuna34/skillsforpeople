/** Design handoff (c). Example builds, not past participants. */

export default function CohortPreview() {
  return (
    <section className="cohort" aria-label="People Builders cohort preview">
      <header className="cohort__head">
        <div>
          <p className="cohort__eyebrow">People Builders · 4 weeks · live</p>
          <p className="cohort__title">What you build, week by week</p>
        </div>
        <div className="seats" role="img" aria-label="10 seats per cohort">
          <span className="seats__dots" aria-hidden="true">
            {Array.from({ length: 10 }, (_, index) => (
              <i key={index} />
            ))}
          </span>
          <span className="seats__label">10 seats per cohort</span>
        </div>
      </header>

      <ol className="weeks">
        <li className="week">
          <p className="week__n">Week 1</p>
          <p className="week__t">Opportunity mapping</p>
          <div
            className="week__art"
            role="img"
            aria-label="A map of one workstream. Recruiting breaks into the interview scheduling workflow, which breaks into three tasks. Two are marked automate, one is marked keep."
          >
            <div className="tree" aria-hidden="true">
              <span className="node node--ws">Recruiting</span>
              <span className="node node--wf">Interview scheduling</span>
              <div className="tree__tasks">
                <span className="node node--task">Find panel times <i className="tag tag--ok">Automate</i></span>
                <span className="node node--task">Send invites <i className="tag tag--ok">Automate</i></span>
                <span className="node node--task">Debrief <i className="tag tag--plain">Keep</i></span>
              </div>
            </div>
          </div>
        </li>
        <li className="week">
          <p className="week__n">Week 2</p>
          <p className="week__t">Automations</p>
          <div
            className="week__art"
            role="img"
            aria-label="An automated workflow in three steps. When an offer is signed in the ATS, build the onboarding checklist, then email the hiring manager."
          >
            <div className="flow" aria-hidden="true">
              <span className="flow__step"><b>When</b>Offer signed in the ATS</span>
              <span className="flow__arrow" />
              <span className="flow__step"><b>Then</b>Build the onboarding checklist</span>
              <span className="flow__arrow" />
              <span className="flow__step"><b>Then</b>Email the hiring manager</span>
            </div>
          </div>
        </li>
        <li className="week">
          <p className="week__n">Week 3</p>
          <p className="week__t">An application</p>
          <div
            className="week__art"
            role="img"
            aria-label="A small app window called Interview scorecard, with a candidate field, a 1 to 5 rating, and a submit button."
          >
            <div className="app" aria-hidden="true">
              <div className="app__bar">
                <i /><i /><i /><span>Interview scorecard</span>
              </div>
              <div className="app__body">
                <label>Candidate</label>
                <span className="app__field">Candidate 014</span>
                <label>Role fit</label>
                <span className="app__rating">
                  <i className="on" /><i className="on" /><i className="on" /><i className="on" /><i />
                </span>
                <span className="app__btn">Submit</span>
              </div>
            </div>
          </div>
        </li>
        <li className="week">
          <p className="week__n">Week 4</p>
          <p className="week__t">Think like a founder, and demo day</p>
          <div
            className="week__art"
            role="img"
            aria-label="A demo slide with three headings: what I built, who uses it, and what I'd build next."
          >
            <div className="slide" aria-hidden="true">
              <span className="slide__kicker">Demo day</span>
              <span className="slide__title">Interview scorecard</span>
              <ul>
                <li>What I built</li>
                <li>Who uses it</li>
                <li>What I&apos;d build next</li>
              </ul>
            </div>
          </div>
        </li>
      </ol>

      <footer className="cohort__foot">
        <span className="cohort__label">You walk out with</span>
        <ul className="chips">
          <li>2 automated workflows</li>
          <li>2 apps</li>
          <li>A map of your team&apos;s work</li>
          <li>A demo for your manager</li>
        </ul>
      </footer>
    </section>
  );
}
