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
                <h4>Sr.QA Automation Engineer</h4>
                <h5>Electronic Arts [Vendor Engagement via Adecco]</h5>
              </div>
              <h3>2025 - Present</h3>
            </div>
            <p>
              Performed manual testing for EA Help NextGen platform, APItesting using Postman.
              Executed automated regression testing using Playwright with JavaScript.
              Tested AI chatbots and RAG agents, validating search summaries.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Software Engineer II</h4>
                <h5>Electronic Arts [TFT]</h5>
              </div>
              <h3>2023 - 2025</h3>
            </div>
            <p>
              Designed and implemented a WebDriverIO automation framework, improving regression efficiency by 50%.
              Optimized automation modules using GitHub Copilot and managed CI/CD executions via Jenkins.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Software Engineer</h4>
                <h5>Wipro Limited</h5>
              </div>
              <h3>2022 - 2023</h3>
            </div>
            <p>
              Automated 20+ critical API scenarios using Rest Assured and Selenium.
              Developed EIT and SIT frameworks to validate APIs in pre-production.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>QA Engineer</h4>
                <h5>Tecra System Pvt Ltd</h5>
              </div>
              <h3>2018 - 2022</h3>
            </div>
            <p>
              Built and maintained UI automation frameworks with Selenium (Java), Cucumber BDD, and Maven.
              Implemented cross-browser testing and reporting via Extent Reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
