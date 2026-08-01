import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Senior QA Automation Engineer / SE II</h4>
                <h5>Electronic Arts [via Adecco]</h5>
              </div>
              <h3>2023 – Present</h3>
            </div>
            <p>
              Built Playwright (JS) UI/API frameworks automating 500+ cases with
              parallel runs. Ran Gatling load tests for 1,000+ users, validated
              200+ REST APIs, and wired suites into GitLab CI/CD. Analyzed
              production issues via Kibana/Argo CD, and validated GA4/GTM, RAG
              AI agents, Akamai redirects, Redis sessions, and Contentful CMS.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Software Engineer</h4>
                <h5>Wipro Limited</h5>
              </div>
              <h3>2022 – 2023</h3>
            </div>
            <p>
              Validated 300+ REST APIs with Postman. Built 100+ EIT scripts and
              150+ SIT scripts using Selenium and Java, cutting integration
              issues by 30%. Maintained 500+ reports in PractiTest and performed
              GCP database validation.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>QA Engineer</h4>
                <h5>Tecra System Pvt Ltd</h5>
              </div>
              <h3>2018 – 2022</h3>
            </div>
            <p>
              Delivered 150+ Selenium/Java BDD cases (+65% automation coverage).
              Managed builds with Maven and Git, produced 100+ Extent Reports,
              and supported performance testing with 50+ JMeter load scripts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
