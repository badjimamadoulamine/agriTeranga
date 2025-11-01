import Header from '../components/Header'
import Hero from '../components/Hero'
import AboutSection from '../components/AboutSection'
import PopularProducts from '../components/PopularProducts'
import BenefitsSection from '../components/BenefitsSection'
import TestimonialsSection from '../components/TestimonialsSection'
import AppointmentForm from '../components/AppointmentForm'
import LocalAchievements from '../components/LocalAchievements'
import BlogSection from '../components/BlogSection'
import Footer from '../components/Footer'

const Home = ({ onOpenRegister, onOpenLogin }) => {
  return (
    <div className="min-h-screen">
      <Header onRegisterClick={onOpenRegister} onLoginClick={onOpenLogin} />
      <main>
        <Hero />
        <AboutSection />
        <PopularProducts />
        <BenefitsSection />
        <TestimonialsSection />
        <AppointmentForm />
        <LocalAchievements />
        <BlogSection />
      </main>
      <Footer />
    </div>
  )
}

export default Home