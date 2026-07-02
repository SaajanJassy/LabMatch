import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Problem from './components/Problem';
import HowItWorks from './components/HowItWorks';
import Trust from './components/Trust';
import Footer from './components/Footer';
import { motion } from 'framer-motion';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <HowItWorks />
        <Trust />

        {/* Contact/Enquiry section */}
        <section id="contact" style={{ padding: 'var(--space-2xl) 0', backgroundColor: 'var(--sand)' }}>
          <div className="section-container" style={{ textAlign: 'center', maxWidth: '600px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              viewport={{ once: true }}
            >
              <h2 style={{ marginBottom: 'var(--space-md)' }}>Begin your match.</h2>
              <p style={{ color: '#4a4640', marginBottom: 'var(--space-xl)', marginInline: 'auto' }}>
                Whether you are a startup needing specialized lab space or a landlord with a property to fill, our team provides a high-touch, tailored service to guide you through the process.
              </p>
              <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="mailto:enquiry@labmatch.co.uk?subject=Startup%20Lab%20Space%20Enquiry" className="cta-button">
                  Find Lab Space
                </a>
                <a href="mailto:enquiry@labmatch.co.uk?subject=Landlord%20Property%20Enquiry" className="cta-button cta-button--outline">
                  List Lab Space
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
