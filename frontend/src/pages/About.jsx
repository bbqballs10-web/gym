import React, { useEffect } from 'react';
import { Target, Users, Award } from 'lucide-react';

const About = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="info-page">
      <div className="info-container">
        <div className="info-header">
          <h1 className="info-title">About RAZE</h1>
          <p className="info-subtitle">Built by Discipline</p>
        </div>

        <div className="info-content">
          <section className="info-section about-hero">
            <div className="about-statement">
              <p className="lead-text">
                RAZE was born from a simple observation: the best athletes don't need loud gear to perform. They need gear that works as hard as they do—quietly, consistently, without distraction.
              </p>
            </div>
          </section>

          <section className="info-section">
            <h2>The Origin</h2>
            <p>
              Founded by former gymnasts, RAZE draws from a discipline that demands precision, control, and relentless repetition. In gymnastics, there's no room for excess—every movement is intentional, every detail matters.
            </p>
            <p>
              We brought that same philosophy to training wear. No unnecessary graphics. No hype. Just clean, technical gear designed to perform in the gym and look good outside of it.
            </p>
          </section>

          <section className="info-section">
            <h2>Our Philosophy</h2>
            <div className="values-grid">
              <div className="value-card">
                <Target className="value-icon" size={28} />
                <h3>Performance First</h3>
                <p>Every design decision starts with function. We use technical fabrics that move, breathe, and perform under pressure.</p>
              </div>
              <div className="value-card">
                <Award className="value-icon" size={28} />
                <h3>Minimal by Design</h3>
                <p>We strip away the unnecessary. What remains is essential—clean lines, subtle branding, timeless silhouettes.</p>
              </div>
              <div className="value-card">
                <Users className="value-icon" size={28} />
                <h3>Built for Athletes</h3>
                <p>Our gear is tested by athletes who train daily. We listen, iterate, and improve with every drop.</p>
              </div>
            </div>
          </section>

          <section className="info-section">
            <h2>The Drop Model</h2>
            <p>
              We don't mass-produce. Instead, we release products in limited quantities called "drops." This lets us maintain quality, reduce waste, and create gear that feels exclusive without artificial scarcity.
            </p>
            <p>
              When a drop sells out, it may not return in the same colorway. This isn't manufactured hype—it's intentional design. We'd rather make less and make it right.
            </p>
          </section>

          <section className="info-section">
            <h2>Looking Forward</h2>
            <p>
              RAZE is just getting started. We're building a brand for athletes who value discipline over distraction, performance over posturing. 
            </p>
            <p>
              Join us. Train hard. Stay focused.
            </p>
          </section>

          <section className="info-section about-cta">
            <div className="cta-box">
              <h3>Join the Movement</h3>
              <p>Sign up for early access to drops and exclusive content.</p>
              <a href="/#newsletter" className="btn-primary">Get Early Access</a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
